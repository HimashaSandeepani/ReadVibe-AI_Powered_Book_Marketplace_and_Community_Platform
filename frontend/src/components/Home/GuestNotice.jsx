// Home page notice shown to guest users.
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHandsHelping,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";

// Home page notice shown to guest users.
const GuestNotice = () => {
  return (
    <div className="guest-notice">
      <Container>
        <span style={{ fontWeight: "bold" }}>
          <FontAwesomeIcon icon={faHandsHelping} className="me-2" />
          Welcome Guest!
        </span>
        <div className="guest-restriction mb-4">
          <div className="d-flex align-items-center">
            <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
            <div>
              <strong>Guest Access:</strong> You can browse home but need to{" "}
              <Link to="/login" className="text-primary fw-medium">
                login
              </Link>{" "}
              to add books to cart, wishlist, and make purchases.
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default GuestNotice;
