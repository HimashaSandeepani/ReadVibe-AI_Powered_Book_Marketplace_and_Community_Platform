// Shipping method selector for delivery options.
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShippingFast,
  faClock,
  faTruck,
  faRocket,
} from "@fortawesome/free-solid-svg-icons";
import { formatPriceLKR } from "./utils";

// Shipping method selector component for choosing a delivery option.
const ShippingMethodSection = ({ shippingMethod, setShippingMethod }) => {
  // Available delivery options rendered in the selector.
  const shippingMethodsArray = [
    {
      id: "standard",
      title: "Standard Shipping",
      description:
        "Economical shipping for standard delivery. Tracking available.",
      days: "5-7 business days",
      price: 500.0,
      icon: faTruck,
    },
    {
      id: "express",
      title: "Express Shipping",
      description:
        "Priority shipping with expedited delivery. Includes tracking and insurance.",
      days: "2-3 business days",
      price: 1200.0,
      icon: faShippingFast,
    },
    {
      id: "overnight",
      title: "Overnight Shipping",
      description:
        "Guaranteed overnight delivery. Includes premium tracking and full insurance.",
      days: "Next business day",
      price: 2500.0,
      icon: faRocket,
    },
  ];

  // Returns the icon element for the selected shipping method.
  const getIconComponent = (icon) => {
    return <FontAwesomeIcon icon={icon} className="me-2" />;
  };

  return (
    <div className="delivery-section">
      <h5>
        <FontAwesomeIcon icon={faShippingFast} className="me-2" />
        Shipping Method
      </h5>
      <p className="text-muted mb-3">Choose your preferred shipping option</p>

      <div className="shipping-methods">
        {shippingMethodsArray.map((method) => (
          <div
            key={method.id}
            className={`shipping-method-card ${
              shippingMethod === method.id ? "selected" : ""
            }`}
            onClick={() => setShippingMethod(method.id)}
          >
            <div className="form-check mb-0">
              <input
                className="form-check-input"
                type="radio"
                name="shippingMethod"
                value={method.id}
                id={method.id}
                checked={shippingMethod === method.id}
                onChange={() => setShippingMethod(method.id)}
              />
              <label className="form-check-label w-100" htmlFor={method.id}>
                <div className="shipping-method-header">
                  <div>
                    <div className="shipping-method-title">
                      {getIconComponent(method.icon)}
                      {method.title}
                    </div>
                    <div className="delivery-time-estimate">
                      <FontAwesomeIcon icon={faClock} className="me-1" />
                      {method.days}
                    </div>
                  </div>
                  <div className="shipping-method-price">
                    {formatPriceLKR(method.price)}
                  </div>
                </div>
                <div className="shipping-method-details">
                  {method.description}
                </div>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShippingMethodSection;
