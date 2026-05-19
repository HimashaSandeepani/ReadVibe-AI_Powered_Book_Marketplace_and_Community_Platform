// User profile live chat support section.
import React from "react";
import { Button, Card } from "react-bootstrap";
import LiveChatThreadList from "../LiveChat/LiveChatThreadList";

const LiveChatSection = ({ threads, onBack, onSendMessage, onStartChat }) => {
  return (
    <Card className="dashboard-card mb-4">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <h4 className="mb-1">Live Chat</h4>
            <p className="text-muted mb-0">
              Start or continue live support conversations from your profile.
            </p>
          </div>
          <Button variant="outline-secondary" onClick={onBack}>
            Back to Overview
          </Button>
        </div>

        <LiveChatThreadList
          title=""
          description=""
          threads={threads}
          emptyTitle="No live chat threads yet"
          emptyDescription="Start a live chat from your profile to open a support conversation."
          currentRole="user"
          onSendMessage={onSendMessage}
          sendButtonLabel="Send"
          onStartChat={onStartChat}
        />
      </Card.Body>
    </Card>
  );
};

export default LiveChatSection;