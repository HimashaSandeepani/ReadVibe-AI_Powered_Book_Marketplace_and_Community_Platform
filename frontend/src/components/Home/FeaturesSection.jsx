// Home page section that summarizes platform features.
import { Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRobot,
  faUsers,
  faShoppingCart,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

// Home page section that summarizes platform features.
const FeaturesSection = () => {
  // Feature cards shown on the home page.
  const features = [
    {
      icon: faRobot,
      title: "AI-Powered Recommendations",
      description:
        "Our intelligent system learns from your reading habits to suggest books you'll genuinely enjoy.",
    },
    {
      icon: faUsers,
      title: "Vibrant Community",
      description:
        "Connect with fellow readers, share reviews, and discover new perspectives on your favorite books.",
    },
    {
      icon: faShoppingCart,
      title: "Seamless Shopping",
      description:
        "Browse, purchase, and get books delivered - all in one convenient platform.",
    },
  ];

  return (
    <Container className="mb-5">
      <h2 className="section-title">
        <FontAwesomeIcon icon={faStar} className="me-2" />
        Why Choose ReadVibe?
        <div className="section-title-decoration"></div>
      </h2>

      <Row>
        {features.map((feature, index) => (
          <Col md={4} key={index} className="mb-4">
            <div className="feature-card">
              <div className="feature-icon">
                <FontAwesomeIcon icon={feature.icon} />
              </div>
              <h4>{feature.title}</h4>
              <p>{feature.description}</p>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default FeaturesSection;
