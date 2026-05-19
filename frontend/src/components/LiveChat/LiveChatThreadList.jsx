// Live chat thread list for support conversations.
import React, { useMemo, useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faPaperPlane, faCircleInfo } from "@fortawesome/free-solid-svg-icons";

// Formats live chat timestamps for display in the thread list.
const formatDateTime = (value) =>
  new Date(value).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });

// Live chat thread list component for support conversations.
const LiveChatThreadList = ({
  title,
  description,
  threads,
  emptyTitle,
  emptyDescription,
  currentRole,
  onSendMessage,
  onStartChat,
  sendButtonLabel = "Send Message",
}) => {
  // Stores the current draft message for each chat thread.
  const [drafts, setDrafts] = useState({});

  // Keeps the newest live chat threads at the top of the list.
  const sortedThreads = useMemo(
    () => [...threads].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)),
    [threads],
  );

  // Sends a drafted reply for the selected thread and clears the input on success.
  const handleSubmit = async (event, thread) => {
    event.preventDefault();
    const draft = drafts[thread.id] || "";
    const sent = await Promise.resolve(onSendMessage(thread, draft));
    if (sent !== false) {
      setDrafts((prev) => ({ ...prev, [thread.id]: "" }));
    }
  };

  return (
    <Card className="dashboard-card mb-4">
      <Card.Body>
        {(title || description) && (
          <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-2">
            <div>
              {title && (
                <h4 className="mb-1">
                  <FontAwesomeIcon icon={faComments} className="me-2 text-primary" />
                  {title}
                </h4>
              )}
              {description && <p className="text-muted mb-0">{description}</p>}
            </div>
          </div>
        )}

        {sortedThreads.length === 0 ? (
          <div className="text-center py-5 bg-light rounded-3">
            <FontAwesomeIcon icon={faCircleInfo} className="fa-3x text-muted mb-3" />
            <h5>{emptyTitle}</h5>
            <p className="text-muted mb-0">{emptyDescription}</p>
            {typeof onStartChat === "function" ? (
              <Button variant="primary" className="mt-3" onClick={onStartChat}>
                Start Live Chat
              </Button>
            ) : null}
          </div>
        ) : (
          <div className="d-grid gap-3">
            {sortedThreads.map((thread) => {
              const messages = Array.isArray(thread.messages) ? thread.messages : [];
              return (
                <div key={thread.id} className="border rounded-3 p-3 bg-white">
                  <div className="d-flex justify-content-between flex-wrap gap-2 mb-3">
                    <div>
                      <h5 className="mb-1">Order #{thread.orderNumber}</h5>
                      <div className="text-muted small">
                        {thread.userName}
                        {thread.userEmail ? ` (${thread.userEmail})` : ""}
                      </div>
                    </div>
                    <div className="text-end">
                      <span className="badge bg-primary">Open</span>
                      <div className="small text-muted mt-1">
                        {formatDateTime(thread.updatedAt || thread.createdAt)}
                      </div>
                    </div>
                  </div>

                  <div className="d-grid gap-2 mb-3">
                    {messages.map((message) => {
                      const isOwnMessage =
                        message.senderRole === currentRole ||
                        (currentRole === "admin" && message.senderRole === "system");
                      return (
                        <div
                          key={message.id}
                          className={`d-flex ${isOwnMessage ? "justify-content-end" : "justify-content-start"}`}
                        >
                          <div
                            className={`rounded-3 px-3 py-2 ${message.senderRole === "system" ? "bg-light text-muted" : isOwnMessage ? "bg-primary text-white" : "bg-secondary text-white"}`}
                            style={{ maxWidth: "75%" }}
                          >
                            <div className="small fw-semibold mb-1">{message.senderName}</div>
                            <div>{message.message}</div>
                            <div className="small mt-1 opacity-75">
                              {formatDateTime(message.createdAt)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <Form onSubmit={(event) => handleSubmit(event, thread)}>
                    <Form.Group className="mb-2">
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Write a message"
                        value={drafts[thread.id] || ""}
                        onChange={(event) =>
                          setDrafts((prev) => ({
                            ...prev,
                            [thread.id]: event.target.value,
                          }))
                        }
                      />
                    </Form.Group>
                    <div className="d-flex justify-content-end">
                      <Button type="submit" variant="primary">
                        <FontAwesomeIcon icon={faPaperPlane} className="me-2" />
                        {sendButtonLabel}
                      </Button>
                    </div>
                  </Form>
                </div>
              );
            })}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default LiveChatThreadList;