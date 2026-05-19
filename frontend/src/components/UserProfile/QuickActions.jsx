// User profile quick action shortcuts.
import React from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingBag,
  faStar,
  faBookMedical,
  faChevronRight,
  faComments,
} from "@fortawesome/free-solid-svg-icons";

// Renders the shortcut action buttons for the profile dashboard.
const QuickActions = ({ onViewOrders, onViewReviews, onRequestBook, onViewMessages, onViewLiveChat }) => {
  const actions = [
    {
      label: "View Order History",
      icon: faShoppingBag,
      variant: "outline-primary",
      onClick: onViewOrders,
    },
    {
      label: "View My Reviews",
      icon: faStar,
      variant: "outline-success",
      onClick: onViewReviews,
    },
    {
      label: "Request a Book",
      icon: faBookMedical,
      variant: "outline-info",
      onClick: onRequestBook,
    },
    {
      label: "Messages",
      icon: faComments,
      variant: "outline-dark",
      onClick: onViewMessages,
    },
    {
      label: "Live Chat",
      icon: faComments,
      variant: "outline-primary",
      onClick: onViewLiveChat,
    },
  ];

  return (
    <Card className="dashboard-card mb-4">
      <Card.Body>
        <h4 className="mb-3">Quick Actions</h4>
        <Row>
          {actions.map((action, index) => (
            <Col md={6} lg={3} className="mb-3" key={index}>
              <Button
                variant={action.variant}
                className="w-100 d-flex align-items-center justify-content-between py-3"
                onClick={action.onClick}
              >
                <div>
                  <FontAwesomeIcon icon={action.icon} className="me-2" />
                  {action.label}
                </div>
                <FontAwesomeIcon icon={faChevronRight} size="xs" />
              </Button>
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  );
};

export default QuickActions;
