// Privacy policy page content.
import React from "react";
import { Container, Card, ListGroup, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShieldAlt,
  faUserLock,
  faDatabase,
} from "@fortawesome/free-solid-svg-icons";

const PrivacyPolicy = () => {
  return (
    <Container className="py-5">
      <h1 className="text-center mb-4">
        <FontAwesomeIcon icon={faShieldAlt} className="me-2" />
        ReadVibe Privacy Policy
      </h1>
      <p className="text-muted text-center mb-5">
        Last Updated: December 25, 2025
      </p>

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Card.Title>1. Information We Collect</Card.Title>
          <Card.Text>
            We collect information to provide our AI-powered book discovery,
            community features, and text-to-speech services.
          </Card.Text>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <strong>Account Information:</strong> When you sign up (as shown
              in your <code>Login.jsx</code>), we collect your name, email,
              username, and password.
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Reading & Activity Data:</strong> Books you browse or
              purchase, reviews you write, posts you create, your search
              history, and listening activity (for our AI voice feature).
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Preferences:</strong> Your reading preferences (genres,
              authors), and whether you opt-in to receive AI-powered email
              recommendations.
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Technical Data:</strong> Information about the device you
              use to access ReadVibe.
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Card.Title>2. How We Use Your Information</Card.Title>
          <ListGroup variant="flush">
            <ListGroup.Item>To create and manage your account.</ListGroup.Item>
            <ListGroup.Item>
              To power our platform's core features: processing book purchases,
              displaying your community posts, and generating lifelike AI voices
              for text-to-speech.
            </ListGroup.Item>
            <ListGroup.Item>
              To generate <strong>personalized AI recommendations</strong> for
              books and content, both on the platform and via email (if you
              consented during signup).
            </ListGroup.Item>
            <ListGroup.Item>
              To communicate with you about service updates, security alerts,
              and support messages.
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Card.Title>3. Data Sharing & Disclosure</Card.Title>
          <Card.Text>
            We do not sell your personal information. We only share data under
            these specific circumstances:
          </Card.Text>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <strong>Service Providers:</strong> With trusted partners who help
              us operate (e.g., payment processors, cloud hosting). They are
              bound by strict data protection agreements.
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Legal Compliance:</strong> If required by law or to
              protect the rights and safety of ReadVibe and our users.
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Business Transfer:</strong> In connection with a merger,
              sale, or transfer of company assets.
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Card.Title>4. Your Rights & Choices</Card.Title>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <FontAwesomeIcon
                icon={faUserLock}
                className="me-2 text-primary"
              />
              <strong>Access & Correction:</strong> You can review and update
              your account information from your profile page.
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Deletion:</strong> You can request deletion of your
              account and associated data by contacting support.
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Marketing Communications:</strong> You can opt-out of
              promotional emails at any time by using the "unsubscribe" link in
              any email.
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Cookies:</strong> You can manage your cookie preferences
              through your browser settings.
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>

      <Alert variant="info">
        <FontAwesomeIcon icon={faDatabase} className="me-2" />
        <strong>Data Security:</strong> We implement appropriate technical
        measures to protect your data. Your password is stored in a hashed
        format, and we use secure (HTTPS) connections.
      </Alert>

      <p className="mt-4">
        <strong>Contact Us:</strong> For any questions about this Privacy Policy
        or your data, please contact our support team at{" "}
        <a href="mailto:support@readvibe.com">support@readvibe.com</a>.
      </p>
    </Container>
  );
};

export default PrivacyPolicy;
