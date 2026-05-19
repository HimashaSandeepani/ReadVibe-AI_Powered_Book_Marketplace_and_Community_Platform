// Password reset modal for login recovery.
import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey } from "@fortawesome/free-solid-svg-icons";

const ForgotPasswordModal = ({ show, onHide, onSubmit }) => {
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resetStep, setResetStep] = useState(1);

  // Submits the current password reset step payload to the parent flow.
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    onSubmit({
      step: resetStep,
      email,
      resetCode,
      newPassword,
      confirmNewPassword,
      onSuccess: (message) => {
        setSuccess(message);
        if (resetStep < 3) {
          setResetStep(resetStep + 1);
        } else {
          setTimeout(() => {
            handleClose();
          }, 3000);
        }
      },
      onError: (message) => {
        setError(message);
      },
    });
  };

  // Clears the modal state and closes the password reset dialog.
  const handleClose = () => {
    setEmail("");
    setResetCode("");
    setNewPassword("");
    setConfirmNewPassword("");
    setError("");
    setSuccess("");
    setResetStep(1);
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          <FontAwesomeIcon icon={faKey} className="me-2" />
          Reset Your Password
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          {resetStep === 1 && (
            <Form.Group>
              <Form.Label>Enter your email address</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your-email@example.com"
                required
              />
              <Form.Text className="text-muted">
                We'll send a reset code to this email.
              </Form.Text>
            </Form.Group>
          )}

          {resetStep === 2 && (
            <Form.Group>
              <Form.Label>Enter the reset code</Form.Label>
              <Form.Control
                type="text"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
                placeholder="123456"
                required
              />
              <Form.Text className="text-muted">
                Check your email for the reset code.
              </Form.Text>
            </Form.Group>
          )}

          {resetStep === 3 && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min. 8 characters)"
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Confirm New Password</Form.Label>
                <Form.Control
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {resetStep === 1
              ? "Send Reset Code"
              : resetStep === 2
                ? "Verify Code"
                : "Reset Password"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ForgotPasswordModal;
