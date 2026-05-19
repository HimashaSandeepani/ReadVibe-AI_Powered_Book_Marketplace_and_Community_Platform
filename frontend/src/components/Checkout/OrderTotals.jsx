// Checkout totals and cost breakdown.
import React from "react";
import { formatPrice } from "./utils";

// Order totals breakdown for subtotal, shipping, tax, and final total.
const OrderTotals = ({ totals }) => {
  return (
    <div className="checkout-totals">
      <div className="checkout-total-item">
        <span className="label">Subtotal:</span>
        <span className="value" id="orderSubtotal">
          {formatPrice(totals.subtotal)}
        </span>
      </div>
      <div className="checkout-total-item">
        <span className="label">Shipping:</span>
        <span className="value" id="orderShipping">
          {formatPrice(totals.shipping)}
        </span>
      </div>
      <div className="checkout-total-item">
        <span className="label">Tax (5%):</span>
        <span className="value" id="orderTax">
          {formatPrice(totals.tax)}
        </span>
      </div>
      <div className="checkout-total-divider"></div>
      <div className="checkout-grand-total">
        <span>Total:</span>
        <span id="orderTotal">{formatPrice(totals.total)}</span>
      </div>
    </div>
  );
};

export default OrderTotals;
