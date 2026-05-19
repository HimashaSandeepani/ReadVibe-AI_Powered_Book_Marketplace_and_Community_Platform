// Delivery details utility functions for address validation, shipping, and order summary.
// Price formatting
// Formats LKR values for delivery screens.
export const formatPriceLKR = (price) => {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

// Country options used in the address form.
export const countries = [
  { value: "", label: "Select Country" },
  { value: "LK", label: "Sri Lanka" },
  { value: "US", label: "United States" },
  { value: "CA", label: "Canada" },
  { value: "UK", label: "United Kingdom" },
  { value: "AU", label: "Australia" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
  { value: "JP", label: "Japan" },
  { value: "IN", label: "India" },
  { value: "AE", label: "United Arab Emirates" },
  { value: "SG", label: "Singapore" },
  { value: "MY", label: "Malaysia" },
];

// Shipping method definitions used by the delivery wizard.
export const shippingMethods = {
  standard: {
    id: "standard",
    title: "Standard Shipping",
    description:
      "Economical shipping for standard delivery. Tracking available.",
    days: "5-7 business days",
    price: 500.0,
  },
  express: {
    id: "express",
    title: "Express Shipping",
    description:
      "Priority shipping with expedited delivery. Includes tracking and insurance.",
    days: "2-3 business days",
    price: 1200.0,
  },
  overnight: {
    id: "overnight",
    title: "Overnight Shipping",
    description:
      "Guaranteed overnight delivery. Includes premium tracking and full insurance.",
    days: "Next business day",
    price: 2500.0,
  },
};

// Form validation
// Validates common delivery form fields.
export const validateField = (fieldName, value) => {
  switch (fieldName) {
    case "email":
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    case "phone":
      return (
        /^[\d\s\-()+]+$/.test(value) &&
        value.replace(/\D/g, "").length >= 7
      );
    case "zipCode":
      return (
        /^\d{4,6}(-\d{4})?$/.test(value) ||
        /^[A-Z0-9]{3,10}$/.test(value.toUpperCase())
      );
    default:
      return value.trim() !== "";
  }
};

// Calculate order summary
// Calculates subtotal, shipping, tax, and total for delivery checkout.
export const calculateOrderSummary = (cartItems, shippingPrice = 500) => {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const tax = subtotal * 0.05; // 5% VAT
  const total = subtotal + shippingPrice + tax;

  return {
    subtotal,
    shipping: shippingPrice,
    tax,
    total,
    itemCount,
  };
};

// Get country name from code
// Resolves a country label from its stored code.
export const getCountryName = (countryCode) => {
  const country = countries.find((c) => c.value === countryCode);
  return country ? country.label : "";
};

// Generate address preview HTML
// Renders a small HTML preview of the entered address.
export const generateAddressPreview = (formData, countriesList) => {
  const { firstName, lastName, address, city, state, zipCode, country } = formData;
  if (firstName || lastName || address || city || state || zipCode) {
    const selectedCountry = countriesList.find((c) => c.value === country);
    const countryName = selectedCountry ? selectedCountry.label : "";

    return `
      ${firstName} ${lastName}<br/>
      ${address}<br/>
      ${city}, ${state} ${zipCode}<br/>
      ${countryName}
    `;
  }
  return "Enter your address details to see preview";
};