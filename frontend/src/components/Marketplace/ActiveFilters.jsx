// Marketplace controls that display and clear active filters.
import React from "react";
import { Badge } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const ActiveFilters = ({
  filters,
  setFilters,
  searchQuery,
  setSearchQuery,
}) => {
  const hasActiveFilters =
    filters.category !== "all" ||
    searchQuery ||
    filters.minPrice > 0 ||
    filters.maxPrice < 10000;

  if (!hasActiveFilters) return null;

  return (
    <div className="mb-3">
      <div className="d-flex flex-wrap align-items-center gap-2">
        <small className="text-muted me-2">Active filters:</small>
        {filters.category !== "all" && (
          <Badge bg="primary" className="d-flex align-items-center">
            Category: {filters.category}
            <FontAwesomeIcon
              icon={faTimes}
              className="ms-2 cursor-pointer"
              onClick={() =>
                setFilters((prev) => ({ ...prev, category: "all" }))
              }
            />
          </Badge>
        )}
        {searchQuery && (
          <Badge bg="info" className="d-flex align-items-center">
            Search: "{searchQuery}"
            <FontAwesomeIcon
              icon={faTimes}
              className="ms-2 cursor-pointer"
              onClick={() => setSearchQuery("")}
            />
          </Badge>
        )}
        {(filters.minPrice > 0 || filters.maxPrice < 10000) && (
          <Badge bg="warning" className="d-flex align-items-center" text="dark">
            Price: LKR {filters.minPrice} - {filters.maxPrice}
            <FontAwesomeIcon
              icon={faTimes}
              className="ms-2 cursor-pointer"
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  minPrice: 0,
                  maxPrice: 10000,
                }))
              }
            />
          </Badge>
        )}
      </div>
    </div>
  );
};

export default ActiveFilters;
