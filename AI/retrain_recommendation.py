"""Retrain the book recommendation model from updated interaction data."""
import argparse
import csv
import json
import os
import random
from datetime import datetime, timezone

import pandas as pd
from mlxtend.frequent_patterns import apriori, association_rules
from mlxtend.preprocessing import TransactionEncoder
from sklearn.model_selection import train_test_split

DEFAULT_DATA_PATH = os.environ.get(
    "READVIBE_RECOMMENDATION_DATA_PATH",
    os.path.join(os.path.dirname(__file__), "amazon_books_reviews_merged_2014_2025.csv"),
)
DEFAULT_MODEL_DIR = os.environ.get(
    "READVIBE_RECOMMENDATION_MODEL_DIR",
    os.path.join(os.path.dirname(__file__), "artifacts"),
)
DEFAULT_MIN_SUPPORT = float(os.environ.get("READVIBE_RECOMMENDATION_MIN_SUPPORT", "0.02"))
DEFAULT_MIN_CONFIDENCE = float(os.environ.get("READVIBE_RECOMMENDATION_MIN_CONFIDENCE", "0.5"))
DEFAULT_TOP_K = int(os.environ.get("READVIBE_RECOMMENDATION_TOP_K", "5"))


def load_transaction_data(data_path: str) -> pd.DataFrame:
    records = []
    with open(data_path, "r", encoding="utf-8", errors="replace") as file_handle:
        reader = csv.DictReader(file_handle)
        for row in reader:
            records.append(row)

    frame = pd.DataFrame(records)
    if frame.empty:
        raise ValueError("No rows were loaded from the source dataset.")

    if "User_id" not in frame.columns or "Id" not in frame.columns:
        raise ValueError("The dataset must contain 'User_id' and 'Id' columns.")

    cleaned = frame[["User_id", "Id"]].copy()
    cleaned["User_id"] = cleaned["User_id"].astype(str).str.strip()
    cleaned["Id"] = cleaned["Id"].astype(str).str.strip()
    cleaned = cleaned.dropna()
    cleaned = cleaned[(cleaned["User_id"] != "") & (cleaned["Id"] != "")]
    return cleaned


def build_transactions(cleaned_frame: pd.DataFrame):
    user_books = (
        cleaned_frame.groupby("User_id")["Id"]
        .agg(lambda values: list(sorted(set(values))))
        .reset_index()
        .rename(columns={"Id": "book_ids"})
    )

    multi_book_users = user_books[user_books["book_ids"].map(len) > 1].copy()
    transactions = multi_book_users["book_ids"].tolist()
    if not transactions:
        raise ValueError("Not enough multi-book users to train recommendations.")
    return transactions


def train_recommendation_rules(transactions, min_support: float, min_confidence: float):
    train_transactions, test_transactions = train_test_split(
        transactions,
        test_size=0.25,
        random_state=42,
    )

    encoder = TransactionEncoder()
    train_matrix = encoder.fit(train_transactions).transform(train_transactions)
    train_df = pd.DataFrame(train_matrix, columns=encoder.columns_)

    frequent_itemsets = apriori(
        train_df,
        min_support=min_support,
        use_colnames=True,
    )

    if frequent_itemsets.empty:
        raise ValueError("No frequent itemsets were found. Lower min_support or add more data.")

    rules = association_rules(
        frequent_itemsets,
        metric="confidence",
        min_threshold=min_confidence,
    )

    if rules.empty:
        raise ValueError("No association rules were generated. Lower min_confidence or add more data.")

    return {
        "rules": rules,
        "frequent_itemsets": frequent_itemsets,
        "train_transactions": train_transactions,
        "test_transactions": test_transactions,
    }


def recommend_books(user_books, rules_frame, top_k: int):
    recommendations = {}
    user_books = set(user_books)

    for _, row in rules_frame.iterrows():
        antecedent = set(row["antecedents"])
        consequent = set(row["consequents"])

        if antecedent.issubset(user_books):
            for book in consequent:
                if book not in user_books:
                    recommendations[book] = recommendations.get(book, 0) + float(row["confidence"])

    ranked_books = sorted(recommendations.items(), key=lambda item: item[1], reverse=True)
    return [book for book, _ in ranked_books[:top_k]]


def evaluate_model(test_transactions, rules_frame, top_k: int):
    hits = 0
    total = 0

    for user_books in test_transactions:
        if len(user_books) < 2:
            continue

        total += 1
        hidden_book = random.choice(user_books)
        input_books = list(set(user_books) - {hidden_book})
        recommended = recommend_books(input_books, rules_frame, top_k=top_k)

        if hidden_book in recommended:
            hits += 1

    hit_rate = hits / total if total > 0 else 0
    return hit_rate, total, hits


def save_model_artifacts(
    rules_frame,
    frequent_itemsets_frame,
    cleaned_data_frame,
    model_dir: str,
    min_support: float,
    min_confidence: float,
):
    os.makedirs(model_dir, exist_ok=True)

    artifact_path = os.path.join(model_dir, "latest_rules.json")
    snapshot_path = os.path.join(model_dir, "training_data_snapshot.csv")

    payload = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "min_support": min_support,
        "min_confidence": min_confidence,
        "rules": rules_frame.to_dict(orient="records"),
        "frequent_itemsets": frequent_itemsets_frame.to_dict(orient="records"),
    }

    with open(artifact_path, "w", encoding="utf-8") as file_handle:
        json.dump(payload, file_handle, default=str, indent=2)

    cleaned_data_frame.to_csv(snapshot_path, index=False)
    return artifact_path, snapshot_path


def parse_args():
    parser = argparse.ArgumentParser(description="Retrain ReadVibe Apriori recommendations on a schedule.")
    parser.add_argument("--data-path", default=DEFAULT_DATA_PATH, help="Path to the interaction CSV file.")
    parser.add_argument("--model-dir", default=DEFAULT_MODEL_DIR, help="Directory for saved model artifacts.")
    parser.add_argument("--min-support", type=float, default=DEFAULT_MIN_SUPPORT, help="Apriori minimum support.")
    parser.add_argument("--min-confidence", type=float, default=DEFAULT_MIN_CONFIDENCE, help="Association rule minimum confidence.")
    parser.add_argument("--top-k", type=int, default=DEFAULT_TOP_K, help="Top-K recommendations to evaluate.")
    return parser.parse_args()


def main():
    args = parse_args()

    cleaned_data = load_transaction_data(args.data_path)
    print(f"Total clean rows loaded: {len(cleaned_data)}")

    transactions = build_transactions(cleaned_data)
    print(f"Total transactions: {len(transactions)}")

    training_output = train_recommendation_rules(
        transactions,
        min_support=args.min_support,
        min_confidence=args.min_confidence,
    )
    rules = training_output["rules"]
    frequent_itemsets = training_output["frequent_itemsets"]
    test_transactions = training_output["test_transactions"]

    print(f"Frequent itemsets: {len(frequent_itemsets)}")
    print(f"Total rules generated: {len(rules)}")

    hit_rate, total_users, total_hits = evaluate_model(test_transactions, rules, top_k=args.top_k)
    print("===== EVALUATION RESULT =====")
    print(f"Hit Rate@{args.top_k}: {hit_rate:.4f}")
    print(f"Total evaluated users: {total_users}")
    print(f"Total hits: {total_hits}")

    artifact_path, snapshot_path = save_model_artifacts(
        rules,
        frequent_itemsets,
        cleaned_data,
        model_dir=args.model_dir,
        min_support=args.min_support,
        min_confidence=args.min_confidence,
    )

    print(f"Saved model artifacts to: {artifact_path}")
    print(f"Saved training snapshot to: {snapshot_path}")


if __name__ == "__main__":
    main()
