// Live chat modal for post-order support.
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { getCurrentUser } from "../../utils/auth";
import LiveChatThreadList from "../LiveChat/LiveChatThreadList";
import {
  getLiveChatThread,
  getLiveChatUpdatedEventName,
  resolveLiveChatThread,
  sendLiveChatMessage,
} from "../../utils/liveChat";

const LiveChatModal = ({ show, onHide, order }) => {
  const [thread, setThread] = useState(null);

  const refreshThread = () => {
    if (!show || !order) return;
    const user = getCurrentUser();
    if (!user) return;

    const resolved = resolveLiveChatThread({ order, user });
    setThread(resolved || getLiveChatThread(order.id, user.id));
  };

  useEffect(() => {
    refreshThread();
  }, [show, order]);

  useEffect(() => {
    const handleUpdate = () => refreshThread();
    window.addEventListener(getLiveChatUpdatedEventName(), handleUpdate);
    return () => window.removeEventListener(getLiveChatUpdatedEventName(), handleUpdate);
  }, [show, order]);

  const handleSendMessage = (threadItem, message) => {
    const user = getCurrentUser();
    if (!user || !order) return false;
    sendLiveChatMessage({
      order,
      user,
      senderRole: "user",
      senderName: user.name || user.fullName || user.username || "User",
      message,
    });
    return true;
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <FontAwesomeIcon icon={faComment} className="me-2" />
          Live Chat Support
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {thread ? (
          <LiveChatThreadList
            title="Live Chat Support"
            description="Chat with support in real time. Admin replies will appear here automatically."
            threads={[thread]}
            emptyTitle="No live chat thread yet"
            emptyDescription="Start a conversation to open a live support thread."
            currentRole="user"
            onSendMessage={handleSendMessage}
            sendButtonLabel="Send"
          />
        ) : null}
      </Modal.Body>
    </Modal>
  );
};

export default LiveChatModal;
