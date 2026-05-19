// User profile modal for requesting a book.
import React, { useState } from "react";
import { Modal, Button, Form, Alert, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookMedical, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const RequestBookModal = ({ show, onHide, onSubmit, categories = [] }) => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "",
    reason: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      title: "",
      author: "",
      isbn: "",
      category: "",
      reason: "",
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>
          <FontAwesomeIcon icon={faBookMedical} className="me-2" />
          Request a New Book
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Book Title *</Form.Label>
            <Form.Control
              type="text"
              name="title"
              placeholder="Enter book title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Author *</Form.Label>
                <Form.Control
                  type="text"
                  name="author"
                  placeholder="Author name"
                  value={formData.author}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>ISBN (Optional)</Form.Label>
                <Form.Control
                  type="text"
                  name="isbn"
                  placeholder="ISBN number"
                  value={formData.isbn}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select category...</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Why do you want this book? *</Form.Label>
            <Form.Control
              as="textarea"
              name="reason"
              rows={3}
              placeholder="Tell us why this book would be valuable to you and other readers..."
              value={formData.reason}
              onChange={handleChange}
              required
            />
            <Form.Text className="text-muted">
              This helps us prioritize popular requests
            </Form.Text>
          </Form.Group>
          <Alert variant="info">
            <small>
              Your request will be reviewed by our stock team. You'll be
              notified when it's available!
            </small>
          </Alert>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="success" onClick={handleSubmit}>
          <FontAwesomeIcon icon={faPaperPlane} className="me-1" />
          Submit Request
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RequestBookModal;
