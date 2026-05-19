// Shared progress step indicator used across flows.
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { Row } from "react-bootstrap";

// Default step sequence shared by checkout and delivery flows.
const defaultSteps = [
  { number: 1, label: "Delivery" },
  { number: 2, label: "Payment" },
  { number: 3, label: "Confirmation" },
];

// Styling presets for the reusable progress step indicator.
const variantConfig = {
  default: {
    containerClass: "checkout-steps",
    stepIndicatorClass: "step-indicator",
    circleClass: "step-circle",
    labelClass: "step-label",
    connectorClass: "step-connector",
    progressBarClass: "progress-bar",
    connectorFill: "full",
    showCheck: true,
    wrapperClass: "d-flex justify-content-between align-items-center",
  },
  delivery: {
    containerClass: "delivery-progress",
    stepClass: "delivery-step",
    circleClass: "delivery-step-circle",
    labelClass: "delivery-step-label",
    connectorFill: "none",
    showCheck: false,
    wrapperClass: "text-center",
  },
};

// Shared progress step indicator used across checkout and delivery screens.
const ProgressSteps = ({
  currentStep = 1,
  steps = defaultSteps,
  variant = "default",
  connectorFill,
}) => {
  const config = variantConfig[variant] || variantConfig.default;
  const fillMode = connectorFill || config.connectorFill || "full";

  // Renders the simplified delivery-specific progress layout.
  if (variant === "delivery") {
    return (
      <div className={config.containerClass}>
        <Row className={config.wrapperClass}>
          {steps.map((step) => (
            <div className="col" key={step.number}>
              <div
                className={`${config.stepClass} ${
                  currentStep >= step.number ? "active" : ""
                }`}
              >
                <div className={config.circleClass}>{step.number}</div>
                <div className={config.labelClass}>{step.label}</div>
              </div>
            </div>
          ))}
        </Row>
      </div>
    );
  }

  const computedSteps = steps.map((step) => ({
    ...step,
    completed: step.number < currentStep,
    active: step.number === currentStep,
  }));

  // Converts completion state into a connector fill width.
  const progressWidth = (completed) => {
    if (!completed) return "0%";
    if (fillMode === "half") return "50%";
    return "100%";
  };

  return (
    <div className={config.containerClass}>
      <div className={config.wrapperClass}>
        {computedSteps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className={config.stepIndicatorClass}>
              <div
                className={`${config.circleClass} ${
                  step.completed ? "completed" : ""
                } ${step.active ? "active" : ""}`}
              >
                {config.showCheck && step.completed ? (
                  <FontAwesomeIcon icon={faCheck} />
                ) : (
                  step.number
                )}
              </div>
              <div className={config.labelClass}>{step.label}</div>
            </div>
            {index < computedSteps.length - 1 && config.connectorClass && (
              <div className={config.connectorClass}>
                <div
                  className={config.progressBarClass}
                  style={{ width: progressWidth(step.completed) }}
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
