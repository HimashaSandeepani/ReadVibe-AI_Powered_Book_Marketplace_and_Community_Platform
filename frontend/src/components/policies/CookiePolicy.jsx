// Cookie policy page content.
import React from "react";
import { Container, Card, Table, Badge } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCookieBite, faSliders, faShieldHalved } from "@fortawesome/free-solid-svg-icons";

const cookieRows = [
  {
    category: "Authentication",
    purpose: "Keep you signed in, remember your session, and support secure login flows.",
    essential: true,
  },
  {
    category: "Security",
    purpose: "Protect accounts, detect suspicious activity, and keep core features working.",
    essential: true,
  },
  {
    category: "Preferences",
    purpose: "Remember UI choices such as theme, saved filters, and other display settings.",
    essential: false,
  },
  {
    category: "Analytics and Performance",
    purpose: "Understand how users interact with the site so we can improve speed and usability.",
    essential: false,
  },
];

const CookiePolicy = () => {
  return (
    <Container className="py-5 policy-page">
      <div className="text-center mb-4 policy-hero">
        <div className="d-inline-flex align-items-center justify-content-center policy-icon mb-3">
          <FontAwesomeIcon icon={faCookieBite} />
        </div>
        <h1 className="mb-2">ReadVibe Cookie Policy</h1>
        <p className="text-muted mb-0">Last updated: May 19, 2026</p>
      </div>

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Card.Title>What Are Cookies?</Card.Title>
          <Card.Text>
            Cookies are small files stored in your browser that help websites
            remember your session, preferences, and basic usage information.
          </Card.Text>
        </Card.Body>
      </Card>

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Card.Title>How We Use Cookies</Card.Title>
          <Card.Text>
            ReadVibe uses cookies and related browser storage for the following
            purposes:
          </Card.Text>
          <Table striped bordered hover responsive className="mb-0">
            <thead>
              <tr>
                <th>Category</th>
                <th>Purpose</th>
                <th>Essential?</th>
              </tr>
            </thead>
            <tbody>
              {cookieRows.map((row) => (
                <tr key={row.category}>
                  <td>
                    <strong>{row.category}</strong>
                  </td>
                  <td>{row.purpose}</td>
                  <td>
                    <Badge bg={row.essential ? "success" : "warning"}>
                      {row.essential ? "Yes" : "No"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Card.Title>Browser Storage and Preferences</Card.Title>
          <Card.Text>
            In addition to cookies, ReadVibe may use localStorage or
            sessionStorage to remember items such as login state, the
            "Remember Me" preference, and other lightweight settings.
          </Card.Text>
          <Card.Text className="mb-0">
            You can usually clear or block this data from your browser settings,
            but doing so may log you out or reset saved preferences.
          </Card.Text>
        </Card.Body>
      </Card>

      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title>Managing Your Choices</Card.Title>
          <Card.Text>
            Most browsers let you review, delete, or block cookies. You can
            also control site permissions and stored data through the browser
            settings menu.
          </Card.Text>
          <ul>
            <li>Remove cookies and browser storage for a specific site.</li>
            <li>Block third-party cookies or limit tracking where available.</li>
            <li>Choose when websites can store site data on your device.</li>
          </ul>
          <Card.Text className="mb-0">
            Blocking essential cookies may stop you from signing in or using
            parts of the ReadVibe platform correctly.
          </Card.Text>
          <hr />
          <Card.Text className="small mb-0">
            <FontAwesomeIcon icon={faSliders} className="me-2" />
            <FontAwesomeIcon icon={faShieldHalved} className="me-2" />
            We may update this Cookie Policy from time to time. The date above
            shows the most recent revision.
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CookiePolicy;
