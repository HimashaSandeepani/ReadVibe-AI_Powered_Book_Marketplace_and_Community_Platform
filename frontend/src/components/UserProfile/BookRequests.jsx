// User profile section for book request history.
import React from "react";
import { Card, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import RequestItem from "./RequestItem";

const BookRequests = ({ requests, onBack, onNewRequest }) => {
  return (
    <Card className="dashboard-card mb-4">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">
            <FontAwesomeIcon icon={faBook} className="me-2" />
            My Book Requests
          </h4>
          <div>
            <Button
              variant="success"
              size="sm"
              className="me-2"
              onClick={onNewRequest}
            >
              <FontAwesomeIcon icon={faPlus} className="me-1" />
              New Request
            </Button>
            <Button variant="outline-secondary" size="sm" onClick={onBack}>
              <FontAwesomeIcon icon={faTimes} /> Back to Overview
            </Button>
          </div>
        </div>
        <div id="myBookRequestsList">
          {requests.length === 0 ? (
            <div className="text-center py-4">
              <FontAwesomeIcon
                icon={faBook}
                size="3x"
                className="text-muted mb-3"
              />
              <p>You haven't requested any books yet</p>
              <Button variant="success" onClick={onNewRequest}>
                <FontAwesomeIcon icon={faPlus} className="me-1" />
                Request Your First Book
              </Button>
            </div>
          ) : (
            requests.map((request) => (
              <RequestItem key={request.id} request={request} />
            ))
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default BookRequests;
