// Marketplace search input for finding books quickly.
import React from "react";
import { Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faFilter } from "@fortawesome/free-solid-svg-icons";

// Renders the marketplace search bar and filter toggle button.
const SearchBar = ({
  searchQuery,
  handleSearch,
  isFilterCollapsed,
  setIsFilterCollapsed,
}) => {
  return (
    <div className="d-flex">
      <div className="search-box me-2 position-relative">
        <FontAwesomeIcon
          icon={faSearch}
          className="search-icon position-absolute top-50 translate-middle-y ms-3"
        />
        <Form.Control
          type="text"
          className="search-input ps-5"
          placeholder="Search books, authors..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      <Button
        variant={isFilterCollapsed ? "primary" : "outline-primary"}
        onClick={() => setIsFilterCollapsed(!isFilterCollapsed)}
      >
        <FontAwesomeIcon icon={faFilter} className="me-1" />
        Filters {isFilterCollapsed && <span className="ms-1">✓</span>}
      </Button>
    </div>
  );
};

export default SearchBar;
