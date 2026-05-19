// Shared stock manager stats card.
import React from "react";

// Renders a summary metric card for stock manager dashboards.
const StatsCard = ({ number, label, className = "", variant = "" }) => {
  const variantClass = variant ? `stats-card-${variant}` : "";

  return (
    <div className={`stats-card ${variantClass} ${className}`}>
      <div className="stats-number">{number}</div>
      <div className="stats-label">{label}</div>
    </div>
  );
};

export default StatsCard;
