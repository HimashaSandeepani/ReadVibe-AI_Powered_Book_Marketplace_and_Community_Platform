// Wishlist filtering and sorting controls.
import React from "react";
import { Card, Button, Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faList,
  faCheckCircle,
  faExclamationTriangle,
  faFilter,
  faStar,
  faClock,
  faSortAmountDown,
  faSortAmountUp,
  faBook,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

const FiltersBar = ({
  currentFilter,
  onFilterChange,
  sortOrder,
  onSortChange,
  onAddBook,
}) => {
  const sortLabels = {
    "price-low": "Price: Low to High",
    "price-high": "Price: High to Low",
    priority: "Priority",
    recent: "Recent",
    title: "Title",
  };

  return (
    <Card className="filters-card mb-4">
      <Card.Body>
        <div className="row align-items-center">
          <div className="col-md-6 mb-3 mb-md-0">
            <div className="d-flex flex-wrap gap-2">
              <Button
                variant={
                  currentFilter === "all" ? "primary" : "outline-primary"
                }
                size="sm"
                onClick={() => onFilterChange("all")}
              >
                <FontAwesomeIcon icon={faList} className="me-2" />
                All Books
              </Button>
              <Button
                variant={
                  currentFilter === "available" ? "primary" : "outline-primary"
                }
                size="sm"
                onClick={() => onFilterChange("available")}
              >
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="me-2 text-success"
                />
                In Stock
              </Button>
              <Button
                variant={
                  currentFilter === "unavailable"
                    ? "primary"
                    : "outline-primary"
                }
                size="sm"
                onClick={() => onFilterChange("unavailable")}
              >
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  className="me-2 text-danger"
                />
                Out of Stock
              </Button>
            </div>
          </div>
          <div className="col-md-6">
            <div className="d-flex justify-content-md-end gap-2">
              <Dropdown>
                <Dropdown.Toggle
                  variant="outline-secondary"
                  size="sm"
                  id="sort-dropdown"
                >
                  <FontAwesomeIcon icon={faFilter} className="me-2" />
                  Sort by: {sortLabels[sortOrder]}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => onSortChange("priority")}>
                    <FontAwesomeIcon
                      icon={faStar}
                      className="me-2 text-warning"
                    />
                    Priority (High to Low)
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => onSortChange("recent")}>
                    <FontAwesomeIcon icon={faClock} className="me-2" />
                    Recently Added
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => onSortChange("price-low")}>
                    <FontAwesomeIcon icon={faSortAmountDown} className="me-2" />
                    Price: Low to High
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => onSortChange("price-high")}>
                    <FontAwesomeIcon icon={faSortAmountUp} className="me-2" />
                    Price: High to Low
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => onSortChange("title")}>
                    <FontAwesomeIcon icon={faBook} className="me-2" />
                    Title A-Z
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <Button variant="success" size="sm" onClick={onAddBook}>
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Add Book
              </Button>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default FiltersBar;
