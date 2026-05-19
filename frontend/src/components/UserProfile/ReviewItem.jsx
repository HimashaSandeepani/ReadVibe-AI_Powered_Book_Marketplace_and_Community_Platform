// User profile review list item.
import React from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faThumbsUp,
  faThumbsDown,
} from "@fortawesome/free-solid-svg-icons";
import { formatDate, generateStarRating } from "./utils";

// Renders a single user review entry with edit and delete actions.
const ReviewItem = ({ review, onEdit, onDelete }) => {
  return (
    <div className="review-item mb-3 pb-3 border-bottom">
      <div className="d-flex">
        <div className="me-3">
          <img
            src={review.bookImage}
            alt={review.bookTitle}
            className="book-cover-small"
            style={{
              width: "60px",
              height: "80px",
              objectFit: "cover",
            }}
          />
        </div>
        <div className="grow">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <div>
              <h6 className="mb-1">{review.bookTitle}</h6>
              <p className="text-muted mb-1">by {review.bookAuthor}</p>
            </div>
            <div className="text-end">
              <div
                className="stars mb-1"
                dangerouslySetInnerHTML={{
                  __html: generateStarRating(review.rating),
                }}
              />
              <small className="text-muted">{formatDate(review.date)}</small>
            </div>
          </div>
          {review.title && (
            <h6 className="mb-2 text-primary">{review.title}</h6>
          )}
          <p className="mb-2">{review.text}</p>
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted">
              {review.recommend ? (
                <>
                  <FontAwesomeIcon
                    icon={faThumbsUp}
                    className="text-success me-1"
                  />
                  Would recommend
                </>
              ) : (
                <>
                  <FontAwesomeIcon
                    icon={faThumbsDown}
                    className="text-danger me-1"
                  />
                  Would not recommend
                </>
              )}
            </small>
            <div>
              <Button
                variant="outline-primary"
                size="sm"
                className="me-2"
                onClick={() => onEdit(review)}
              >
                <FontAwesomeIcon icon={faEdit} className="me-1" />
                Edit
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => onDelete(review.id)}
              >
                <FontAwesomeIcon icon={faTrash} className="me-1" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewItem;
