// Delivery details loading indicator.
import React from "react";

// Delivery details loading indicator shown while checkout data loads.
const LoadingSpinner = () => {
  return (
    <div className="delivery-loading">
      <div className="delivery-loading-spinner"></div>
      <div className="delivery-loading-text">
        Processing your delivery information...
      </div>
    </div>
  );
};

export default LoadingSpinner;
