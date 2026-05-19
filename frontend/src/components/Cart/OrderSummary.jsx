// Cart order summary and totals panel.
import React from "react";
import { Card, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

// Order summary component that displays cart totals and checkout actions.
const OrderSummary = ({ totals, onCheckout, onContinueShopping, cart }) => {
  // Formats totals in LKR for the order summary panel.
  const formatPriceLKR = (price) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  return (
    <Card className="order-summary">
      <Card.Body>
        <h4>Order Summary</h4>
        <div className="order-summary-item">
          <span className="label">Subtotal ({totals.itemCount} items):</span>
          <span className="value cart-total-amount" id="subtotal">
            {formatPriceLKR(totals.subtotal)}
          </span>
        </div>
        <div className="order-summary-item">
          <span className="label">Shipping:</span>
          <span className="value shipping-amount" id="shipping">
            {formatPriceLKR(totals.shipping)}
          </span>
        </div>
        <div className="order-summary-item">
          <span className="label">Tax (5%):</span>
          <span className="value tax-amount" id="tax">
            {formatPriceLKR(totals.tax)}
          </span>
        </div>
        <div className="order-summary-divider"></div>
        <div className="order-summary-total">
          <span>Total:</span>
          <span id="total">{formatPriceLKR(totals.total)}</span>
        </div>
        <Button
          variant="primary"
          className="checkout-btn w-100"
          onClick={onCheckout}
          disabled={cart.length === 0}
        >
          <FontAwesomeIcon icon={faLock} className="me-1" />
          Proceed to Checkout
        </Button>

        <Button
          variant="outline-primary"
          className="continue-shopping-btn w-100"
          onClick={onContinueShopping}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
          Continue Shopping
        </Button>
      </Card.Body>
    </Card>
  );
};

export default OrderSummary;
