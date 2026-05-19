// Guest-only notice for the community feed.
import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

// Guest notice that explains posting restrictions for signed-out users.
const GuestNotice = () => {
  return (
    <div className="guest-restriction mb-4">
      <div className="d-flex align-items-center">
        <FontAwesomeIcon
          icon={faInfoCircle}
          className="me-2"
          style={{ color: "var(--secondary-blue)", fontSize: "1.2rem" }}
        />
        <div>
          <strong>Guest Access:</strong> You can view community but need to{" "}
          <Link to="/login" className="text-primary fw-medium">
            login
          </Link>{" "}
          to create posts, comment, like, and request books.
        </div>
      </div>
    </div>
  );
};

export default GuestNotice;
