// Signup form for creating new accounts.
import React from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faLock,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

const SignupForm = ({
  signupData,
  formErrors,
  onInputChange,
  onSubmit,
  onShowTerms,
  onSwitchToLogin,
}) => {
  return (
    <div id="signupFormContainer">
      <h2 className="text-center mb-4" style={{ color: "var(--primary-blue)" }}>
        Join ReadVibe
      </h2>
      <p className="text-center text-muted mb-4">
        Buy books, review purchases, share posts, and get AI recommendations
      </p>

      {formErrors.general && (
        <Alert variant="danger">{formErrors.general}</Alert>
      )}

      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>
            <FontAwesomeIcon icon={faUser} className="me-2" />
            Full Name
          </Form.Label>
          <Form.Control
            type="text"
            className={formErrors.name ? "is-invalid" : ""}
            name="name"
            value={signupData.name}
            onChange={onInputChange}
            placeholder="Enter your full name"
            required
          />
          {formErrors.name && (
            <div className="invalid-feedback">{formErrors.name}</div>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>
            <FontAwesomeIcon icon={faEnvelope} className="me-2" />
            Email address
          </Form.Label>
          <Form.Control
            type="email"
            className={formErrors.email ? "is-invalid" : ""}
            name="email"
            value={signupData.email}
            onChange={onInputChange}
            placeholder="Enter your email"
            required
          />
          {formErrors.email && (
            <div className="invalid-feedback">{formErrors.email}</div>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>
            <FontAwesomeIcon icon={faUser} className="me-2" />
            Username
          </Form.Label>
          <Form.Control
            type="text"
            className={formErrors.username ? "is-invalid" : ""}
            name="username"
            value={signupData.username}
            onChange={onInputChange}
            placeholder="Choose a username"
            required
          />
          {formErrors.username && (
            <div className="invalid-feedback">{formErrors.username}</div>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>
            <FontAwesomeIcon icon={faLock} className="me-2" />
            Password
          </Form.Label>
          <Form.Control
            type="password"
            className={formErrors.password ? "is-invalid" : ""}
            name="password"
            value={signupData.password}
            onChange={onInputChange}
            placeholder="Create a password (min. 8 characters)"
            required
          />
          {formErrors.password && (
            <div className="invalid-feedback">{formErrors.password}</div>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>
            <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
            Confirm Password
          </Form.Label>
          <Form.Control
            type="password"
            className={formErrors.confirmPassword ? "is-invalid" : ""}
            name="confirmPassword"
            value={signupData.confirmPassword}
            onChange={onInputChange}
            placeholder="Confirm your password"
            required
          />
          {formErrors.confirmPassword && (
            <div className="invalid-feedback">{formErrors.confirmPassword}</div>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            id="agreeTerms"
            name="agreeTerms"
            className={formErrors.agreeTerms ? "is-invalid" : ""}
            label={
              <>
                I agree to the{" "}
                <Button
                  variant="link"
                  className="text-decoration-none p-0"
                  onClick={onShowTerms}
                >
                  Terms and Conditions
                </Button>
              </>
            }
            checked={signupData.agreeTerms}
            onChange={onInputChange}
            required
          />
          {formErrors.agreeTerms && (
            <div className="invalid-feedback">{formErrors.agreeTerms}</div>
          )}
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Check
            type="checkbox"
            id="receiveRecommendations"
            name="receiveRecommendations"
            label="Receive AI-powered book recommendations via email"
            checked={signupData.receiveRecommendations}
            onChange={onInputChange}
          />
          <Form.Text className="text-muted small">
            Get personalized book suggestions based on your purchases, reviews,
            and reading activity
          </Form.Text>
        </Form.Group>

        <Button type="submit" variant="primary" className="w-100">
          Create Account
        </Button>
      </Form>

      <hr />

      <div className="text-center">
        <p className="mb-0">
          Already have an account?{" "}
          <Button
            variant="link"
            className="text-decoration-none p-0"
            onClick={onSwitchToLogin}
          >
            Sign in
          </Button>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
