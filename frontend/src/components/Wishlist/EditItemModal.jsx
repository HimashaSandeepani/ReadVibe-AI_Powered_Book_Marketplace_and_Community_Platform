// Wishlist modal for editing item priority, notes, and actions.
import React from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faStar,
  faComment,
  faTrash,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
// In WishlistItem.jsx, EditItemModal.jsx, etc.
import { renderPriorityStars, getPriorityLabel } from "./utils.jsx";

// Renders the modal for editing wishlist item priority and notes.
const EditItemModal = ({
  show,
  onHide,
  selectedItem,
  priority,
  setPriority,
  notes,
  setNotes,
  onRemove,
  onUpdate,
}) => {
  if (!selectedItem) return null;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>
          <FontAwesomeIcon icon={faEdit} className="me-2" />
          Edit Wishlist Item
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <div className="selected-book-preview mb-4 p-3 border rounded">
            <Row className="align-items-center">
              <Col xs={3}>
                <img
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  className="img-fluid rounded"
                  style={{
                    width: "60px",
                    height: "80px",
                    objectFit: "cover",
                  }}
                />
              </Col>
              <Col xs={9}>
                <h6 className="mb-1">{selectedItem.title}</h6>
                <p className="text-muted small mb-1">
                  by {selectedItem.author}
                </p>
                <p className="fw-semibold mb-0">
                  LKR {selectedItem.price.toFixed(2)}
                </p>
              </Col>
            </Row>
          </div>

          <Form.Group className="mb-4">
            <Form.Label className="fw-bold">
              <FontAwesomeIcon icon={faStar} className="me-2 text-warning" />
              Priority Level
            </Form.Label>
            <div className="priority-selection">
              <p className="text-muted small mb-2">
                How soon do you want to read this book?
              </p>
              {renderPriorityStars(priority, true, setPriority)}
              <div className="priority-labels mt-2 text-center">
                <small className="text-muted">
                  {getPriorityLabel(priority)}
                </small>
              </div>
            </div>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-bold">
              <FontAwesomeIcon icon={faComment} className="me-2 text-info" />
              Notes (Optional)
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Why do you want this book? What interests you about it?"
              maxLength={500}
            />
            <Form.Text className="text-muted">
              {notes.length}/500 characters
            </Form.Text>
          </Form.Group>

          <div className="d-flex justify-content-between">
            <Button
              variant="outline-danger"
              onClick={() => {
                if (window.confirm("Remove this book from your wishlist?")) {
                  onRemove(selectedItem.id);
                  onHide();
                }
              }}
            >
              <FontAwesomeIcon icon={faTrash} className="me-2" />
              Remove
            </Button>
            <Button variant="primary" onClick={onUpdate}>
              <FontAwesomeIcon icon={faSave} className="me-2" />
              Save Changes
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditItemModal;
