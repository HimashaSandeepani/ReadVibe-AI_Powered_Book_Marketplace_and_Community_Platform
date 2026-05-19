// Login and signup page with authentication entry flows.
import { useState, useEffect, useMemo } from "react";
import { Container, Card, Row, Col } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { getCurrentUser } from "../utils/auth";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/slices/authSlice";

// Import Components
import LoginForm from "../components/Login/LoginForm";
import SignupForm from "../components/Login/SignupForm";
import TermsModal from "../components/Login/TermsModal";
import ForgotPasswordModal from "../components/Login/ForgotPasswordModal";
import DemoUsers from "../components/Login/DemoUsers";

// Import Utilities
import {
  initializeDemoUsers,
  validateLoginForm,
  validateSignupForm,
  registerUserApi,
  loginUserApi,
  removePasswordFromUser,
  generateResetCode,
  saveResetCode,
  validateResetCode,
  updateUserPassword,
  redirectBasedOnRole,
} from "../components/Login/utils";

import "../styles/pages/Login.css";

// Detects whether the login page should open in signup mode.
const isSignupQuery = (searchParams) => {
  const urlParams = new URLSearchParams(searchParams);
  return urlParams.get("signup") === "true";
};

// Login page component.
const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isSignupMode = useMemo(
    () => isSignupQuery(location.search),
    [location.search],
  );

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
    receiveRecommendations: true,
  });
  const [formErrors, setFormErrors] = useState({});
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  // Syncs the page mode with the URL query string.
  const updateFormModeQuery = (mode) => {
    const params = new URLSearchParams(location.search);
    if (mode === "signup") {
      params.set("signup", "true");
    } else {
      params.delete("signup");
    }

    const searchString = params.toString();
    navigate(
      {
        pathname: location.pathname,
        search: searchString ? `?${searchString}` : "",
      },
      { replace: true },
    );
  };

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      redirectBasedOnRole(user, navigate);
    }

    initializeDemoUsers();
  }, [navigate]);

  // Handles the login form submission.
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const errors = validateLoginForm(loginData);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});

    try {
      const user = await loginUserApi({
        identifier: loginData.username,
        password: loginData.password,
      });

      const userWithoutPassword = removePasswordFromUser(user);

      if (loginData.rememberMe) {
        localStorage.setItem("rememberUser", "true");
      }

      dispatch(loginSuccess(userWithoutPassword));
      redirectBasedOnRole(userWithoutPassword, navigate);
    } catch (err) {
      setFormErrors({ general: err.message || "Invalid username or password" });
    }
  };

  // Handles the signup form submission.
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    const errors = validateSignupForm(signupData);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});

    try {
      const user = await registerUserApi({
        name: signupData.name,
        email: signupData.email,
        username: signupData.username,
        password: signupData.password,
      });

      const userWithoutPassword = removePasswordFromUser(user);
      dispatch(loginSuccess(userWithoutPassword));

      navigate("/", { state: { welcome: true } });
    } catch (err) {
      setFormErrors({ general: err.message || "Signup failed" });
    }
  };

  // Handles the password reset flow.
  const handleForgotPasswordSubmit = (data) => {
    const {
      step,
      email,
      resetCode,
      newPassword,
      confirmNewPassword,
      onSuccess,
      onError,
    } = data;

    if (step === 1) {
      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        onError("Please enter a valid email address");
        return;
      }

      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const userExists = users.some((user) => user.email === email);

      if (!userExists) {
        onError("No account found with this email address");
        return;
      }

      const code = generateResetCode();
      saveResetCode(email, code);

      onSuccess(`Reset code has been sent to ${email}. Use code: ${code}`);
    } else if (step === 2) {
      if (!validateResetCode(email, resetCode)) {
        onError("Invalid reset code. Please try again.");
        return;
      }

      onSuccess("Code verified! Please enter your new password.");
    } else if (step === 3) {
      if (!newPassword) {
        onError("Please enter a new password");
        return;
      }

      if (newPassword.length < 8) {
        onError("Password must be at least 8 characters");
        return;
      }

      if (newPassword !== confirmNewPassword) {
        onError("Passwords do not match");
        return;
      }

      if (updateUserPassword(email, newPassword)) {
        onSuccess(
          "Password reset successful! You can now login with your new password.",
        );
      } else {
        onError("User not found");
      }
    }
  };

  const handleLoginInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSignupInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSignupData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const showSignupForm = () => {
    setFormErrors({});
    updateFormModeQuery("signup");
  };

  const showLoginForm = () => {
    setFormErrors({});
    updateFormModeQuery("login");
  };

  return (
    <div className="login-page">
      <TermsModal
        show={showTermsModal}
        onHide={() => setShowTermsModal(false)}
        onAgree={() => {
          setSignupData((prev) => ({ ...prev, agreeTerms: true }));
          setShowTermsModal(false);
        }}
      />

      <ForgotPasswordModal
        show={showForgotPasswordModal}
        onHide={() => setShowForgotPasswordModal(false)}
        onSubmit={handleForgotPasswordSubmit}
      />

      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="form-container shadow-sm">
              <Card.Body className="p-4">
                {isSignupMode ? (
                  <SignupForm
                    signupData={signupData}
                    formErrors={formErrors}
                    onInputChange={handleSignupInputChange}
                    onSubmit={handleSignupSubmit}
                    onShowTerms={() => setShowTermsModal(true)}
                    onSwitchToLogin={showLoginForm}
                  />
                ) : (
                  <LoginForm
                    loginData={loginData}
                    formErrors={formErrors}
                    onInputChange={handleLoginInputChange}
                    onSubmit={handleLoginSubmit}
                    onForgotPassword={() => setShowForgotPasswordModal(true)}
                    onSwitchToSignup={showSignupForm}
                  />
                )}
              </Card.Body>
            </Card>

            {import.meta.env.DEV && <DemoUsers />}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
