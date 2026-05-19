// Checkout billing address form section.
import React from "react";
import { Form, Alert } from "react-bootstrap";

// Billing address section that toggles based on the shipping address choice.
const BillingAddress = ({ paymentData, isLoading, handleInputChange }) => {
  return (
    <div className="billing-address-section">
      <h5 className="mb-3 mt-4">Billing Address</h5>
      <Form.Group className="mb-3">
        <Form.Check
          type="checkbox"
          id="sameAsShipping"
          name="sameAsShipping"
          label="Same as shipping address"
          checked={paymentData.sameAsShipping}
          onChange={handleInputChange}
          disabled={isLoading}
        />
      </Form.Group>

      <div
        id="billingAddress"
        style={{
          display: paymentData.sameAsShipping ? "none" : "block",
        }}
      >
        <Alert variant="info">
          Please enter your billing address information
        </Alert>
      </div>
    </div>
  );
};

export default BillingAddress;
