// Cart loading indicator.
import React from "react";

// Loading indicator shown while cart data is being prepared.
const LoadingSpinner = () => {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading cart...</p>
    </div>
  );
};

export default LoadingSpinner;
