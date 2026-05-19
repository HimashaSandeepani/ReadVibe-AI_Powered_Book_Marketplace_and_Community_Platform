// Support contact modal for order issues.
import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faInfoCircle } from "@fortawesome/free-solid-svg-icons";

// Renders the support contact modal for order issues.
const ContactSupportModal = ({ show, onHide, order, onSubmit }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSubmit(message);
    setMessage("");
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>
          <FontAwesomeIcon icon={faPhone} className="me-2" />
          Contact Support
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Order Number</Form.Label>
            <Form.Control type="text" value={order.id} readOnly />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Your Message</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your issue or question..."
              required
            />
          </Form.Group>
          <Alert variant="info" className="small">
            <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
            Our support team will respond within 24 hours.
          </Alert>
          <Button variant="primary" type="submit" className="w-100">
            Send Message
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ContactSupportModal;
