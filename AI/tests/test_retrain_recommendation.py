from __future__ import annotations

import importlib.util
import tempfile
from pathlib import Path
from unittest import TestCase, skipIf
from unittest.mock import patch

SCRIPT_PATH = Path(__file__).resolve().parents[1] / "retrain_recommendation.py"
SPEC = importlib.util.spec_from_file_location("retrain_recommendation", SCRIPT_PATH)
MODULE = importlib.util.module_from_spec(SPEC)


try:
    if not SPEC or not SPEC.loader:
        raise ImportError(f"Unable to load test target from {SCRIPT_PATH}")

    import pandas as pd

    SPEC.loader.exec_module(MODULE)
    IMPORT_ERROR = None
except ImportError as exc:  # pragma: no cover - exercised only when deps are missing
    pd = None
    MODULE = None
    IMPORT_ERROR = exc


@skipIf(IMPORT_ERROR is not None, f"Skipping AI tests because a dependency is missing: {IMPORT_ERROR}")
class RecommendationRetrainTests(TestCase):
    def test_load_and_build_transactions(self):
        fixture_path = Path(__file__).resolve().parent / "fixtures" / "sample_interactions.csv"

        cleaned = MODULE.load_transaction_data(str(fixture_path))
        transactions = MODULE.build_transactions(cleaned)

        self.assertEqual(list(cleaned.columns), ["User_id", "Id"])
        self.assertEqual(len(cleaned), 8)
        self.assertEqual(len(transactions), 4)
        self.assertIn(["A", "B"], transactions)

    def test_recommendation_and_evaluation_pipeline(self):
        rules_frame = pd.DataFrame(
            [
                {
                    "antecedents": frozenset({"A"}),
                    "consequents": frozenset({"B"}),
                    "confidence": 1.0,
                    "lift": 1.0,
                    "support": 0.5,
                },
                {
                    "antecedents": frozenset({"A"}),
                    "consequents": frozenset({"C"}),
                    "confidence": 1.0,
                    "lift": 1.0,
                    "support": 0.5,
                },
            ]
        )

        recommended = MODULE.recommend_books(["A"], rules_frame, top_k=4)

        self.assertEqual(recommended[:2], ["B", "C"])

        with patch.object(MODULE.random, "choice", side_effect=lambda values: values[-1]):
            hit_rate, total_users, hits = MODULE.evaluate_model(
                [["A", "B"], ["A", "C"]],
                rules_frame,
                top_k=4,
            )

        self.assertEqual(total_users, 2)
        self.assertEqual(hits, 2)
        self.assertEqual(hit_rate, 1.0)

    def test_save_model_artifacts(self):
        rules_frame = pd.DataFrame(
            [
                {
                    "antecedents": frozenset({"A"}),
                    "consequents": frozenset({"B"}),
                    "confidence": 1.0,
                    "lift": 1.0,
                    "support": 0.5,
                }
            ]
        )
        itemsets_frame = pd.DataFrame(
            [
                {
                    "support": 0.5,
                    "itemsets": frozenset({"A"}),
                }
            ]
        )
        cleaned_frame = pd.DataFrame(
            [
                {"User_id": "u1", "Id": "A"},
                {"User_id": "u1", "Id": "B"},
            ]
        )

        with tempfile.TemporaryDirectory() as temp_dir:
            artifact_path, snapshot_path = MODULE.save_model_artifacts(
                rules_frame,
                itemsets_frame,
                cleaned_frame,
                model_dir=temp_dir,
                min_support=0.25,
                min_confidence=0.5,
            )

            self.assertTrue(Path(artifact_path).exists())
            self.assertTrue(Path(snapshot_path).exists())

            with open(artifact_path, "r", encoding="utf-8") as handle:
                payload = handle.read()

            self.assertIn("generated_at", payload)
            self.assertIn("min_support", payload)
            self.assertIn("rules", payload)