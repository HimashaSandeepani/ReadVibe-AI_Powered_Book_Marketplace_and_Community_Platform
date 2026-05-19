// Marketplace modal for inspecting a selected book.
import React from "react";
import { Modal, Button, Row, Col, Badge } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faUser,
  faStar,
  faTimes,
  faHeart,
  faShoppingCart,
  faTruck,
  faBookmark,
  faBookOpen,
  faInfoCircle,
  faPrint,
  faCalendar,
  faBarcode,
  faLanguage,
  faComments,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";

// Renders the marketplace modal for inspecting a selected book.
const BookDetailsModal = ({
  show,
  onHide,
  book,
  isLoggedIn,
  actionsDisabled = false,
  isInWishlist,
  onAddToWishlist,
  onAddToCart,
  onBuyNow,
  navigate,
  formatPrice,
  generateStarRating,
}) => {
  if (!book) return null;
  const reviewItems = Array.isArray(book.reviewsList)
    ? book.reviewsList
    : Array.isArray(book.reviewHighlights)
      ? book.reviewHighlights
      : [];

  return (
    <Modal show={show} onHide={onHide} size="lg" animation={true} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <FontAwesomeIcon icon={faBook} className="me-2" />
          {book.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={4}>
            <div className="text-center">
              <img
                src={book.image}
                alt={book.title}
                className="img-fluid rounded mb-3"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/assets/The_Midnight_Library.jpeg";
                }}
              />
            </div>
          </Col>

          <Col md={8}>
            <h4>
              <FontAwesomeIcon icon={faUser} className="me-2" />
              by {book.author}
            </h4>

            <div className="d-flex align-items-center mb-3">
              <div className="rating-badge">
                <FontAwesomeIcon icon={faStar} className="me-1" />
                {generateStarRating(book.rating)} ({book.reviews} reviews)
              </div>
              <span className="ms-3 fs-5 fw-bold">
                {formatPrice(book.price)}
              </span>
            </div>

            <div className="mb-3">
              <Badge bg="primary" className="me-2">
                <FontAwesomeIcon icon={faBookmark} className="me-1" />
                {book.category}
              </Badge>
              <Badge bg="secondary">
                <FontAwesomeIcon icon={faBookOpen} className="me-1" />
                {book.pages || "N/A"} pages
              </Badge>
            </div>

            <p className="mb-4">
              {book.description || "No description available."}
            </p>

            <div className="mb-4">
              <h5>
                <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                Details
              </h5>
              <ul className="list-unstyled">
                <li>
                  <strong>
                    <FontAwesomeIcon icon={faPrint} className="me-2" />
                    Publisher:
                  </strong>{" "}
                  {book.publisher || "Not specified"}
                </li>
                <li>
                  <strong>
                    <FontAwesomeIcon icon={faCalendar} className="me-2" />
                    Published:
                  </strong>{" "}
                  {book.publishedDate || book.publicationYear || "Not specified"}
                </li>
                <li>
                  <strong>
                    <FontAwesomeIcon icon={faBarcode} className="me-2" />
                    ISBN:
                  </strong>{" "}
                  {book.isbn || "Not specified"}
                </li>
                <li>
                  <strong>
                    <FontAwesomeIcon icon={faLanguage} className="me-2" />
                    Language:
                  </strong>{" "}
                  {book.language || "English"}
                </li>
              </ul>
            </div>

            <div>
              <h5>
                <FontAwesomeIcon icon={faComments} className="me-2" />
                Customer Reviews
              </h5>
              {reviewItems.length > 0 ? (
                reviewItems.map((review, index) => (
                  <div key={index} className="mb-3 p-3 border rounded">
                    <div className="d-flex align-items-center mb-2">
                      <span className="fw-bold me-2" style={{ fontSize: "0.95rem" }}>
                        <FontAwesomeIcon icon={faUser} className="me-1" />
                        {review.userName || review.user || "Reader"}
                      </span>
                      <span className="text-warning">
                        {generateStarRating(review.rating)}
                      </span>
                    </div>
                    {review.title ? <div className="fw-semibold mb-1">{review.title}</div> : null}
                    <p className="mb-0" style={{ fontSize: "0.92rem" }}>
                      {review.text || review.comment}
                    </p>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: "0.92rem" }}>No reviews yet. Be the first to review this book! </p>
              )}
            </div>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          <FontAwesomeIcon icon={faTimes} className="me-2" />
          Close
        </Button>

        {isLoggedIn ? (
          <>
            <Button
              variant={isInWishlist(book.id) ? "danger" : "outline-danger"}
              onClick={() => onAddToWishlist(book.id)}
              className="book-action-btn"
              disabled={actionsDisabled}
            >
              <FontAwesomeIcon
                icon={isInWishlist(book.id) ? faHeart : faHeartRegular}
                className="me-2"
              />
              {isInWishlist(book.id)
                ? "Remove from Wishlist"
                : "Add to Wishlist"}
            </Button>
            <Button
              variant="outline-primary"
              onClick={() => onAddToCart(book.id)}
              className="book-action-btn"
              disabled={actionsDisabled}
            >
              <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
              Add to Cart
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                onBuyNow(book.id);
                onHide();
              }}
              className="book-action-btn"
              disabled={actionsDisabled}
            >
              <FontAwesomeIcon icon={faTruck} className="me-2" />
              Buy Now
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline-danger"
              onClick={() => {
                onHide();
                navigate("/login");
              }}
              className="book-action-btn"
            >
              <FontAwesomeIcon icon={faHeartRegular} className="me-2" />
              Login for Wishlist
            </Button>
            <Button
              variant="outline-primary"
              onClick={() => {
                onHide();
                navigate("/login");
              }}
              className="book-action-btn"
            >
              <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
              Login to Add to Cart
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                onHide();
                navigate("/login");
              }}
              className="book-action-btn"
            >
              <FontAwesomeIcon icon={faTruck} className="me-2" />
              Login to Buy
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default BookDetailsModal;
