// Empty state shown when the wishlist has no books.
import React from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { faBookOpen, faPlus } from "@fortawesome/free-solid-svg-icons";

const EmptyWishlist = ({ onAddBook }) => {
  return (
    <Card className="empty-wishlist-state">
      <Card.Body className="text-center py-5">
        <FontAwesomeIcon
          icon={faHeartRegular}
          size="4x"
          className="text-muted mb-3"
        />
        <h4>Your wishlist is empty</h4>
        <p className="text-muted mb-4">
          Start building your reading list by adding books you want to read
        </p>
        <div>
          <Button variant="primary" className="me-2" onClick={onAddBook}>
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Add Your First Book
          </Button>
          <Link to="/marketplace" className="btn btn-outline-primary">
            <FontAwesomeIcon icon={faBookOpen} className="me-2" />
            Browse Books
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
};

export default EmptyWishlist;
