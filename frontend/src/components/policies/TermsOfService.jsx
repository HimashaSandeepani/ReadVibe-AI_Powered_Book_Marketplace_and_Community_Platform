// Terms of service page content.
import React from "react";
import { Container, Card, ListGroup, Badge } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faScaleBalanced,
  faBook,
  faGem,
  faComment,
} from "@fortawesome/free-solid-svg-icons";

const TermsOfService = () => {
  return (
    <Container className="py-5">
      <h1 className="text-center mb-4">
        <FontAwesomeIcon icon={faScaleBalanced} className="me-2" />
        ReadVibe Terms of Service
      </h1>
      <p className="text-muted text-center mb-5">
        <strong>Effective Date:</strong> December 25, 2025
      </p>

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Card.Title>1. Acceptance of Terms</Card.Title>
          <Card.Text>
            By creating an account or using the ReadVibe platform, you agree to
            be bound by these Terms of Service. If you do not agree, you may not
            use our services.
          </Card.Text>
        </Card.Body>
      </Card>

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Card.Title>
            2. Description of Service <Badge bg="info">Beta</Badge>
          </Card.Title>
          <Card.Text>ReadVibe is an online platform that combines:</Card.Text>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <FontAwesomeIcon icon={faBook} className="me-2" />A marketplace
              for discovering and purchasing books.
            </ListGroup.Item>
            <ListGroup.Item>
              <FontAwesomeIcon icon={faComment} className="me-2" />A social
              community for readers to post reviews and discuss books.
            </ListGroup.Item>
            <ListGroup.Item>
              <FontAwesomeIcon icon={faGem} className="me-2" />
              <strong>AI-Powered Features:</strong> Personalized recommendations
              and lifelike text-to-speech (TTS) to convert books, PDFs, and
              articles into audiobooks offline in multiple languages.
            </ListGroup.Item>
          </ListGroup>
          <Card.Text className="mt-3">
            <strong>Freemium Model:</strong> The TTS service operates on a
            freemium model (5 minutes free daily, with unlimited access via a
            paid plan), as described on{" "}
            <a
              href="https://readvibe.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              readvibe.com
            </a>
            .
          </Card.Text>
        </Card.Body>
      </Card>

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Card.Title>3. User Accounts & Responsibilities</Card.Title>
          <ListGroup variant="flush">
            <ListGroup.Item>
              You must be at least 13 years old to use ReadVibe.
            </ListGroup.Item>
            <ListGroup.Item>
              You are responsible for maintaining the confidentiality of your
              account (username/password) and for all activities under it.
            </ListGroup.Item>
            <ListGroup.Item>
              You agree to provide accurate information during registration (as
              per your sign-up form).
            </ListGroup.Item>
            <ListGroup.Item className="text-danger">
              <strong>Prohibited Conduct:</strong> You may not use the service
              to upload illegal content, infringe on intellectual property,
              harass others, or attempt to disrupt the platform.
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Card.Title>4. Purchases, Subscriptions & Content</Card.Title>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <strong>Book Purchases:</strong> All sales of books through the
              marketplace are final unless defective.
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>TTS Subscriptions:</strong> Fees for unlimited TTS access
              are billed in advance and are non-refundable.
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>User Content:</strong> You retain ownership of the reviews
              and posts you create. By posting, you grant ReadVibe a license to
              display that content on the platform.
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Our Content:</strong> The ReadVibe platform, its code,
              logos, and design are our intellectual property. The books and
              other media sold are the property of their respective rights
              holders.
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Card.Title>5. Disclaimers & Limitation of Liability</Card.Title>
          <Card.Text>
            <strong>"As Is" Service:</strong> ReadVibe is provided on an "as is"
            and "as available" basis, especially during its Beta phase. We do
            not guarantee the service will be uninterrupted or error-free.
          </Card.Text>
          <Card.Text className="mt-2">
            <strong>Content Accuracy:</strong> We are not responsible for the
            accuracy of user-generated content (reviews, posts).
          </Card.Text>
          <Card.Text className="mt-2 fst-italic">
            To the fullest extent permitted by law, ReadVibe shall not be liable
            for any indirect or consequential damages arising from your use of
            the service.
          </Card.Text>
        </Card.Body>
      </Card>

      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title>6. Governing Law & Changes</Card.Title>
          <Card.Text>
            These Terms are governed by the laws of Sri Lanka. We reserve the
            right to modify these Terms at any time. We will notify users of
            significant changes via email or a notice on the platform. Continued
            use after changes constitutes acceptance.
          </Card.Text>
          <Card.Text className="mt-3">
            <strong>Contact for Terms Inquiries:</strong> support@readvibe.com
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default TermsOfService;
