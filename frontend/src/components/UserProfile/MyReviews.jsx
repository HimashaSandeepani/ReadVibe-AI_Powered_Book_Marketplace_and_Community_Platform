// User profile review history section.
import React from "react";
import { Card, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faTimes } from "@fortawesome/free-solid-svg-icons";
import ReviewItem from "./ReviewItem";

const MyReviews = ({ reviews, onBack, onEditReview, onDeleteReview }) => {
  return (
    <Card className="dashboard-card mb-4">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">
            <FontAwesomeIcon icon={faStar} className="me-2" />
            My Reviews
          </h4>
          <Button variant="outline-secondary" size="sm" onClick={onBack}>
            <FontAwesomeIcon icon={faTimes} /> Back to Overview
          </Button>
        </div>
        <div id="myReviewsList">
          {reviews.length === 0 ? (
            <div className="text-center py-4">
              <FontAwesomeIcon
                icon={faStar}
                size="3x"
                className="text-muted mb-3"
              />
              <h5>No Reviews Yet</h5>
              <p className="text-muted">You haven't reviewed any books yet.</p>
              <p className="text-muted">
                Go to your order history to review purchased books!
              </p>
              <Button variant="primary" onClick={onBack}>
                View Order History
              </Button>
            </div>
          ) : (
            reviews.map((review) => (
              <ReviewItem
                key={review.id}
                review={review}
                onEdit={onEditReview}
                onDelete={onDeleteReview}
              />
            ))
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default MyReviews;
