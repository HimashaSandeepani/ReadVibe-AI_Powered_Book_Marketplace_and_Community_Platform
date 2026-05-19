// User profile support messages section.
import React from "react";
import { Button, Card, Badge } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComments,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";

const formatDateTime = (value) =>
  new Date(value).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });

const SupportMessagesSection = ({ messages, onBack }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case "Open":
        return "warning";
      case "Replied":
        return "success";
      default:
        return "info";
    }
  };

  return (
    <Card className="dashboard-card mb-4">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <h4 className="mb-1">
              <FontAwesomeIcon icon={faComments} className="me-2 text-primary" />
              Support Messages
            </h4>
            <p className="text-muted mb-0">
              View replies from the stock manager and follow up on open requests.
            </p>
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-secondary" onClick={onBack}>
              Back to Overview
            </Button>
          </div>
        </div>

        {messages.length === 0 ? (
          <div className="text-center py-5 bg-light rounded-3">
            <FontAwesomeIcon icon={faCircleInfo} className="fa-3x text-muted mb-3" />
            <h5>No support messages yet</h5>
            <p className="text-muted mb-0">
              Messages you send from order confirmation will appear here once support replies.
            </p>
          </div>
        ) : (
          <div className="d-grid gap-3">
            {messages.map((message) => (
              <div key={message.id} className="border rounded-3 p-3 bg-white">
                <div className="d-flex justify-content-between flex-wrap gap-2 mb-2">
                  <div>
                    <h5 className="mb-1">{message.subject}</h5>
                    <div className="text-muted small">
                      Order #{message.orderNumber} - {formatDateTime(message.createdAt)}
                    </div>
                  </div>
                  <Badge
                    bg={getStatusBadge(message.status)}
                    className="support-message-status-badge"
                  >
                    {message.status}
                  </Badge>
                </div>

                <div className="bg-light rounded-3 p-3 mb-3">
                  <strong className="d-block mb-1">Your message</strong>
                  <p className="mb-0">{message.message}</p>
                </div>

                {Array.isArray(message.replies) && message.replies.length > 0 ? (
                  <div className="d-grid gap-2">
                    {message.replies.map((reply) => (
                      <div key={reply.id} className="border-start ps-3">
                        <div className="d-flex justify-content-between gap-2">
                          <strong>{reply.senderName}</strong>
                          <span className="small text-muted">
                            {formatDateTime(reply.createdAt)}
                          </span>
                        </div>
                        <p className="mb-0">{reply.message}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted mb-0">
                    No reply yet. We will update this thread when support responds.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default SupportMessagesSection;