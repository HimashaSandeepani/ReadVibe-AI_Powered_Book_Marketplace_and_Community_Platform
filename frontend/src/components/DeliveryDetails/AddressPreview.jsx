// Delivery address preview panel.
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

// Delivery address preview component shown during checkout.
const AddressPreview = ({ addressPreview }) => {
  return (
    <div className="delivery-address-preview">
      <h6>
        <FontAwesomeIcon icon={faEye} className="me-2" />
        Address Preview
      </h6>
      <div className="delivery-address-preview-content">
        <strong>Shipping to:</strong>
        <div dangerouslySetInnerHTML={{ __html: addressPreview }} />
      </div>
    </div>
  );
};

export default AddressPreview;
