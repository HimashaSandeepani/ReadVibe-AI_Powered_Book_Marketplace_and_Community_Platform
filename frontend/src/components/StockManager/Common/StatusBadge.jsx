// Shared stock manager status badge.
import React from "react";

const StatusBadge = ({ status, type = "stock", className = "" }) => {
  const getStatusClass = () => {
    switch (type) {
      case "stock":
        return (
          {
            "In Stock": "badge bg-success",
            "Low Stock": "badge bg-warning text-dark",
            "Out of Stock": "badge bg-danger",
          }[status] || "badge bg-secondary"
        );
      case "order":
        return (
          {
            Processing: "badge bg-warning text-dark",
            Shipped: "badge bg-info text-dark",
            Delivered: "badge bg-success",
            "Out for Delivery": "badge bg-primary",
            Returned: "badge bg-dark",
          }[status] || "badge bg-secondary"
        );
      case "request":
        return (
          {
            Pending: "badge bg-warning text-dark",
            Approved: "badge bg-success",
            Rejected: "badge bg-danger",
            Fulfilled: "badge bg-info text-dark",
          }[status] || "badge bg-secondary"
        );
      case "publisher":
        return status === "Active" ? "badge bg-success" : "badge bg-secondary";
      default:
        return "badge bg-secondary";
    }
  };

  return <span className={`${getStatusClass()} ${className}`}>{status}</span>;
};

export default StatusBadge;
