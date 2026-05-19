// Support options for order follow-up.
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faQuestionCircle,
  faEye,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";

// Renders the follow-up support actions for an order.
const SupportOptions = ({
  onViewOrderStatus,
  onContactSupport,
}) => {
  return (
    <div className="support-info mt-4">
      <h6>
        <FontAwesomeIcon icon={faQuestionCircle} className="me-2" />
        Need Help?
      </h6>
      <div className="support-options mt-2">
        <div
          className="support-option mb-2"
          onClick={onViewOrderStatus}
          style={{ cursor: "pointer" }}
        >
          <FontAwesomeIcon icon={faEye} className="me-2 text-primary" />
          <span>View Order Status</span>
        </div>
        <div
          className="support-option mb-2"
          onClick={onContactSupport}
          style={{ cursor: "pointer" }}
        >
          <FontAwesomeIcon icon={faPhone} className="me-2 text-primary" />
          <span>Contact Support</span>
        </div>
      </div>
    </div>
  );
};

export default SupportOptions;
