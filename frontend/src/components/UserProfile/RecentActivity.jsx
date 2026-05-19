// User profile recent activity feed.
import React from "react";
import { Card, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faSyncAlt,
  faShoppingBag,
  faStar,
  faBook,
} from "@fortawesome/free-solid-svg-icons";

const iconMap = {
  shoppingBag: faShoppingBag,
  star: faStar,
  book: faBook,
};

// Renders the recent activity feed for the user profile.
const RecentActivity = ({ activities, onRefresh }) => {
  return (
    <Card className="dashboard-card mb-4">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">
            <FontAwesomeIcon icon={faClock} className="me-2" />
            Recent Activity
          </h4>
          <Button variant="outline-primary" size="sm" onClick={onRefresh}>
            <FontAwesomeIcon icon={faSyncAlt} />
          </Button>
        </div>
        <div id="recentActivity">
          {activities.length === 0 ? (
            <div className="text-center py-3">
              <p className="text-muted">No recent activity yet</p>
            </div>
          ) : (
            activities.map((activity, index) => (
              <div
                key={index}
                className="d-flex justify-content-between align-items-center py-2 border-bottom"
              >
                <div>
                  <FontAwesomeIcon
                    icon={iconMap[activity.icon] || faClock}
                    className="me-2 text-primary"
                  />
                  {activity.text}
                </div>
                <small className="text-muted">{activity.time}</small>
              </div>
            ))
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default RecentActivity;
