// User profile request list item.
import React from "react";
import { Card, Badge, Alert } from "react-bootstrap";
import { formatDate } from "./utils";

// Returns the Bootstrap badge variant for a book request status.
const RequestItem = ({ request }) => {
  // Maps a request status to its Bootstrap badge color.
  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return "warning";
      case "Approved":
        return "success";
      case "Rejected":
        return "danger";
      default:
        return "info";
    }
  };

  return (
    <Card key={request.id} className="mb-3">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h6 className="card-title mb-1">{request.bookTitle}</h6>
            <p className="card-text text-muted mb-2">by {request.author}</p>
            <small className="text-muted">
              Requested: {formatDate(request.dateRequested)} • Category:{" "}
              {request.category || "Not specified"}
            </small>
          </div>
          <div className="text-end">
            <Badge bg={getStatusBadge(request.status)}>{request.status}</Badge>
            <div className="mt-2">
              <small className="text-muted">Last updated:</small>
              <br />
              <small>{formatDate(request.dateUpdated)}</small>
            </div>
          </div>
        </div>
        {request.reason && (
          <div className="mt-3">
            <p className="mb-1">
              <strong>Your reason:</strong>
            </p>
            <p className="text-muted">{request.reason}</p>
          </div>
        )}
        {request.adminNotes && (
          <Alert variant="info" className="mt-3">
            <p className="mb-1">
              <strong>Admin Response:</strong>
            </p>
            <p className="mb-0">{request.adminNotes}</p>
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
};

export default RequestItem;
