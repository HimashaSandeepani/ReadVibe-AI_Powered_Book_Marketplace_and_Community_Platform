// Cookie policy page content.
import React from "react";
import { Container, Card, Table, Badge } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCookieBite } from "@fortawesome/free-solid-svg-icons";

const CookiePolicy = () => {
  return (
    <Container className="py-5">
      <h1 className="text-center mb-4">
        <FontAwesomeIcon icon={faCookieBite} className="me-2" />
        ReadVibe Cookie Policy
      </h1>
      <p className="text-muted text-center mb-5">
        Last Updated: December 25, 2025
      </p>

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Card.Title>What Are Cookies?</Card.Title>
          <Card.Text>
            Cookies are small text files placed on your device when you visit a
            website. They are widely used to make websites work efficiently and
            to provide information to the site owners.
          </Card.Text>
        </Card.Body>
      </Card>

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Card.Title>How We Use Cookies</Card.Title>
          <Card.Text>
            ReadVibe uses cookies for the following essential purposes:
          </Card.Text>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Category</th>
                <th>Purpose</th>
                <th>Essential?</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>Authentication</strong>
                </td>
                <td>
                  To keep you logged in during your session and remember your
                  preferences (like "Remember Me").
                </td>
                <td>
                  <Badge bg="success">Yes</Badge>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Security & Functionality</strong>
                </td>
                <td>
                  To support security features, load-balance traffic, and enable
                  core site functions.
                </td>
                <td>
                  <Badge bg="success">Yes</Badge>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Preferences</strong>
                </td>
                <td>
                  To store your UI settings (like theme) and local listening
                  progress for offline TTS.
                </td>
                <td>
                  <Badge bg="warning">No</Badge>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Analytics & Performance</strong>
                </td>
                <td>
                  To understand how users interact with our platform (e.g.,
                  popular features) and improve performance.
                </td>
                <td>
                  <Badge bg="warning">No</Badge>
                </td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title>Managing Your Cookie Preferences</Card.Title>
          <Card.Text>
            Most web browsers allow you to control cookies through their
            settings. You can usually:
          </Card.Text>
          <ul>
            <li>View the cookies stored on your device and delete them.</li>
            <li>Block cookies from all or specific sites.</li>
            <li>
              Set preferences to be asked each time a site wants to set a
              cookie.
            </li>
          </ul>
          <Card.Text>
            Please refer to your browser's "Help" section for instructions. Be
            aware that blocking essential cookies may prevent parts of the
            ReadVibe website from functioning correctly.
          </Card.Text>
          <hr />
          <Card.Text className="small">
            <strong>Updates to This Policy:</strong> We may update this Cookie
            Policy. The "Last Updated" date at the top will reflect the most
            recent changes.
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CookiePolicy;
