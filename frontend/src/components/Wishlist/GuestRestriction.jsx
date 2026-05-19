// Guest notice prompting login before wishlist actions.
import React from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faUser, faUserPlus } from "@fortawesome/free-solid-svg-icons";

const GuestRestriction = () => {
  return (
    <Card className="guest-restriction-card mb-4">
      <Card.Body className="text-center py-4">
        <FontAwesomeIcon icon={faHeart} size="3x" className="text-muted mb-3" />
        <h4>Please login to manage your wishlist</h4>
        <p className="text-muted mb-3">
          Save books you're interested in for easy access later
        </p>
        <div>
          <Link to="/login" className="btn btn-primary me-2">
            <FontAwesomeIcon icon={faUser} className="me-2" />
            Login
          </Link>
          <Link to="/register" className="btn btn-outline-primary">
            <FontAwesomeIcon icon={faUserPlus} className="me-2" />
            Sign Up
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
};

export default GuestRestriction;
