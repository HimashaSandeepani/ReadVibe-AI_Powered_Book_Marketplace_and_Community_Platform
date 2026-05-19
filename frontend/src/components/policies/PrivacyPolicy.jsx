// Privacy policy page content.
import React from "react";
import { Container, Card, ListGroup, Alert, Badge } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShieldHalved,
  faUserLock,
  faDatabase,
  faListCheck,
} from "@fortawesome/free-solid-svg-icons";

const policySections = [
  {
    title: "1. Information We Collect",
    body: "We collect the minimum data needed to run the ReadVibe marketplace, community, and recommendation features.",
    items: [
      {
        label: "Account Information",
        text: "Name, email, username, password, and role details used to create and manage your account.",
      },
      {
        label: "Shopping and Order Data",
        text: "Books you browse, cart items, wishlist items, checkout details, order history, and delivery information.",
      },
      {
        label: "Community and Support Data",
        text: "Reviews, posts, comments, support messages, and live chat conversations that help power the community experience.",
      },
      {
        label: "Preferences and Device Data",
        text: "Reading preferences, recommendation choices, browser type, IP address, and other basic technical information.",
      },
    ],
  },
  {
    title: "2. How We Use Your Information",
    body: "We use your information to operate the platform, improve relevance, and keep the service secure.",
    items: [
      {
        label: "Platform Operations",
        text: "Create accounts, authenticate users, process orders, manage wishlists, and keep your session active.",
      },
      {
        label: "Personalization",
        text: "Generate book recommendations, tailor content suggestions, and remember your saved preferences.",
      },
      {
        label: "Community Features",
        text: "Publish reviews and posts, moderate abuse, and respond to support requests or live chat messages.",
      },
      {
        label: "Security and Analytics",
        text: "Detect fraud, troubleshoot issues, protect accounts, and understand how the site is used.",
      },
    ],
  },
  {
    title: "3. Data Sharing & Disclosure",
    body: "We do not sell your personal data. We only share it when there is a valid business or legal reason.",
    items: [
      {
        label: "Service Providers",
        text: "Trusted partners that help us host the site, process payments, send notifications, or store data securely.",
      },
      {
        label: "Legal Requirements",
        text: "When disclosure is required to comply with law, enforce our terms, or protect users and the platform.",
      },
      {
        label: "Business Transfers",
        text: "In connection with a merger, acquisition, restructuring, or transfer of assets.",
      },
    ],
  },
  {
    title: "4. Your Rights & Choices",
    body: "You stay in control of most of the personal data we store.",
    items: [
      {
        label: "Access and Update",
        text: "Review and update your account details from your profile page.",
      },
      {
        label: "Delete Account",
        text: "Request account deletion and removal of associated data by contacting support.",
      },
      {
        label: "Recommendations and Emails",
        text: "Choose whether to receive recommendation emails and marketing messages.",
      },
      {
        label: "Cookies and Browser Storage",
        text: "Manage cookies, localStorage, and sessionStorage through your browser settings.",
      },
    ],
  },
];

const PrivacyPolicy = () => {
  return (
    <Container className="py-5 policy-page">
      <div className="text-center mb-4 policy-hero">
        <div className="d-inline-flex align-items-center justify-content-center policy-icon mb-3">
          <FontAwesomeIcon icon={faShieldHalved} />
        </div>
        <h1 className="mb-2">ReadVibe Privacy Policy</h1>
        <p className="text-muted mb-0">Last updated: May 19, 2026</p>
      </div>

      <Alert variant="info" className="mb-4">
        <FontAwesomeIcon icon={faListCheck} className="me-2" />
        This policy describes how ReadVibe handles data across the marketplace,
        community, wishlist, checkout, support, and recommendations features.
      </Alert>

      {policySections.map((section) => (
        <Card className="shadow-sm mb-4" key={section.title}>
          <Card.Body>
            <Card.Title className="mb-3">{section.title}</Card.Title>
            <Card.Text>{section.body}</Card.Text>
            <ListGroup variant="flush">
              {section.items.map((item) => (
                <ListGroup.Item key={item.label}>
                  <strong>{item.label}:</strong> {item.text}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
      ))}

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Card.Title className="mb-3">5. Data Security</Card.Title>
          <Card.Text>
            <FontAwesomeIcon icon={faDatabase} className="me-2 text-primary" />
            We use reasonable technical and organizational safeguards to protect
            your information. Passwords are stored in hashed form, and account
            traffic should be transmitted over secure HTTPS connections.
          </Card.Text>
          <Badge bg="secondary">Security first</Badge>
        </Card.Body>
      </Card>

      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title className="mb-3">Contact Us</Card.Title>
          <Card.Text className="mb-0">
            For questions about this Privacy Policy or your personal data,
            contact <a href="mailto:support@readvibe.com">support@readvibe.com</a>.
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PrivacyPolicy;
