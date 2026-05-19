// Marketplace empty state shown when no books match.
import React from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";

// Renders the marketplace empty state when no books match.
const EmptyState = ({ resetFilters }) => {
  return (
    <div className="text-center py-5">
      <FontAwesomeIcon
        icon={faBook}
        size="3x"
        className="mb-3"
        style={{ color: "#ccc" }}
      />
      <h4>No books found</h4>
      <p className="text-muted">Try adjusting your filters or search query</p>
      <Button variant="outline-primary" onClick={resetFilters} className="mt-2">
        Clear All Filters
      </Button>
    </div>
  );
};

export default EmptyState;
