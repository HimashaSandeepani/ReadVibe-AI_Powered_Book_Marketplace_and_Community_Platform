// Stock manager dashboard tab.
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboardList,
  faShoppingCart,
  faExclamationTriangle,
  faPlus,
  faHandshake,
  faBook,
  faChartBar,
  faFire,
  faEye,
  faShippingFast,
  faSync,
} from "@fortawesome/free-solid-svg-icons";
import StatsCard from "../Common/StatsCard";
import StatusBadge from "../Common/StatusBadge";
import { formatCurrency } from "../utils";

// Renders the stock manager dashboard overview and quick actions.
const DashboardTab = ({
  stats,
  onAddBook,
  onAddPublisher,
  onViewRequests,
  onViewReports,
  onManagePopularBooks,
  onViewOrders,
  orders,
  lowStockBooks,
  onViewOrder,
  onUpdateTracking,
  onRestockBook,
}) => {
  return (
    <>
      <h2 className="mb-4">Stock Manager Dashboard</h2>

      {/* Stats Cards */}
      <div className="row">
        <div className="col-md-3 mb-4">
          <StatsCard number={stats.inventory.totalBooks} label="Total Books" />
        </div>
        <div className="col-md-3 mb-4">
          <StatsCard
            number={stats.inventory.lowStockItems}
            label="Low Stock Alert"
            variant={stats.inventory.lowStockItems > 0 ? "warning" : ""}
          />
        </div>
        <div className="col-md-3 mb-4">
          <StatsCard
            number={stats.orders.processing}
            label="Pending Orders"
            variant={stats.orders.processing > 0 ? "info" : ""}
          />
        </div>
        <div className="col-md-3 mb-4">
          <StatsCard
            number={formatCurrency(stats.orders.totalRevenue)}
            label="Total Sales"
            variant="success"
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <StatsCard
            number={stats.inventory.totalSalesCount}
            label="Books Sold"
            variant="info"
          />
        </div>
        <div className="col-md-6 mb-4">
          <StatsCard
            number={formatCurrency(stats.inventory.totalProfitEarned)}
            label="Total Profit"
            variant="success"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="stock-manager-dashboard-card">
            <h5 className="d-flex align-items-center">
              <FontAwesomeIcon icon={faClipboardList} className="me-2" />
              Quick Actions
            </h5>
            <div className="d-flex gap-2 flex-wrap">
              <button className="btn btn-primary" onClick={onAddBook}>
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Add New Book
              </button>
              <button className="btn btn-success" onClick={onAddPublisher}>
                <FontAwesomeIcon icon={faHandshake} className="me-2" />
                Add Publisher
              </button>
              <button className="btn btn-warning" onClick={onViewRequests}>
                <FontAwesomeIcon icon={faBook} className="me-2" />
                View Requests ({stats.requests.pending})
              </button>
              <button className="btn btn-info" onClick={onViewReports}>
                <FontAwesomeIcon icon={faChartBar} className="me-2" />
                Generate Reports
              </button>
              <button className="btn btn-danger" onClick={onManagePopularBooks}>
                <FontAwesomeIcon icon={faFire} className="me-2" />
                Manage Popular Books
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="row">
        <div className="col-lg-8 mb-4">
          <div className="stock-manager-dashboard-card">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">
                <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
                Recent Orders
              </h5>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={onViewOrders}
              >
                View All
              </button>
            </div>
            <div className="table-responsive">
              <table className="table table-hover stock-manager-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id}>
                      <td>
                        <strong>{order.id}</strong>
                      </td>
                      <td>{order.customer}</td>
                      <td>{formatCurrency(order.total)}</td>
                      <td>
                        <StatusBadge status={order.status} type="order" />
                      </td>
                      <td>
                        <div className="stock-manager-action-buttons">
                          <button
                            className="btn btn-sm btn-outline-primary me-1"
                            onClick={() => onViewOrder(order.id)}
                            title="View Order"
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-info"
                            onClick={() => onUpdateTracking(order.id)}
                            title="Update Tracking"
                          >
                            <FontAwesomeIcon icon={faShippingFast} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Stock Alerts */}
        <div className="col-lg-4 mb-4">
          <div className="stock-manager-dashboard-card">
            <h5 className="mb-3">
              <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
              Stock Alerts
            </h5>
            <div className="alert-items">
              {lowStockBooks.slice(0, 5).map((book) => (
                <div
                  key={book.id}
                  className="alert-item mb-2 p-2 border rounded"
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="alert-title fw-medium">{book.title}</div>
                      <div className="text-muted small">{book.author}</div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <StatusBadge
                        status={`${book.stock} in stock`}
                        type="stock"
                      />
                      <button
                        className="btn btn-sm btn-outline-success"
                        onClick={() => onRestockBook(book.id, book.minStock)}
                        title="Restock"
                      >
                        <FontAwesomeIcon icon={faSync} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {lowStockBooks.length === 0 && (
                <div className="text-center py-3 text-muted">
                  No stock alerts at the moment
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardTab;
