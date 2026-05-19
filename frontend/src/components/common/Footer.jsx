// Global site footer.
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF,
  faTwitter,
  faInstagram,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";

// Global site footer component.
const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Handles newsletter signup submission and clears the email field.
  const handleSubscribe = (e) => {
    e.preventDefault();
    const emailInput = e.target.querySelector('input[type="email"]');
    if (emailInput && emailInput.value) {
      alert(
        `Thank you for subscribing with ${emailInput.value}! You'll receive our newsletter soon.`,
      );
      emailInput.value = "";
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="footer-brand">
              <FontAwesomeIcon icon={faBookOpen} className="me-2" />
              <h4 className="d-inline">ReadVibe</h4>
            </div>
            <p className="footer-description">
              AI-powered book discovery and community platform for modern
              readers. Find your next favorite book with personalized
              recommendations.
            </p>

            <div className="footer-contact mb-3">
              <div className="contact-item">
                <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                <span>readvibe.noreply@gmail.com</span>
              </div>
              <div className="contact-item">
                <FontAwesomeIcon icon={faPhone} className="me-2" />
                <span>+94 (71) 456 7678</span>
              </div>
              <div className="contact-item">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />
                <span>
                  No.100, Colombo Road, Colombo, SriLanka.
                </span>
              </div>
            </div>

            <div className="social-links">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="Facebook"
              >
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="Twitter"
              >
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="Instagram"
              >
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="LinkedIn"
              >
                <FontAwesomeIcon icon={faLinkedinIn} />
              </a>
            </div>
          </div>

          <div className="col-lg-2 col-md-3 mb-4">
            <h5 className="footer-heading">Explore</h5>
            <ul className="footer-links">
              <li>
                <Link to="/" className="footer-link">
                  <span className="link-icon">›</span> Home
                </Link>
              </li>
              <li>
                <Link to="/marketplace" className="footer-link">
                  <span className="link-icon">›</span> Browse Books
                </Link>
              </li>
              <li>
                <Link to="/community" className="footer-link">
                  <span className="link-icon">›</span> Community
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-3 mb-4">
            <h5 className="footer-heading">Account</h5>
            <ul className="footer-links">
              <li>
                <Link to="/login" className="footer-link">
                  <span className="link-icon">›</span> Login
                </Link>
              </li>
              <li>
                <Link to="/login?signup=true" className="footer-link">
                  <span className="link-icon">›</span> Sign Up
                </Link>
              </li>
              <li>
                <Link to="/user-profile" className="footer-link">
                  <span className="link-icon">›</span> My Profile
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="footer-link">
                  <span className="link-icon">›</span> My Bookshelf
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-lg-4 col-md-6 mb-4">
            <h5 className="footer-heading">Stay Updated</h5>
            <p className="footer-newsletter-text">
              Subscribe to our newsletter for the latest book recommendations,
              community updates, and exclusive offers.
            </p>
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <div className="input-group">
                <input
                  id="newsletter_form"
                  type="email"
                  className="form-control newsletter-input"
                  placeholder="Your email address"
                  required
                  aria-label="Email for newsletter subscription"
                />
                <button
                  id="newsletter_btn"
                  type="submit"
                  className="btn newsletter-btn"
                  aria-label="Subscribe to newsletter"
                >
                  Subscribe
                </button>
              </div>
              <small className="form-text">
                We respect your privacy. Unsubscribe at any time.
              </small>
            </form>
          </div>
        </div>

        <hr className="footer-divider" />

        <div className="footer-bottom">
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="mb-2 mb-md-0">
                &copy; {currentYear} ReadVibe. All rights reserved.
              </p>
            </div>
            <div className="col-md-6">
              <div className="footer-legal-links">
                <Link to="/privacy-policy" className="legal-link">
                  Privacy Policy
                </Link>
                <span className="separator">•</span>
                <Link to="/terms-of-service" className="legal-link">
                  Terms of Service
                </Link>
                <span className="separator">•</span>
                <Link to="/cookies" className="legal-link">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
