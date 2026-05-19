// Home page hero banner and primary call to action.
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faBrain,
  faSearch,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

// Home page hero banner and primary call to action.
const HeroSection = () => {
  return (
    <section className="hero-section">
      <Container>
        <Row className="align-items-center">
          <Col lg={6}>
            <h1 className="hero-title">
              <FontAwesomeIcon icon={faBookOpen} className="me-2" />
              Discover Books You'll Love
            </h1>
            <p className="hero-subtitle">
              <FontAwesomeIcon icon={faBrain} className="me-2" />
              AI-powered recommendations tailored to your unique reading
              preferences. Join our vibrant community of book lovers.
            </p>
            <div className="mt-4">
              <Link
                to="/marketplace"
                className="btn btn-light btn-lg me-3"
                onClick={() => window.scrollTo(0, 0)}
              >
                <FontAwesomeIcon icon={faSearch} className="me-2" />
                Browse Books
              </Link>
              <Link
                to="/community"
                className="btn btn-outline-light btn-lg"
                onClick={() => window.scrollTo(0, 0)}
              >
                <FontAwesomeIcon icon={faUsers} className="me-2" />
                Join Community
              </Link>
            </div>
          </Col>
          <Col lg={6} className="text-center">
            <img
              src="/assets/discovery_img.jpg"
              alt="Book Discovery"
              className="img-fluid rounded-3 shadow-lg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/assets/discovery_img.jpg";
              }}
            />
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default HeroSection;
