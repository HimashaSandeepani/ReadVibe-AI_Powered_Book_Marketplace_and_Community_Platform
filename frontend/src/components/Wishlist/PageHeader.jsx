// Wishlist page header and item count badge.
import React from "react";
import { Badge } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faBookmark } from "@fortawesome/free-solid-svg-icons";

const PageHeader = ({ wishlistCount }) => {
  return (
    <div className="page-header mb-4">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h2 className="mb-2">
            <FontAwesomeIcon icon={faHeart} className="me-3 text-danger" />
            My Wishlist
          </h2>
          <p className="text-muted mb-0">
            Save books you want to read and track their availability
          </p>
        </div>
        <Badge bg="primary" className="wishlist-count-badge">
          <FontAwesomeIcon icon={faBookmark} className="me-2" />
          {wishlistCount} book{wishlistCount !== 1 ? "s" : ""}
        </Badge>
      </div>
    </div>
  );
};

export default PageHeader;
