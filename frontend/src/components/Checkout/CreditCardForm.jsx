// Credit card payment form fields.
import React from "react";
import { Form, Row, Col, InputGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { formatCardNumber } from "./utils";

// Credit card payment form that captures card number, expiry, CVV, and name.
const CreditCardForm = ({
  paymentData,
  formErrors,
  isLoading,
  handleInputChange,
}) => {
  // Formats card input locally before forwarding it to the parent handler.
  const handleLocalCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    handleInputChange({
      target: {
        name: "cardNumber",
        value: formatted,
        type: "text",
      },
    });
  };

  return (
    <div className="credit-card-form">
      <Form.Group className="mb-3">
        <Form.Label>Card Number</Form.Label>
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="1234 5678 9012 3456"
            name="cardNumber"
            value={paymentData.cardNumber}
            onChange={handleLocalCardNumberChange}
            maxLength={19}
            className={formErrors.cardNumber ? "is-invalid" : ""}
            disabled={isLoading}
          />
          <InputGroup.Text>
            <FontAwesomeIcon icon={faCreditCard} />
          </InputGroup.Text>
          {formErrors.cardNumber && (
            <div className="invalid-feedback">{formErrors.cardNumber}</div>
          )}
        </InputGroup>
      </Form.Group>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Expiration Date</Form.Label>
            <Form.Control
              type="text"
              placeholder="MM/YY"
              name="expDate"
              value={paymentData.expDate}
              onChange={handleInputChange}
              maxLength={5}
              className={formErrors.expDate ? "is-invalid" : ""}
              disabled={isLoading}
            />
            {formErrors.expDate && (
              <div className="invalid-feedback">{formErrors.expDate}</div>
            )}
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>CVV</Form.Label>
            <Form.Control
              type="text"
              placeholder="123"
              name="cvv"
              value={paymentData.cvv}
              onChange={handleInputChange}
              maxLength={4}
              className={formErrors.cvv ? "is-invalid" : ""}
              disabled={isLoading}
            />
            {formErrors.cvv && (
              <div className="invalid-feedback">{formErrors.cvv}</div>
            )}
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>Cardholder Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="John Doe"
          name="cardholderName"
          value={paymentData.cardholderName}
          onChange={handleInputChange}
          className={formErrors.cardholderName ? "is-invalid" : ""}
          disabled={isLoading}
        />
        {formErrors.cardholderName && (
          <div className="invalid-feedback">{formErrors.cardholderName}</div>
        )}
      </Form.Group>
    </div>
  );
};

export default CreditCardForm;
