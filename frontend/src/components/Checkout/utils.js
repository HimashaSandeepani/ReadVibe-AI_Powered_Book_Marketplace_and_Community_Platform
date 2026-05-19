// Checkout utility functions for payment validation, delivery dates, and storage cleanup.

// Formats LKR values for checkout displays.
export const formatPrice = (price) => {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

// Normalizes card number spacing for display.
export const formatCardNumber = (value) => {
  const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
  const matches = v.match(/\d{4,16}/g);
  const match = (matches && matches[0]) || "";
  const parts = [];

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }

  if (parts.length) {
    return parts.join(" ");
  } else {
    return value;
  }
};

// Form validation
// Validates payment form fields and returns field-level errors.
export const validatePaymentForm = (paymentData) => {
  const errors = {};

  // Card number validation
  if (!paymentData.cardNumber.trim()) {
    errors.cardNumber = "Card number is required";
  } else if (paymentData.cardNumber.replace(/\s/g, "").length < 16) {
    errors.cardNumber = "Please enter a valid 16-digit card number";
  }

  // Expiration date validation
  if (!paymentData.expDate.trim()) {
    errors.expDate = "Expiration date is required";
  } else if (!/^\d{2}\/\d{2}$/.test(paymentData.expDate)) {
    errors.expDate = "Please enter expiration date in MM/YY format";
  }

  // CVV validation
  if (!paymentData.cvv.trim()) {
    errors.cvv = "CVV is required";
  } else if (!/^\d{3,4}$/.test(paymentData.cvv)) {
    errors.cvv = "Please enter a valid 3-4 digit CVV";
  }

  // Cardholder name validation
  if (!paymentData.cardholderName.trim()) {
    errors.cardholderName = "Cardholder name is required";
  }

  return errors;
};

// Calculate estimated delivery
// Calculates the estimated delivery timestamp for the selected shipping method.
export const calculateEstimatedDelivery = (shippingMethod) => {
  const now = new Date();
  let daysToAdd;

  switch (shippingMethod) {
    case "express":
      daysToAdd = 3;
      break;
    case "priority":
      daysToAdd = 1;
      break;
    case "standard":
    default:
      daysToAdd = 7;
  }

  const deliveryDate = new Date(now);
  deliveryDate.setDate(now.getDate() + daysToAdd);
  return deliveryDate.toISOString();
};

// Simulate payment processing
// Simulates a checkout payment response for demo flows.
export const processPayment = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate 90% success rate for demo
      if (Math.random() < 0.9) {
        resolve({
          success: true,
          transactionId:
            "TXN_" + Date.now() + Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString(),
        });
      } else {
        reject(
          new Error("Payment declined. Please check your card details.")
        );
      }
    }, 1500);
  });
};

// Builds the storage key for a saved payment confirmation.
export const getOrderPaymentConfirmationKey = (orderId) =>
  orderId ? `orderPaymentConfirmation_${orderId}` : "orderPaymentConfirmation_latest";

// Saves the payment confirmation to local and session storage.
// Persists a payment confirmation in both local and session storage.
export const saveOrderPaymentConfirmation = (confirmation) => {
  const orderId = confirmation?.orderId;
  const key = getOrderPaymentConfirmationKey(orderId);
  const serialized = JSON.stringify(confirmation);

  localStorage.setItem(key, serialized);
  sessionStorage.setItem(key, serialized);
};

// Clear checkout data from storage
// Removes checkout-related session storage entries.
export const clearCheckoutData = () => {
  sessionStorage.removeItem("deliveryData");
  sessionStorage.removeItem("checkoutCart");
  sessionStorage.removeItem("orderSummary");
};