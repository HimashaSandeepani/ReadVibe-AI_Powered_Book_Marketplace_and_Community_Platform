// Admin tab for live chat moderation.
import React from "react";
import LiveChatThreadList from "../LiveChat/LiveChatThreadList";
import { getCurrentUser } from "../../utils/auth";

// Admin live chat moderation tab component.
const LiveChatTab = ({ threads, onSendMessage }) => {
  const currentUser = getCurrentUser();

  return (
    <LiveChatThreadList
      title="Live Chat"
      description="Monitor live order conversations and respond to users in real time."
      threads={threads}
      emptyTitle="No live chat threads"
      emptyDescription="Live chats started from the order confirmation page will appear here."
      currentRole="admin"
      onSendMessage={(thread, message) =>
        onSendMessage(thread, message, currentUser)
      }
      sendButtonLabel="Reply"
    />
  );
};

export default LiveChatTab;