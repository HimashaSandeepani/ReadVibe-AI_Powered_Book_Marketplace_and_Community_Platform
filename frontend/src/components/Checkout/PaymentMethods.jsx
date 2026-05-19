// Checkout payment method selector.
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";

// Payment method selector that highlights the supported card option.
const PaymentMethods = () => {
  return (
    <div className="payment-methods mb-4">
      <div className="payment-method-card selected">
        <div className="payment-method-icon">
          <FontAwesomeIcon icon={faCreditCard} />
        </div>
        <div className="payment-method-details">
          <div className="payment-method-title">Credit/Debit Card</div>
          <div className="payment-method-description">
            Visa, Mastercard, American Express
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;
