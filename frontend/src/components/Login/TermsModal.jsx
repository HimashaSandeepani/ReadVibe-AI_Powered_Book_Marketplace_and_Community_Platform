// Terms and conditions modal for signup flow.
import React from "react";
import { Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileContract } from "@fortawesome/free-solid-svg-icons";
import { TERMS_AND_CONDITIONS } from "./utils";

const TermsModal = ({ show, onHide, onAgree }) => {
  // Converts the terms text into headings, paragraphs, and list items.
  const renderTermsContent = () => {
    return TERMS_AND_CONDITIONS.split("\n").map((line, index) => {
      if (line.startsWith("# ")) {
        return <h4 key={index}>{line.substring(2)}</h4>;
      } else if (line.startsWith("## ")) {
        return (
          <h5 key={index} className="mt-3">
            {line.substring(3)}
          </h5>
        );
      } else if (line.trim().startsWith("-")) {
        return (
          <li key={index} className="ms-3">
            {line.substring(1).trim()}
          </li>
        );
      } else if (line.trim()) {
        return (
          <p key={index} className="mb-2">
            {line}
          </p>
        );
      }
      return <br key={index} />;
    });
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <FontAwesomeIcon icon={faFileContract} className="me-2" />
          ReadVibe Terms and Conditions
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: "400px", overflowY: "auto" }}>
        <div className="terms-content">{renderTermsContent()}</div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={onAgree}>
          I Agree to Terms
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TermsModal;
