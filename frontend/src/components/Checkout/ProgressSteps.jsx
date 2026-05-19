// Checkout progress indicator.
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

// Static checkout step definitions used by the progress indicator.
const baseSteps = [
  { number: 1, label: "Delivery" },
  { number: 2, label: "Payment" },
  { number: 3, label: "Confirmation" },
];

// Checkout progress tracker that highlights the current step.
const ProgressSteps = ({ currentStep = 2 }) => {
  const steps = baseSteps.map((step) => ({
    ...step,
    completed: step.number < currentStep,
    active: step.number === currentStep,
  }));

  return (
    <div className="checkout-steps">
      <div className="d-flex justify-content-between align-items-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="step-indicator">
              <div
                className={`step-circle ${step.completed ? "completed" : ""} ${step.active ? "active" : ""}`}
              >
                {step.completed ? (
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
                  style={{ width: step.completed ? "50%" : "0%" }}
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
