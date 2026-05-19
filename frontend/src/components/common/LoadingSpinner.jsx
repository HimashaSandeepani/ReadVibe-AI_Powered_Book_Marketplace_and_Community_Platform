// Shared loading spinner for asynchronous UI states.
import React from "react";

const LoadingSpinner = ({
  message = "Loading...",
  containerClassName = "loading-container",
  spinnerClassName = "loading-spinner",
  textClassName = "",
  textTag = "p",
}) => {
  const TextTag = textTag;

  return (
    <div className={containerClassName}>
      <div className={spinnerClassName}></div>
      {message ? (
        <TextTag className={textClassName || undefined}>{message}</TextTag>
      ) : null}
    </div>
  );
};

export default LoadingSpinner;
