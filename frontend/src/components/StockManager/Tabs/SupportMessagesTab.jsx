// Stock manager support messages tab.
import React, { useMemo } from "react";
import { Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComments,
  faPaperPlane,
  faEnvelopeOpenText,
} from "@fortawesome/free-solid-svg-icons";
import StatsCard from "../Common/StatsCard";

const formatDateTime = (value) =>
  new Date(value).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });

const SupportMessagesTab = ({
  messages,
  replyDrafts,
  onReplyDraftChange,
  onReplyMessage,
}) => {
  const stats = useMemo(() => {
    const open = messages.filter((message) => message.status === "Open").length;
    const replied = messages.filter((message) => message.status === "Replied").length;

    return { total: messages.length, open, replied };
  }, [messages]);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">
          <FontAwesomeIcon icon={faComments} className="me-2 text-primary" />
          Support Messages
        </h2>
      </div>

      <div className="row mb-4">
        <div className="col-md-4 col-sm-6 mb-3">
          <StatsCard number={stats.total} label="Total Messages" />
        </div>
        <div className="col-md-4 col-sm-6 mb-3">
          <StatsCard number={stats.open} label="Open" variant="warning" />
        </div>
        <div className="col-md-4 col-sm-6 mb-3">
          <StatsCard number={stats.replied} label="Replied" variant="success" />
        </div>
      </div>

      <div className="stock-manager-dashboard-card">
        {messages.length === 0 ? (
          <div className="text-center py-5">
            <FontAwesomeIcon
              icon={faEnvelopeOpenText}
              className="fa-4x text-muted mb-3"
            />
            <h5>No support messages yet</h5>
            <p className="text-muted mb-0">
              Support requests submitted from order confirmation will appear here.
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
                      Order #{message.orderNumber} - {message.userName}
                      {message.userEmail ? ` (${message.userEmail})` : ""}
                    </div>
                  </div>
                  <div className="text-end">
                    <span
                      className={`badge ${message.status === "Open" ? "bg-warning text-dark" : "bg-success"}`}
                    >
                      {message.status}
                    </span>
                    <div className="small text-muted mt-1">
                      {formatDateTime(message.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="bg-light rounded-3 p-3 mb-3">
                  <strong className="d-block mb-1">Customer message</strong>
                  <p className="mb-0">{message.message}</p>
                </div>

                {Array.isArray(message.replies) && message.replies.length > 0 && (
                  <div className="mb-3">
                    <strong className="d-block mb-2">Conversation</strong>
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
                  </div>
                )}

                <Form
                  onSubmit={(event) => {
                    event.preventDefault();
                    onReplyMessage(message.id);
                  }}
                >
                  <Form.Group className="mb-2">
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Write a reply to the customer"
                      value={replyDrafts[message.id] || ""}
                      onChange={(event) => onReplyDraftChange(message.id, event.target.value)}
                    />
                  </Form.Group>
                  <div className="d-flex justify-content-end">
                    <Button type="submit" variant="primary">
                      <FontAwesomeIcon icon={faPaperPlane} className="me-2" />
                      Send Reply
                    </Button>
                  </div>
                </Form>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default SupportMessagesTab;