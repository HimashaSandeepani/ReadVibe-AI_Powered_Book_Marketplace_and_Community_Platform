// Marketplace notice shown to guest users.
import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

// Renders the guest access notice shown in the marketplace.
const GuestNotice = ({ user }) => {
  if (user) return null;

  return (
    <div className="guest-restriction mb-4">
      <div className="d-flex align-items-center">
        <FontAwesomeIcon
          icon={faInfoCircle}
          className="me-2"
          style={{ color: "var(--secondary-blue)", fontSize: "1.2rem" }}
        />
        <div>
          <strong>Guest Access:</strong> You can browse books but need to{" "}
          <Link to="/login" className="text-primary fw-medium">
            login
          </Link>{" "}
          to add to cart, wishlist, or purchase.
        </div>
      </div>
    </div>
  );
};

export default GuestNotice;
