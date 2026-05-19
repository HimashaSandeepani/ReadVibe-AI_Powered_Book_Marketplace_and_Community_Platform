// Checkout trust and security badges.
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faShieldAlt,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";

// Trust and security badges shown beneath the checkout summary.
const SecurityBadges = () => {
  return (
    <div className="security-badges">
      <div className="security-badge">
        <FontAwesomeIcon icon={faLock} />
        <span>Secure</span>
      </div>
      <div className="security-badge">
        <FontAwesomeIcon icon={faShieldAlt} />
        <span>Protected</span>
      </div>
      <div className="security-badge">
        <FontAwesomeIcon icon={faUserShield} />
        <span>Private</span>
      </div>
    </div>
  );
};

export default SecurityBadges;
