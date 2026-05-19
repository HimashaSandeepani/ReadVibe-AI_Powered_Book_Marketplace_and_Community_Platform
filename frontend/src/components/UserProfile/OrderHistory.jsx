// User profile order history section.
import React from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingBag,
  faTimes,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { formatPrice, formatDate } from "./utils";

// Renders the user's order history list and follow-up actions.
const OrderHistory = ({ orders, onBack, onReviewOrder, onViewDetails }) => {
  return (
    <Card className="dashboard-card mb-4">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">
            <FontAwesomeIcon icon={faShoppingBag} className="me-2" />
            Order History
          </h4>
          <Button variant="outline-secondary" size="sm" onClick={onBack}>
            <FontAwesomeIcon icon={faTimes} /> Back to Overview
          </Button>
        </div>
        <div id="orderHistory">
          {orders.length === 0 ? (
            <div className="text-center py-4">
              <FontAwesomeIcon
                icon={faShoppingBag}
                size="3x"
                className="text-muted mb-3"
              />
              <h5>No Orders Yet</h5>
              <p className="text-muted">
                Start shopping to see your order history!
              </p>
              <Link to="/marketplace" className="btn btn-primary">
                Browse Books
              </Link>
            </div>
          ) : (
            orders.map((order) => (
              <Card key={order.id} className="mb-3">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 className="card-title">
                        Order #{order.orderNumber || order.id}
                      </h6>
                      <p className="card-text text-muted mb-1">
                        {formatDate(order.orderDate)} • {(order.items || []).length} item(s) •
                        <strong> {formatPrice(order.totals?.total || order.total || 0)}</strong>
                      </p>
                      <Badge bg="success">{order.status}</Badge>
                    </div>
                    <div className="text-end">
                      <small className="text-muted d-block">
                        Est. Delivery
                      </small>
                      <small className="text-muted">
                        {formatDate(order.shipping?.estimatedDelivery || order.orderDate)}
                      </small>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => onViewDetails(order.id)}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outline-success"
                      size="sm"
                      onClick={() => onReviewOrder(order.id)}
                    >
                      <FontAwesomeIcon icon={faStar} className="me-1" />
                      Review Items
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            ))
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default OrderHistory;
