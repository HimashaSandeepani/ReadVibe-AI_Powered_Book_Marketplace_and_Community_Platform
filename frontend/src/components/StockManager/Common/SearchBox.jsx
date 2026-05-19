// Shared stock manager search box.
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const SearchBox = ({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}) => {
  return (
    <div className={`search-box position-relative ${className}`}>
      <input
        type="text"
        className="form-control pe-5"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <FontAwesomeIcon
        icon={faSearch}
        className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted search-icon"
      />
    </div>
  );
};

export default SearchBox;
