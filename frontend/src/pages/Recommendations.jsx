// Recommendations page that surfaces AI-generated book suggestions.
import { useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Card, Button, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBrain, faArrowRight, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { getCurrentUser } from "../utils/auth";
import { showNotification } from "../utils/helpers";
import { getOrdersApi } from "../utils/orderApi";
import { fetchBooksFromApi } from "../components/StockManager/utils";
import { addCartItemApi } from "../utils/cartApi";
import RecommendedBooks from "../components/OrderConfirmation/RecommendedBooks";
import {
  getOrderedDatasetBookIds,
  getRecommendedBookIds,
  getRecommendedBooksByIds,
} from "../components/OrderConfirmation/utils";
import { BOOK_RECOMMENDATION_RULES } from "../data/recommendationRules";

const Recommendations = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const [books, setBooks] = useState([]);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasHistory, setHasHistory] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const handleStorageChange = () => {
      setCurrentUser(getCurrentUser());
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const loadRecommendations = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const [apiBooks, orders] = await Promise.all([
          fetchBooksFromApi(),
          getOrdersApi(currentUser.id),
        ]);

        const nextBooks = Array.isArray(apiBooks) ? apiBooks : [];
        setBooks(nextBooks);

        const selectedBookIds = [];
        (Array.isArray(orders) ? orders : []).forEach((order) => {
          const orderBookIds = getOrderedDatasetBookIds(order, nextBooks);
          orderBookIds.forEach((bookId) => {
            if (!selectedBookIds.includes(bookId)) {
              selectedBookIds.push(bookId);
            }
          });
        });

        setHasHistory(selectedBookIds.length > 0);

        if (nextBooks.length > 0 && selectedBookIds.length > 0) {
          const recommendedIds = getRecommendedBookIds(
            selectedBookIds,
            BOOK_RECOMMENDATION_RULES,
            nextBooks,
            4,
          );
          setRecommendedBooks(getRecommendedBooksByIds(recommendedIds, nextBooks));
        } else {
          setRecommendedBooks([]);
        }
      } catch (error) {
        console.error("Failed to load recommendations", error);
        showNotification(error.message || "Failed to load recommendations", "danger");
        setRecommendedBooks([]);
        setHasHistory(false);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [currentUser]);

  const handleAddToCart = async (bookId) => {
    if (!currentUser) return;

    const book = books.find((item) => item.id === bookId);
    if (!book) return;

    try {
      await addCartItemApi(currentUser.id, book.id, 1);
      showNotification("Book added to cart!", "success");
    } catch (error) {
      showNotification(error.message || "Failed to add book to cart.", "danger");
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status" />
        <div className="mt-3">Loading your recommendations...</div>
      </Container>
    );
  }

  return (
    <div className="recommendations-page py-5">
      <Container>
        <Row className="justify-content-center">
          <Col lg={10}>
            <Card className="mb-4 shadow-sm">
              <Card.Body className="p-4 p-md-5">
                <div className="d-flex align-items-center mb-3">
                  <FontAwesomeIcon icon={faBrain} size="2x" className="me-3 text-primary" />
                  <div>
                    <h2 className="mb-1">Your Recommendations</h2>
                    <p className="text-muted mb-0">
                      Personalized picks based on your purchase history and our Apriori rules.
                    </p>
                  </div>
                </div>

                {!hasHistory ? (
                  <Alert variant="info" className="mb-0 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
                    <div>
                      <strong>No purchase history yet.</strong>
                      <div>Buy a few books first and this page will generate recommendations from your reading pattern.</div>
                    </div>
                    <Button variant="primary" onClick={() => navigate("/marketplace")}>
                      Browse Marketplace
                      <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
                    </Button>
                  </Alert>
                ) : (
                  <>
                    <p className="text-muted mb-4">
                      We used your previous orders to generate four recommendations.
                    </p>
                    <RecommendedBooks books={recommendedBooks} onAddToCart={handleAddToCart} />
                  </>
                )}
              </Card.Body>
            </Card>

            {hasHistory && recommendedBooks.length === 0 && (
              <Alert variant="warning">
                We found your purchase history, but no matching recommendation rules returned results yet.
                Try browsing the marketplace or buying a few more books so the system has more signals.
              </Alert>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Recommendations;