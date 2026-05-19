// Checkout payment form wrapper.
import React from "react";
import { Form } from "react-bootstrap";
import PaymentMethods from "./PaymentMethods";
import CreditCardForm from "./CreditCardForm";
import BillingAddress from "./BillingAddress";

// Payment form wrapper that combines payment method, card, and billing fields.
const PaymentForm = ({
  paymentData,
  formErrors,
  isLoading,
  onSubmit,
  handleCardNumberChange,
  handleInputChange,
}) => {
  return (
    <Form id="checkoutForm" onSubmit={onSubmit}>
      <h5 className="mb-3">Payment Information</h5>

      <PaymentMethods />

      <CreditCardForm
        paymentData={paymentData}
        formErrors={formErrors}
        isLoading={isLoading}
        handleCardNumberChange={handleCardNumberChange}
        handleInputChange={handleInputChange}
      />

      <BillingAddress
        paymentData={paymentData}
        isLoading={isLoading}
        handleInputChange={handleInputChange}
      />
    </Form>
  );
};

export default PaymentForm;
