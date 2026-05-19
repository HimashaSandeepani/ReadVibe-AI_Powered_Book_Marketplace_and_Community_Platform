// Delivery form navigation buttons.
import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

// Delivery form navigation buttons for returning to cart or continuing.
const FormButtons = ({ loading }) => {
  return (
    <div className="delivery-form-buttons">
      <Link to="/cart" className="btn btn-outline-secondary">
        <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
        Back to Cart
      </Link>
      <Button type="submit" variant="primary" disabled={loading}>
        {loading ? "Processing..." : "Continue to Payment"}
        <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
      </Button>
    </div>
  );
};

export default FormButtons;
