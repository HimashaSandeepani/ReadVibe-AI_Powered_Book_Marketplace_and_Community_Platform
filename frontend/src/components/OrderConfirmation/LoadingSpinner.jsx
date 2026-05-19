// Order confirmation loading indicator.
import React from "react";

const LoadingSpinner = ({ message = "Loading order confirmation..." }) => {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>{message}</p>
    </div>
  );
};

export default LoadingSpinner;
