// Confirmation progress indicator.
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const ProgressSteps = ({ currentStep = 3 }) => {
  const steps = [
    { number: 1, label: "Delivery" },
    { number: 2, label: "Payment" },
    { number: 3, label: "Confirmation" },
  ];

  const isCompleted = (stepNumber) => stepNumber < currentStep;
  const isActive = (stepNumber) => stepNumber === currentStep;

  return (
    <div className="checkout-steps mb-5">
      <div className="d-flex justify-content-between align-items-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="step-indicator">
              <div
                className={`step-circle ${isCompleted(step.number) ? "completed" : ""} ${isActive(step.number) ? "active" : ""}`}
              >
                {isCompleted(step.number) ? (
                  <FontAwesomeIcon icon={faCheck} />
                ) : (
                  step.number
                )}
              </div>
              <div className="step-label">{step.label}</div>
            </div>
            {index < steps.length - 1 && (
              <div className="step-connector">
                <div
                  className="progress-bar"
                  style={{ width: isCompleted(step.number) ? "100%" : "0%" }}
                ></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProgressSteps;
