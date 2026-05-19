// User profile dashboard overview cards.
import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTachometerAlt } from "@fortawesome/free-solid-svg-icons";

const DashboardOverview = ({ userStats, onNavigate }) => {
  const statsItems = [
    {
      count: userStats.wishlistCount,
      label: "Wishlist Items",
      onClick: () => onNavigate("/wishlist"),
    },
    {
      count: userStats.communityPosts,
      label: "Community Posts",
      onClick: () => onNavigate("/community"),
    },
    {
      count: userStats.myBookRequests,
      label: "My Book Requests",
      onClick: () => onNavigate("requests"),
    },
    {
      count: userStats.booksRead,
      label: "Books Purchased",
      onClick: () => onNavigate("orders"),
    },
  ];

  return (
    <Card className="dashboard-card mb-4">
      <Card.Body>
        <h4>
          <FontAwesomeIcon icon={faTachometerAlt} className="me-2" />
          Dashboard Overview
        </h4>
        <Row className="mt-3">
          {statsItems.map((item, index) => (
            <Col md={3} xs={6} className="mb-3" key={index}>
              <div className="stats-card" onClick={item.onClick}>
                <div className="stats-number">{item.count}</div>
                <div className="stats-label">{item.label}</div>
              </div>
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  );
};

export default DashboardOverview;
