// Important note block for delivery selection.
import React from "react";
import { Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

// Important delivery note component that explains tax and shipping rules.
const ImportantNote = () => {
  return (
    <div className="delivery-note alert alert-info">
      <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
      <strong>Note:</strong> Tax is calculated at 5% VAT (standard rate for Sri
      Lanka). Shipping costs may vary based on location and selected method.
    </div>
  );
};

export default ImportantNote;
