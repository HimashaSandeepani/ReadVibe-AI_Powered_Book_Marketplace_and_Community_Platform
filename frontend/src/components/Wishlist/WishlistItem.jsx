// Wishlist item card with status, priority, and item actions.
import React from "react";
import { Card, Badge, Button, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTags,
  faTimes,
  faBook,
  faUser,
  faStar,
  faCheckCircle,
  faExclamationTriangle,
  faComment,
  faCalendarAlt,
  faEdit,
  faCartPlus,
} from "@fortawesome/free-solid-svg-icons";
// In WishlistItem.jsx, EditItemModal.jsx, etc.
import { renderPriorityStars, formatPrice } from "./utils.jsx";
import createBookCoverPlaceholder from "../../utils/imagePlaceholders";

// Renders an individual wishlist item with priority, stock, and actions.
const WishlistItem = ({ item, onRemove, onAddToCart, onBuyNow, onEditItem, actionsDisabled = false }) => {
  return (
    <Col lg={4} md={6} key={item.id} className="mb-4">
      <Card className="wishlist-card h-100">
        {/* Category Tag */}
        <Badge bg="primary" className="wishlist-category-tag">
          <FontAwesomeIcon icon={faTags} className="me-1" />
          {item.category}
        </Badge>

        {/* Remove Button */}
        <Button
          variant="link"
          className="wishlist-remove-btn"
          onClick={() => onRemove(item.id)}
          title="Remove from wishlist"
        >
          <FontAwesomeIcon icon={faTimes} />
        </Button>

        {/* Book Cover */}
        <div className="wishlist-item-cover">
          <Card.Img
            variant="top"
            src={item.image}
            alt={item.title}
            className="wishlist-book-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = createBookCoverPlaceholder();
            }}
          />
          {!item.inStock && (
            <div className="out-of-stock-overlay">
              <Badge bg="danger">
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  className="me-1"
                />
                Out of Stock
              </Badge>
            </div>
          )}
        </div>

        <Card.Body className="wishlist-item-info">
          <Card.Title className="wishlist-item-title">
            <FontAwesomeIcon icon={faBook} className="me-2 text-primary" />
            {item.title}
          </Card.Title>
          <Card.Subtitle className="wishlist-item-author mb-3">
            <FontAwesomeIcon icon={faUser} className="me-2 text-muted" />
            by {item.author}
          </Card.Subtitle>

          {/* Rating and Stock Status */}
          <div className="wishlist-item-meta mb-3">
            <div className="wishlist-rating">
              <FontAwesomeIcon icon={faStar} className="text-warning" />
              {item.rating !== null && item.rating !== undefined ? (
                <>
                  <span className="ms-1">{Number(item.rating).toFixed(1)}</span>
                  <span className="text-muted ms-1">
                    ({Number(item.reviews) || 0} reviews)
                  </span>
                </>
              ) : (
                <span className="text-muted ms-1">No ratings yet</span>
              )}
            </div>
            <Badge
              bg={item.inStock ? "success" : "danger"}
              className="wishlist-stock-badge"
            >
              {item.inStock ? (
                <>
                  <FontAwesomeIcon icon={faCheckCircle} className="me-1" />
                  In Stock
                </>
              ) : (
                <>
                  <FontAwesomeIcon
                    icon={faExclamationTriangle}
                    className="me-1"
                  />
                  Out of Stock
                </>
              )}
            </Badge>
          </div>

          {/* Price Display */}
          <div className="price-display mb-3">
            <span className="current-price fw-bold text-primary">
              {formatPrice(item.price)}
            </span>
          </div>

          {/* Priority */}
          <div className="wishlist-priority mb-3">
            <div className="priority-label mb-2">
              <FontAwesomeIcon icon={faStar} className="me-2 text-warning" />
              Priority Level:
            </div>
            {renderPriorityStars(item.priority || 3)}
          </div>

          {/* Notes */}
          {item.notes && (
            <div className="wishlist-notes mb-3">
              <div className="notes-label mb-1">
                <FontAwesomeIcon icon={faComment} className="me-2 text-info" />
                My Notes:
              </div>
              <div className="notes-content small">{item.notes}</div>
            </div>
          )}

          {/* Actions */}
          <div className="d-flex justify-content-between align-items-center mt-4">
            <div className="wishlist-item-date small text-muted">
              <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
              Added: {new Date(item.dateAdded).toLocaleDateString()}
            </div>
            <div className="wishlist-actions">
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => onEditItem(item)}
                title="Edit item"
                className="me-2"
              >
                <FontAwesomeIcon icon={faEdit} />
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => onBuyNow(item.id)}
                disabled={!item.inStock || actionsDisabled}
                title={actionsDisabled ? "Not available for this account" : item.inStock ? "Buy now" : "Out of stock"}
              >
                <FontAwesomeIcon icon={faCartPlus} className="me-1" />
                {item.inStock ? "Buy Now" : "Out"}
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default WishlistItem;
