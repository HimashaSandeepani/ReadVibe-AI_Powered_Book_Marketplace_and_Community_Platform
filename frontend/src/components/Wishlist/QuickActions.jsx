// Quick actions panel for wishlist shortcuts and sharing.
import React from "react";
import { Card, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt,
  faSearch,
  faCopy,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";

// Renders quick actions for searching and sharing the wishlist.
const QuickActions = ({ onSearchBooks, onShareLink, onShareEmail }) => {
  return (
    <Card className="quick-actions-card mb-3">
      <Card.Body>
        <h6 className="mb-3">
          <FontAwesomeIcon icon={faBolt} className="me-2 text-warning" />
          Quick Actions
        </h6>
        <div className="d-grid gap-2">
          <Button variant="outline-primary" size="sm" onClick={onSearchBooks}>
            <FontAwesomeIcon icon={faSearch} className="me-2" />
            Search Books
          </Button>
          <Button variant="outline-info" size="sm" onClick={onShareLink}>
            <FontAwesomeIcon icon={faCopy} className="me-2" />
            Copy Share Link
          </Button>
          <Button variant="outline-success" size="sm" onClick={onShareEmail}>
            <FontAwesomeIcon icon={faEnvelope} className="me-2" />
            Email Wishlist
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default QuickActions;
