// Checkout page that handles delivery, payment, and order submission.
import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getCurrentUser } from "../utils/auth";
import { isPrivilegedUser } from "../utils/auth";
import { showNotification } from "../utils/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";

// Import Components
import LoadingSpinner from "../components/common/LoadingSpinner";
import ProgressSteps from "../components/common/ProgressSteps";
import PaymentForm from "../components/Checkout/PaymentForm";
import OrderSummary from "../components/Checkout/OrderSummary";
import CheckoutButtons from "../components/Checkout/CheckoutButtons";

// Import Utilities
import {
  validatePaymentForm,
  processPayment,
  clearCheckoutData,
  saveOrderPaymentConfirmation,
} from "../components/Checkout/utils";
import { clearCart } from "../store/slices/cartSlice";
import { getOrderApi } from "../utils/orderApi";

import "../styles/pages/Checkout.css";

// Safely parses JSON stored in session storage.
const safeParseJSON = (value) => {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

// Builds the checkout order data from saved session state.
const buildOrderData = () => {
  const deliveryData = safeParseJSON(sessionStorage.getItem("deliveryData"));
  const checkoutCart = safeParseJSON(sessionStorage.getItem("checkoutCart")) || [];

  if (!deliveryData || checkoutCart.length === 0) {
    return null;
  }

  const totals =
    deliveryData.serverTotals ||
    deliveryData.orderSummary ||
    { subtotal: 0, shipping: 0, tax: 0, total: 0 };

  return {
    items: checkoutCart,
    shipping: deliveryData.shipping || {},
    totals,
    orderId: deliveryData.orderId,
  };
};

// Checkout page component.
const Checkout = () => {
  const dispatch = useDispatch();
  const [user, setUser] = useState(() => getCurrentUser());
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expDate: "",
    cvv: "",
    cardholderName: "",
    sameAsShipping: true,
  });
  const [orderData, setOrderData] = useState(() => buildOrderData());
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      return;
    }

    showNotification("Please login to complete checkout", "warning");
    navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    if (!user || !isPrivilegedUser()) {
      return;
    }

    showNotification(
      "Admin and stock manager accounts cannot complete checkout.",
      "warning",
    );
    navigate("/");
  }, [user, navigate]);

  useEffect(() => {
    if (!user || orderData) {
      return;
    }

    showNotification(
      "No order data found. Please start checkout from cart.",
      "warning",
    );

    const timeoutId = setTimeout(() => {
      navigate("/cart");
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [orderData, user, navigate]);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "currentUser") {
        setUser(getCurrentUser());
      }

      if (event.key === "deliveryData" || event.key === "checkoutCart") {
        setOrderData(buildOrderData());
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!user || !orderData?.orderId) return;
      try {
        const order = await getOrderApi(user.id, orderData.orderId);
        if (order) {
          setOrderData({
            items: order.items?.map((item) => ({
              id: item.bookId,
              title: item.title,
              quantity: item.quantity,
              price: item.unitPrice,
              image: item.image,
            })) || [],
            shipping: order.shippingAddress || orderData.shipping,
            totals: {
              subtotal: order.subtotal,
              shipping: order.shippingCost,
              tax: order.tax,
              total: order.total,
            },
            orderId: order.id,
          });
        }
      } catch (err) {
        console.error("Failed to fetch order", err);
      }
    };

    fetchOrder();
  }, [user, orderData?.orderId, orderData?.shipping]);

  // Updates payment form state for the checkout page.
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPaymentData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handles card number input changes.
  const handleCardNumberChange = (e) => {
    handleInputChange(e);
  };

  // Submits the payment form and finalizes the order.
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validatePaymentForm(paymentData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showNotification("Please fix the errors in the form", "danger");
      return;
    }

    setFormErrors({});
    setIsLoading(true);

    try {
      // Process payment (simulated)
      const paymentResult = await processPayment();

      saveOrderPaymentConfirmation({
        orderId: orderData?.orderId || null,
        method: "Credit Card",
        transactionId: paymentResult.transactionId,
        timestamp: paymentResult.timestamp,
      });

      // Clear cart state
      dispatch(clearCart());

      // Clear checkout data
      clearCheckoutData();

      // Show success notification
      showNotification("Payment successful! Order placed.", "success");

      // Redirect to confirmation page
      setTimeout(() => {
        const id = orderData?.orderId || "";
        navigate(`/order-confirmation${id ? `?orderId=${id}` : ""}`);
      }, 1500);
    } catch (error) {
      console.error("Checkout error:", error);
      showNotification(
        error.message || "Payment failed. Please try again.",
        "danger",
      );
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/delivery-details");
  };

  if (!orderData || !orderData.items.length) {
    return <LoadingSpinner message="Loading checkout data..." />;
  }

  return (
    <div className="checkout-page">
      <Container className="mt-4">
        <Row className="justify-content-center">
          <Col lg={12}>
            <Card className="form-container">
              <Card.Body>
                <h2 className="mb-4">
                  <FontAwesomeIcon icon={faBookOpen} className="me-2" />
                  Checkout
                </h2>

                <ProgressSteps currentStep={2} />

                {formErrors.general && (
                  <Alert variant="danger" className="mt-3">
                    {formErrors.general}
                  </Alert>
                )}

                <Row>
                  <Col lg={8}>
                    <PaymentForm
                      paymentData={paymentData}
                      formErrors={formErrors}
                      isLoading={isLoading}
                      onSubmit={handleSubmit}
                      handleCardNumberChange={handleCardNumberChange}
                      handleInputChange={handleInputChange}
                    />

                    <CheckoutButtons
                      onBack={handleBack}
                      onSubmit={handleSubmit}
                      isLoading={isLoading}
                    />
                  </Col>

                  <Col lg={4}>
                    <OrderSummary orderData={orderData} />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="checkout-loading">
          <div className="checkout-loading-spinner"></div>
          <div className="checkout-loading-text">Processing Payment...</div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
