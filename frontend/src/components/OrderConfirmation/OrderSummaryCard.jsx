// Order summary card for confirmation details.
import React from "react";
import { Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReceipt } from "@fortawesome/free-solid-svg-icons";
import { formatPrice } from "./utils";

const OrderSummaryCard = ({ order, methodDetails }) => {
  return (
    <Card className="checkout-order-summary mb-4">
      <Card.Body>
        <h5 className="mb-3">
          <FontAwesomeIcon icon={faReceipt} className="me-2" />
          Order Summary
        </h5>

        <div className="checkout-totals">
          <div className="checkout-total-item mb-2">
            <span className="label">Subtotal:</span>
            <span className="value">
              {formatPrice(order.totals?.subtotal || 0)}
            </span>
          </div>
          <div className="checkout-total-item mb-2">
            <span className="label">Shipping:</span>
            <span className="value">
              {formatPrice(order.totals?.shipping || 0)}
            </span>
          </div>
          <div className="checkout-total-item mb-2">
            <span className="label">Tax (5%):</span>
            <span className="value">{formatPrice(order.totals?.tax || 0)}</span>
          </div>
          <div className="checkout-total-divider my-3"></div>
          <div className="checkout-grand-total">
            <span>Total:</span>
            <span>{formatPrice(order.totals?.total || 0)}</span>
          </div>
        </div>

        <div className="shipping-method-summary mt-4">
          <h6>
            <FontAwesomeIcon icon={methodDetails.icon} className="me-2" />
            Shipping Method
          </h6>
          <div className="mt-2">
            <p className="mb-1">
              <strong>{methodDetails.title}</strong>
            </p>
            <p className="text-muted small mb-1">
              <FontAwesomeIcon icon="clock" className="me-1" />
              {methodDetails.days}
            </p>
            <p className="text-muted small mb-0">{methodDetails.description}</p>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default OrderSummaryCard;
