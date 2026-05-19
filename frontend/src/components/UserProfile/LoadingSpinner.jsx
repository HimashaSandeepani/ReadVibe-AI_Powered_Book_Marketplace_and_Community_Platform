// User profile loading indicator.
import React from "react";

const LoadingSpinner = ({ message = "Loading profile..." }) => {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>{message}</p>
    </div>
  );
};

export default LoadingSpinner;
