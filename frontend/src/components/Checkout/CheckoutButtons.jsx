// Checkout navigation and submit buttons.
import React from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faLock } from "@fortawesome/free-solid-svg-icons";

// Checkout action buttons for navigating back or submitting the order.
const CheckoutButtons = ({ onBack, onSubmit, isLoading, onNavigateBack }) => {
  const handleBackClick = onBack || onNavigateBack;

  return (
    <div className="checkout-buttons">
      {handleBackClick && (
        <Button
          variant="outline-secondary"
          className="back-button"
          onClick={handleBackClick}
          disabled={isLoading}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
          Back
        </Button>
      )}
      <Button
        type="submit"
        variant="primary"
        className="place-order-button"
        onClick={onSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-1"
              role="status"
              aria-hidden="true"
            ></span>
            Processing...
          </>
        ) : (
          <>
            <FontAwesomeIcon icon={faLock} className="me-1" />
            Place Order
          </>
        )}
      </Button>
    </div>
  );
};

export default CheckoutButtons;
