// User profile identity and account summary card.
import React from "react";
import { Card, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faEdit,
  faHistory,
  faStar,
  faBook,
  faComments,
} from "@fortawesome/free-solid-svg-icons";

// Renders the user's identity card and profile navigation buttons.
const UserInfoCard = ({
  user,
  activeSection,
  onEditProfile,
  onChangeSection,
}) => {
  return (
    <Card className="dashboard-card text-center mb-4">
      <Card.Body>
        <div className="user-avatar mx-auto mb-3">
          <span>
            {user?.name ? user.name.substring(0, 2).toUpperCase() : "US"}
          </span>
        </div>
        <h4>{user?.name || "User"}</h4>
        <p className="text-muted">{user?.email || "No email provided"}</p>
        <p className="text-muted">
          <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
          Member since <span>{new Date().getFullYear()}</span>
        </p>

        <div className="mt-4">
          <Button
            variant="outline-primary"
            className="w-100 mb-2"
            onClick={onEditProfile}
          >
            <FontAwesomeIcon icon={faEdit} className="me-2" />
            Edit Profile
          </Button>
          <Button
            variant={
              activeSection === "orders" ? "primary" : "outline-secondary"
            }
            className="w-100 mb-2"
            onClick={() => onChangeSection("orders")}
          >
            <FontAwesomeIcon icon={faHistory} className="me-2" />
            Order History
          </Button>
          <Button
            variant={
              activeSection === "reviews" ? "primary" : "outline-success"
            }
            className="w-100 mb-2"
            onClick={() => onChangeSection("reviews")}
          >
            <FontAwesomeIcon icon={faStar} className="me-2" />
            My Reviews
          </Button>
          <Button
            variant={activeSection === "requests" ? "primary" : "outline-info"}
            className="w-100"
            onClick={() => onChangeSection("requests")}
          >
            <FontAwesomeIcon icon={faBook} className="me-2" />
            Book Requests
          </Button>
          <Button
            variant={activeSection === "messages" ? "primary" : "outline-dark"}
            className="w-100 mt-2"
            onClick={() => onChangeSection("messages")}
          >
            <FontAwesomeIcon icon={faComments} className="me-2" />
            Support Messages
          </Button>
          <Button
            variant={activeSection === "live-chat" ? "primary" : "outline-primary"}
            className="w-100 mt-2"
            onClick={() => onChangeSection("live-chat")}
          >
            <FontAwesomeIcon icon={faComments} className="me-2" />
            Live Chat
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default UserInfoCard;
