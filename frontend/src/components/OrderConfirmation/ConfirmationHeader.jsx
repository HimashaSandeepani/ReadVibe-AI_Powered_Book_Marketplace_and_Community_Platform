// Order confirmation header and status summary.
import React from "react";
import { Button, Badge } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faEye,
  faStore,
} from "@fortawesome/free-solid-svg-icons";

const ConfirmationHeader = ({
  methodDetails,
  onTrackOrder,
  onContinueShopping,
}) => {
  return (
    <div className="confirmation-success text-center py-4 mb-4">
      <div className="confirmation-icon">
        <FontAwesomeIcon
          icon={faCheckCircle}
          size="4x"
          className="text-success"
        />
      </div>
      <h2 className="mt-3 mb-2">Order Confirmed!</h2>
      <p className="text-muted mb-4">
        Thank you for your purchase. Your order has been successfully placed.
      </p>

      <div className="shipping-method-badge mb-3">
        <Badge bg="info" className="p-2">
          <FontAwesomeIcon icon={methodDetails.icon} className="me-2" />
          {methodDetails.title} - {methodDetails.days}
        </Badge>
      </div>

      <div className="d-flex justify-content-center gap-3 mt-3">
        <Button variant="outline-primary" size="sm" onClick={onTrackOrder}>
          <FontAwesomeIcon icon={faEye} className="me-2" />
          Track Order
        </Button>
        <Button
          variant="outline-success"
          size="sm"
          onClick={onContinueShopping}
        >
          <FontAwesomeIcon icon={faStore} className="me-2" />
          Continue Shopping
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationHeader;
