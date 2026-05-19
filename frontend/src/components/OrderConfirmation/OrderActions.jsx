// Follow-up actions available after order placement.
import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStore,
  faHistory,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";

const OrderActions = ({
  onContinueShopping,
  onViewOrderHistory,
  onDownloadInvoice,
}) => {
  return (
    <div className="order-actions mt-4">
      <Row>
        <Col md={4} className="mb-3">
          <Button
            variant="outline-primary"
            className="w-100"
            onClick={onContinueShopping}
          >
            <FontAwesomeIcon icon={faStore} className="me-2" />
            Continue Shopping
          </Button>
        </Col>
        <Col md={4} className="mb-3">
          <Button
            variant="outline-secondary"
            className="w-100"
            onClick={onViewOrderHistory}
          >
            <FontAwesomeIcon icon={faHistory} className="me-2" />
            View Order History
          </Button>
        </Col>
        <Col md={4} className="mb-3">
          <Button
            variant="primary"
            className="w-100"
            onClick={onDownloadInvoice}
          >
            <FontAwesomeIcon icon={faDownload} className="me-2" />
            Download Invoice
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default OrderActions;
