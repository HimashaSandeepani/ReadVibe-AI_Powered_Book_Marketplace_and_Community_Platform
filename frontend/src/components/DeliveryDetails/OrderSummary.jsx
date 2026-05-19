// Delivery details order summary.
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReceipt } from "@fortawesome/free-solid-svg-icons";
import { formatPriceLKR } from "./utils";

// Delivery order summary component that displays subtotal, shipping, tax, and total.
const OrderSummary = ({ orderSummary }) => {
  return (
    <div className="delivery-summary">
      <h6>
        <FontAwesomeIcon icon={faReceipt} className="me-2" />
        Order Summary
      </h6>

      <div className="delivery-summary-item">
        <div className="delivery-summary-label">
          Items ({orderSummary.itemCount})
        </div>
        <div className="delivery-summary-value">
          {formatPriceLKR(orderSummary.subtotal)}
        </div>
      </div>

      <div className="delivery-summary-item">
        <div className="delivery-summary-label">Shipping</div>
        <div className="delivery-summary-value" id="shippingCost">
          {formatPriceLKR(orderSummary.shipping)}
        </div>
      </div>

      <div className="delivery-summary-item">
        <div className="delivery-summary-label">Tax (5% VAT)</div>
        <div className="delivery-summary-value">
          {formatPriceLKR(orderSummary.tax)}
        </div>
      </div>

      <div className="delivery-summary-total">
        <div className="delivery-summary-item">
          <div className="delivery-summary-label">Total</div>
          <div className="delivery-summary-value" id="orderTotal">
            {formatPriceLKR(orderSummary.total)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
