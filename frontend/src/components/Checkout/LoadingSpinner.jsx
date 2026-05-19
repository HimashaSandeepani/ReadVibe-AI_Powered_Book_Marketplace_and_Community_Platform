// Checkout loading indicator.
import React from "react";

// Loading indicator displayed while checkout data is prepared.
const LoadingSpinner = ({ message = "Loading checkout data..." }) => {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>{message}</p>
    </div>
  );
};

export default LoadingSpinner;
