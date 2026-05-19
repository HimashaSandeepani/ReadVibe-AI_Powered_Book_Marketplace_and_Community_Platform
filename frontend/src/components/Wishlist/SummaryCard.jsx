// Wishlist summary card with totals and bulk actions.
import React from "react";
import { Card, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartPie,
  faCheckCircle,
  faExclamationTriangle,
  faShoppingCart,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
// In WishlistItem.jsx, EditItemModal.jsx, etc.
import { calculateSummary, formatPrice } from "./utils.jsx";

const SummaryCard = ({ wishlist, onAddAllToCart, onClearWishlist }) => {
  const summary = calculateSummary(wishlist);

  return (
    <Card className="wishlist-summary-card mb-3">
      <Card.Header className="bg-primary text-white">
        <FontAwesomeIcon icon={faChartPie} className="me-2" />
        Wishlist Summary
      </Card.Header>
      <Card.Body>
        <div className="wishlist-summary-item">
          <span className="label">Total Items:</span>
          <span className="value">{summary.totalItems}</span>
        </div>

        <div className="wishlist-summary-item">
          <span className="label">In Stock:</span>
          <span className="value text-success">
            <FontAwesomeIcon icon={faCheckCircle} className="me-1" />
            {summary.inStock}
          </span>
        </div>

        <div className="wishlist-summary-item">
          <span className="label">Out of Stock:</span>
          <span className="value text-danger">
            <FontAwesomeIcon icon={faExclamationTriangle} className="me-1" />
            {summary.outOfStock}
          </span>
        </div>

        <div className="wishlist-summary-item">
          <span className="label">Total Value:</span>
          <span className="value">{formatPrice(summary.totalValue)}</span>
        </div>
      </Card.Body>
      <Card.Footer className="bg-light">
        <Button
          variant="primary"
          className="w-100 mb-2"
          onClick={onAddAllToCart}
          disabled={summary.inStock === 0}
        >
          <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
          Add All to Cart
        </Button>
        <Button
          variant="outline-danger"
          className="w-100"
          onClick={onClearWishlist}
        >
          <FontAwesomeIcon icon={faTrash} className="me-2" />
          Clear Wishlist
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default SummaryCard;
