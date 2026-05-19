// User profile reading stats card.
import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";

// Renders the user's reading statistics summary card.
const ReadingStatsCard = ({ userStats }) => {
  return (
    <Card className="dashboard-card">
      <Card.Body>
        <h5>
          <FontAwesomeIcon icon={faChartLine} className="me-2" />
          Reading Stats
        </h5>
        <Row className="text-center mt-3">
          <Col xs={6} className="mb-3">
            <div className="stats-card">
              <div className="stats-number">{userStats.booksRead}</div>
              <div className="stats-label">Books Read</div>
            </div>
          </Col>
          <Col xs={6} className="mb-3">
            <div className="stats-card">
              <div className="stats-number">{userStats.reviewsWritten}</div>
              <div className="stats-label">Reviews</div>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ReadingStatsCard;
