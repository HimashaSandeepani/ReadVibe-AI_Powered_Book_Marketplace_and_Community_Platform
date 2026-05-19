// Terms of service page content.
import React from "react";
import { Container, Card, ListGroup, Badge } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faScaleBalanced,
  faBook,
  faUsers,
  faRocket,
} from "@fortawesome/free-solid-svg-icons";

const TermsOfService = () => {
  return (
    <Container className="py-5 policy-page">
      <div className="text-center mb-4 policy-hero">
        <div className="d-inline-flex align-items-center justify-content-center policy-icon mb-3">
          <FontAwesomeIcon icon={faScaleBalanced} />
        </div>
        <h1 className="mb-2">ReadVibe Terms of Service</h1>
        <p className="text-muted mb-0">Effective date: May 19, 2026</p>
      </div>

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Card.Title>1. Acceptance of Terms</Card.Title>
          <Card.Text>
            By creating an account or using ReadVibe, you agree to these Terms
            of Service. If you do not agree, you must not use the platform.
          </Card.Text>
        </Card.Body>
      </Card>

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Card.Title>
            2. Description of Service <Badge bg="info">Marketplace</Badge>
          </Card.Title>
          <Card.Text>
            ReadVibe is a book marketplace and community platform that
            combines:
          </Card.Text>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <FontAwesomeIcon icon={faBook} className="me-2" />A marketplace
              for browsing, buying, and saving books to your wishlist.
            </ListGroup.Item>
            <ListGroup.Item>
              <FontAwesomeIcon icon={faUsers} className="me-2" />A community
              space for reviews, comments, and book-related discussion.
            </ListGroup.Item>
            <ListGroup.Item>
              <FontAwesomeIcon icon={faRocket} className="me-2" />AI-powered
              recommendations and account features that personalize the
              shopping experience.
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Card.Title>3. User Accounts & Responsibilities</Card.Title>
          <ListGroup variant="flush">
            <ListGroup.Item>
              You must provide accurate information when registering and keep
              your account details up to date.
            </ListGroup.Item>
            <ListGroup.Item>
              You are responsible for keeping your login credentials secure and
              for activity performed under your account.
            </ListGroup.Item>
            <ListGroup.Item>
              You must not use the platform to post abusive, unlawful, hateful,
              infringing, or deceptive content.
            </ListGroup.Item>
            <ListGroup.Item>
              You must not attempt to interfere with site security, scraping,
              checkout flows, or other users' accounts.
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Card.Title>4. Orders, Content, and Purchases</Card.Title>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <strong>Orders:</strong> Product availability, pricing, and stock
              levels can change before checkout is completed.
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Payments:</strong> You agree to provide valid payment and
              delivery details when placing an order.
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>User Content:</strong> You keep ownership of the reviews
              and posts you create, but grant ReadVibe permission to display
              and moderate that content on the platform.
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Platform IP:</strong> ReadVibe's software, branding, and
              design remain our property and may not be copied without
              permission.
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Card.Title>5. Disclaimers & Liability</Card.Title>
          <Card.Text>
            ReadVibe is provided on an "as is" and "as available" basis. We
            do not guarantee uninterrupted access, and we are not responsible
            for all errors, delays, or third-party service issues.
          </Card.Text>
          <Card.Text className="mt-2">
            We are not responsible for the accuracy, legality, or reliability
            of user-generated content posted by other users.
          </Card.Text>
          <Card.Text className="mt-2 fst-italic">
            To the fullest extent permitted by law, ReadVibe will not be liable
            for indirect, incidental, or consequential damages from your use of
            the platform.
          </Card.Text>
        </Card.Body>
      </Card>

      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title>6. Governing Law & Changes</Card.Title>
          <Card.Text>
            These Terms are governed by the laws of Sri Lanka. We may update
            these Terms from time to time, and continued use of the platform
            after changes means you accept the updated version.
          </Card.Text>
          <Card.Text className="mt-3 mb-0">
            Contact for terms inquiries: <a href="mailto:support@readvibe.com">support@readvibe.com</a>
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default TermsOfService;
