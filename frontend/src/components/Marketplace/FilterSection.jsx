// Marketplace filter controls for narrowing book results.
import React from "react";
import { Card, Row, Col, Form, Button, Badge } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const FilterSection = ({
  isFilterCollapsed,
  setIsFilterCollapsed,
  filters,
  handleFilterChange,
  categories,
  changeRating,
  resetFilters,
  handleApplyFilters,
  filteredBooks,
}) => {
  if (!isFilterCollapsed) return null;

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Filter Books</h5>
          <Button
            variant="link"
            className="text-decoration-none p-0"
            onClick={() => setIsFilterCollapsed(false)}
          >
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        </div>

        <Row>
          <Col md={3}>
            <div className="filter-group mb-3">
              <Form.Label className="fw-medium">Category</Form.Label>
              <Form.Select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                size="sm"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Form.Select>
            </div>
          </Col>

          <Col md={3}>
            <div className="filter-group mb-3">
              <Form.Label className="fw-medium">Price Range (LKR)</Form.Label>
              <div className="price-input-group">
                <div className="price-input-wrapper">
                  <span className="price-label">Min</span>
                  <Form.Control
                    type="number"
                    className="price-input"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    min="0"
                    max="100000"
                    size="sm"
                  />
                </div>
                <span className="price-divider">-</span>
                <div className="price-input-wrapper">
                  <span className="price-label">Max</span>
                  <Form.Control
                    type="number"
                    className="price-input"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    min="0"
                    max="100000"
                    size="sm"
                  />
                </div>
              </div>
              {parseInt(filters.minPrice) > parseInt(filters.maxPrice) && (
                <div className="price-range-error">
                  Minimum price cannot be greater than maximum price
                </div>
              )}
            </div>
          </Col>

          <Col md={3}>
            <div className="filter-group mb-3">
              <Form.Label className="fw-medium">Minimum Rating</Form.Label>
              <div className="d-flex align-items-center">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => changeRating(-1)}
                  className="px-3"
                >
                  -
                </Button>
                <div className="text-center mx-3">
                  <div className="fs-5 fw-bold">
                    {filters.minRating.toFixed(1)}
                  </div>
                  <div className="text-muted small">stars</div>
                </div>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => changeRating(1)}
                  className="px-3"
                >
                  +
                </Button>
              </div>
            </div>

            <div className="filter-group mb-3">
              <Form.Label className="fw-medium">Minimum Reviews</Form.Label>
              <Form.Control
                type="number"
                name="minReviews"
                value={filters.minReviews}
                onChange={handleFilterChange}
                min="0"
                step="1"
                size="sm"
                placeholder="e.g. 20"
              />
              <Form.Text className="text-muted">
                Show only books with at least this many reviews.
              </Form.Text>
            </div>
          </Col>

          <Col md={3}>
            <div className="filter-group mb-3">
              <Form.Label className="fw-medium">Availability</Form.Label>
              <div className="d-flex flex-column">
                <Form.Check
                  type="checkbox"
                  id="inStockFilter"
                  label="In Stock Only"
                  name="inStock"
                  checked={filters.inStock}
                  onChange={handleFilterChange}
                  className="mb-2"
                />
                <Form.Check
                  type="checkbox"
                  id="preOrderFilter"
                  label="Include Pre-orders"
                  name="preOrder"
                  checked={filters.preOrder}
                  onChange={handleFilterChange}
                />
              </div>
            </div>
          </Col>
        </Row>

        <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
          <div className="text-muted small">
            {filteredBooks.length} books match your filters
          </div>
          <div className="d-flex gap-2">
            <Button
              variant="outline-secondary"
              onClick={resetFilters}
              size="sm"
            >
              Reset All
            </Button>
            <Button variant="primary" onClick={handleApplyFilters} size="sm">
              Apply Filters
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default FilterSection;
