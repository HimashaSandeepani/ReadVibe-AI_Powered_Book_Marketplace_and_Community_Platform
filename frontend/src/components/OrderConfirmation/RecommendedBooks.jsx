// Recommended books shown after checkout.
import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { formatPrice } from "./utils";
import createBookCoverPlaceholder from "../../utils/imagePlaceholders";

const RecommendedBooks = ({ books, onAddToCart }) => {
  if (!books || books.length === 0) return null;

  return (
    <Container className="mt-5">
      <Row>
        <Col xs={12}>
          <h4 className="section-title mb-4">You Might Also Like</h4>
          <Row id="recommendedBooks">
            {books.map((book) => (
              <Col md={3} key={book.id} className="mb-4">
                <Card className="recommended-book-card h-100">
                  <Card.Img
                    variant="top"
                    src={book.image}
                    className="recommended-book-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = createBookCoverPlaceholder();
                    }}
                  />
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <Card.Text className="text-muted">
                      by {book.author}
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="recommended-book-price">
                        {formatPrice(book.price)}
                      </span>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => onAddToCart(book.id)}
                      >
                        <FontAwesomeIcon
                          icon={faShoppingCart}
                          className="me-1"
                        />
                        Add to Cart
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default RecommendedBooks;
