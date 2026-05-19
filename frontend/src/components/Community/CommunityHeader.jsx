// Community page header and action bar.
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faPlus,
  faBookMedical,
} from "@fortawesome/free-solid-svg-icons";

// Community header component that exposes the main create and request actions.
const Header = ({
  currentUser,
  handleOpenCreatePostModal,
  handleOpenRequestBookModal,
}) => {
  return (
    <div className="community-header">
      <h2 className="mb-0" style={{ color: "var(--primary-blue)" }}>
        <FontAwesomeIcon icon={faUsers} className="me-2" />
        Community Discussions
      </h2>
      <div>
        <button
          className="btn btn-primary"
          onClick={handleOpenCreatePostModal}
          title={!currentUser ? "Login to create posts" : ""}
        >
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Create Post
        </button>
        <button
          className="btn btn-success ms-2"
          onClick={handleOpenRequestBookModal}
          title={!currentUser ? "Login to request books" : ""}
        >
          <FontAwesomeIcon icon={faBookMedical} className="me-2" />
          Request Book
        </button>
      </div>
    </div>
  );
};

export default Header;
