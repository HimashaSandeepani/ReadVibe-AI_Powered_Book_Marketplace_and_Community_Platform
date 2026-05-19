// Stock manager inventory tab.
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxOpen,
  faPlus,
  faExclamationTriangle,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import StatsCard from "../Common/StatsCard";
import BooksTable from "../Tables/BooksTable";

// Renders the inventory management tab with search and stock alerts.
const InventoryTab = ({
  stats,
  books,
  searchQuery,
  onSearchChange,
  onSort,
  sortConfig,
  onAddBook,
  onEditBook,
  onDeleteBook,
  onRestockBook,
  onToggleFeatured,
}) => {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Inventory Management</h2>
        <div className="d-flex gap-2">
          <div className="search-box">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
              <span className="input-group-text bg-white">
                <FontAwesomeIcon icon={faSearch} className="text-muted" />
              </span>
            </div>
          </div>
          <button className="btn btn-primary" onClick={onAddBook}>
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Add Book
          </button>
        </div>
      </div>

      {/* Low Stock Alerts */}
      {stats.lowStockItems > 0 && (
        <div className="alert alert-warning mb-4">
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
          <strong>Low Stock Alert:</strong> {stats.lowStockItems} books are
          running low on inventory.
        </div>
      )}

      {/* Inventory Stats */}
      <div className="row mb-4">
        <div className="col-md-3 col-sm-6 mb-3">
          <StatsCard number={stats.totalBooks} label="Total Books" />
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <StatsCard
            number={stats.inStockBooks}
            label="In Stock"
            variant="success"
          />
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <StatsCard
            number={stats.lowStockBooks}
            label="Low Stock"
            variant="warning"
          />
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <StatsCard
            number={stats.outOfStockBooks}
            label="Out of Stock"
            variant="danger"
          />
        </div>
      </div>

      <div className="stock-manager-dashboard-card">
        {books.length === 0 ? (
          <div className="text-center py-5">
            <FontAwesomeIcon
              icon={faBoxOpen}
              className="fa-3x text-muted mb-3"
            />
            <p>No books found</p>
            <button className="btn btn-primary mt-2" onClick={onAddBook}>
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              Add Your First Book
            </button>
          </div>
        ) : (
          <BooksTable
            books={books}
            sortConfig={sortConfig}
            onSort={onSort}
            onEdit={onEditBook}
            onDelete={onDeleteBook}
            onRestock={onRestockBook}
            onToggleFeatured={onToggleFeatured}
          />
        )}
      </div>
    </>
  );
};

export default InventoryTab;
