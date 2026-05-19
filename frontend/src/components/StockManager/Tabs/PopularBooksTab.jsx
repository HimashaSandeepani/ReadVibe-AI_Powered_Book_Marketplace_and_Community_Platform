// Stock manager popular books tab.
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFire,
  faBoxes,
  faChartLine,
  faStar,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import StatsCard from "../Common/StatsCard";
import StatusBadge from "../Common/StatusBadge";
import ActionButtons from "../Common/ActionButtons";
import { formatCurrency, getStockStatusClass } from "../utils";

const PopularBooksTab = ({
  popularBooks,
  featuredBooks,
  inventoryStats,
  onRestockBook,
  onToggleFeatured,
  onChangeTab,
}) => {
  const monthlySales = popularBooks.reduce(
    (sum, book) => sum + (Number(book.salesThisMonth) || 0),
    0,
  );
  const totalSales = popularBooks.reduce(
    (sum, book) => sum + (Number(book.totalSales) || 0),
    0,
  );
  const monthlyRevenue = popularBooks.reduce(
    (sum, book) =>
      sum +
      (Number.isFinite(Number(book.monthlyRevenue))
        ? Number(book.monthlyRevenue)
        : (Number(book.price) || 0) * (Number(book.salesThisMonth) || 0)),
    0,
  );

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">
          <FontAwesomeIcon icon={faFire} className="me-2 text-danger" />
          Popular Books Management
        </h2>
        <button
          className="btn btn-primary"
          onClick={() => onChangeTab("inventory")}
        >
          <FontAwesomeIcon icon={faBoxes} className="me-2" />
          View All Inventory
        </button>
      </div>

      {/* Popular Books Stats */}
      <div className="row mb-4">
        <div className="col-md-3 col-sm-6 mb-3">
          <StatsCard number={monthlySales} label="Monthly Sales" />
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <StatsCard number={totalSales} label="Total Sales" />
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <StatsCard
            number={formatCurrency(monthlyRevenue)}
            label="Monthly Revenue"
          />
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <StatsCard
            number={inventoryStats.featuredBooks}
            label="Featured Books"
          />
        </div>
      </div>

      <div className="stock-manager-dashboard-card">
        <h5 className="d-flex align-items-center mb-4">
          <FontAwesomeIcon icon={faChartLine} className="text-primary me-2" />
          Top Selling Books - This Month
        </h5>
        <div className="table-responsive">
          <table className="table table-hover stock-manager-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Book Title</th>
                <th>Author</th>
                <th>Category</th>
                <th className="text-end">Monthly Sales</th>
                <th className="text-end">Total Sales</th>
                <th className="text-end">Price</th>
                <th className="text-end">Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {popularBooks.map((book, index) => (
                <tr key={book.id}>
                  <td>
                    <div className="rank-badge d-flex align-items-center">
                      <span
                        className={`rank-number rank-${book.rank || index + 1} fw-medium`}
                      >
                        #{book.rank || index + 1}
                      </span>
                      {(book.rank || index + 1) <= 3 && (
                        <FontAwesomeIcon
                          icon={faFire}
                          className={`ms-2 ${
                            (book.rank || index + 1) === 1
                              ? "text-danger"
                              : (book.rank || index + 1) === 2
                                ? "text-warning"
                                : "text-success"
                          }`}
                        />
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="fw-medium">{book.title}</div>
                    <small className="text-muted">ISBN: {book.isbn}</small>
                  </td>
                  <td>{book.author}</td>
                  <td>
                    <span className="badge bg-secondary">{book.category}</span>
                  </td>
                  <td className="text-end">
                    <div>
                      <div className="fw-medium text-primary">
                        {book.salesThisMonth}
                      </div>
                      <small className="text-muted">this month</small>
                    </div>
                  </td>
                  <td className="text-end">
                    <div className="fw-medium">{book.totalSales}</div>
                  </td>
                  <td className="text-end">
                    <div className="fw-medium">
                      {formatCurrency(book.price)}
                    </div>
                  </td>
                  <td className="text-end">
                    <div
                      className={`stock-indicator ${book.stock <= book.minStock ? "low-stock" : "in-stock"}`}
                    >
                      {book.stock}
                    </div>
                  </td>
                  <td>
                    <span className={getStockStatusClass(book.status)}>
                      {book.status}
                    </span>
                  </td>
                  <td>
                    <ActionButtons
                      // onEdit={() => onEditBook(book.id)}
                      onRestock={() => onRestockBook(book.id, 10)}
                      onToggleFeatured={() => onToggleFeatured(book.id)}
                      isFeatured={book.featured}
                      // showEdit={true}
                      showRestock={true}
                      showToggleFeatured={true}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Featured Books Section */}
      <div className="stock-manager-dashboard-card mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="d-flex align-items-center mb-0">
            <FontAwesomeIcon icon={faStar} className="text-warning me-2" />
            Featured Books for Home Page
          </h5>
          <span className="badge bg-info">
            {featuredBooks.length} books featured
          </span>
        </div>
        <p className="text-muted mb-4">
          These books will appear in the "Popular This Week" section on the home
          page. Click the star icon to feature/unfeature books. Maximum 4
          featured books are shown on home page.
        </p>

        {featuredBooks.length > 0 ? (
          <div className="row">
            {featuredBooks.map((book, index) => (
              <div key={book.id} className="col-md-3 col-sm-6 mb-3">
                <div className="featured-book-card">
                  <div className="featured-book-rank">#{index + 1}</div>
                  <div className="featured-book-info">
                    <h6 className="mb-1 text-truncate" title={book.title}>
                      {book.title}
                    </h6>
                    <small className="text-muted d-block mb-2">
                      {book.author}
                    </small>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-medium">
                        {formatCurrency(book.price)}
                      </span>
                      <span className={getStockStatusClass(book.status)}>
                        {book.stock} in stock
                      </span>
                    </div>
                    <div className="d-flex justify-content-between small">
                      <span>Monthly Sales: {book.salesThisMonth}</span>
                      <span>Total: {book.totalSales}</span>
                    </div>
                  </div>
                  <div className="featured-book-actions mt-3 d-flex gap-2">
                    <button
                      className="btn btn-sm btn-outline-warning grow"
                      onClick={() => onToggleFeatured(book.id)}
                    >
                      <FontAwesomeIcon icon={faStar} className="me-1" />
                      Unfeature
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <FontAwesomeIcon
              icon={faStarRegular}
              className="fa-4x text-muted mb-3"
            />
            <h5>No featured books</h5>
            <p className="text-muted">
              Mark books as featured to show them on the home page
            </p>
            <button
              className="btn btn-primary"
              onClick={() => onChangeTab("inventory")}
            >
              <FontAwesomeIcon icon={faBoxes} className="me-2" />
              Go to Inventory
            </button>
          </div>
        )}

        <div className="alert alert-info mt-3">
          <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
          <strong>Tip:</strong> Featured books should have good stock levels and
          recent sales. The top 4 featured books will be displayed on the home
          page.
        </div>
      </div>
    </>
  );
};

export default PopularBooksTab;
