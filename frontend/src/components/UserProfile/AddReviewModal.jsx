// User profile modal for adding a review.
import React, { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faPaperPlane,
  faThumbsUp,
  faThumbsDown,
} from "@fortawesome/free-solid-svg-icons";

// Renders the review creation modal for a selected book.
const AddReviewModal = ({ show, onHide, book, onSubmit, reviewIndex = 1, reviewCount = 1 }) => {
  const [reviewData, setReviewData] = useState({
    rating: 5,
    text: "",
    recommend: true,
  });

  // Updates the selected star rating.
  const handleSetRating = (rating) => {
    setReviewData({ ...reviewData, rating });
  };

  // Submits the review and resets the form state.
  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(reviewData);
    setReviewData({
      rating: 5,
      text: "",
      recommend: true,
    });
  };

  // Updates the text or recommendation fields in the review form.
  const handleChange = (e) => {
    setReviewData({ ...reviewData, [e.target.name]: e.target.value });
  };

  if (!book) return null;

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <FontAwesomeIcon icon={faStar} className="me-2" />
          Add Review{reviewCount > 1 ? ` (${reviewIndex} of ${reviewCount})` : ""}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <>
          {/* Book Info Preview */}
          <div className="selected-book-preview mb-4">
            {reviewCount > 1 && (
              <p className="text-muted small mb-2">
                Reviewing item {reviewIndex} of {reviewCount} in this order.
              </p>
            )}
            <Row className="align-items-center">
              <Col xs="auto">
                <img
                  src={book.image}
                  alt={book.title}
                  className="book-cover-small"
                  style={{
                    width: "80px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
              </Col>
              <Col>
                <h6 className="mb-1 fw-semibold">{book.title}</h6>
                <p className="text-muted mb-0">by {book.author}</p>
              </Col>
            </Row>
          </div>

          {/* Rating */}
          <div className="mb-4">
            <Form.Label className="fw-semibold">Your Rating</Form.Label>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((rating) => (
                <span
                  key={rating}
                  className="rating-star"
                  onClick={() => handleSetRating(rating)}
                  style={{ cursor: "pointer", marginRight: "10px" }}
                >
                  <FontAwesomeIcon
                    icon={faStar}
                    className={
                      reviewData.rating >= rating
                        ? "text-warning"
                        : "text-secondary"
                    }
                    size="lg"
                  />
                </span>
              ))}
            </div>
          </div>

          {/* Review Text */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Your Review</Form.Label>
            <Form.Control
              as="textarea"
              name="text"
              rows={6}
              placeholder="Share your thoughts about this book..."
              maxLength={1000}
              value={reviewData.text}
              onChange={handleChange}
            />
            <Form.Text className="text-muted">
              {reviewData.text.length}/1000 characters
            </Form.Text>
          </Form.Group>

          {/* Would Recommend */}
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">
              Would you recommend this book?
            </Form.Label>
            <div>
              <Form.Check
                inline
                type="radio"
                label={
                  <>
                    <FontAwesomeIcon
                      icon={faThumbsUp}
                      className="text-success me-1"
                    />
                    Yes
                  </>
                }
                name="recommend"
                id="recommendYes"
                checked={reviewData.recommend}
                onChange={() =>
                  setReviewData({ ...reviewData, recommend: true })
                }
              />
              <Form.Check
                inline
                type="radio"
                label={
                  <>
                    <FontAwesomeIcon
                      icon={faThumbsDown}
                      className="text-danger me-1"
                    />
                    No
                  </>
                }
                name="recommend"
                id="recommendNo"
                checked={!reviewData.recommend}
                onChange={() =>
                  setReviewData({ ...reviewData, recommend: false })
                }
              />
            </div>
          </Form.Group>
        </>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          <FontAwesomeIcon icon={faPaperPlane} className="me-1" />
          Submit Review
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddReviewModal;
