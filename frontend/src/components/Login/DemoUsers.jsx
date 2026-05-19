// Demo account shortcuts for login testing.
import React from "react";
import { Card, Alert } from "react-bootstrap";
import { DEMO_USERS } from "./utils";

const DemoUsers = () => {
  return (
    <Card className="mt-4">
      <Card.Body>
        <Card.Title>Demo Accounts (For Testing)</Card.Title>
        <Card.Text className="text-muted small mb-3">
          Use these credentials to test different user roles:
        </Card.Text>

        {DEMO_USERS.map((user) => (
          <Alert key={user.id} variant="light" className="small mb-2">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong>{user.name}</strong> ({user.role})
                <br />
                <small className="text-muted">
                  Email: {user.email} | Username: {user.username} | Password:{" "}
                  {user.password}
                </small>
              </div>
            </div>
          </Alert>
        ))}
      </Card.Body>
    </Card>
  );
};

export default DemoUsers;
