// Login form for existing users.
import React from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";

const LoginForm = ({
  loginData,
  formErrors,
  onInputChange,
  onSubmit,
  onForgotPassword,
  onSwitchToSignup,
}) => {
  return (
    <div id="loginFormContainer">
      <h2 className="text-center mb-4" style={{ color: "var(--primary-blue)" }}>
        Welcome Back to ReadVibe
      </h2>
      <p className="text-center text-muted mb-4">
        Your Book Marketplace & Reading Community
      </p>

      {formErrors.general && (
        <Alert variant="danger">{formErrors.general}</Alert>
      )}

      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>
            <FontAwesomeIcon icon={faUser} className="me-2" />
            Username or Email
          </Form.Label>
          <Form.Control
            type="text"
            className={formErrors.username ? "is-invalid" : ""}
            name="username"
            value={loginData.username}
            onChange={onInputChange}
            placeholder="Enter your username or email"
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
            value={loginData.password}
            onChange={onInputChange}
            placeholder="Enter your password"
            required
          />
          {formErrors.password && (
            <div className="invalid-feedback">{formErrors.password}</div>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            id="rememberMe"
            name="rememberMe"
            label="Remember me"
            checked={loginData.rememberMe}
            onChange={onInputChange}
          />
        </Form.Group>

        <Button type="submit" variant="primary" className="w-100 mb-3">
          Sign In
        </Button>

        <div className="text-center">
          <Button
            variant="link"
            className="text-decoration-none p-0"
            onClick={onForgotPassword}
          >
            Forgot your password?
          </Button>
        </div>
      </Form>

      <hr />

      <div className="text-center">
        <p className="mb-0">
          Don't have an account?{" "}
          <Button
            variant="link"
            className="text-decoration-none p-0"
            onClick={onSwitchToSignup}
          >
            Sign up
          </Button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
