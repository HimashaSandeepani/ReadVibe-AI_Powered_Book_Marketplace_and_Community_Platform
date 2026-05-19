// Stock manager sidebar navigation.
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faBoxes,
  faShoppingCart,
  faChartBar,
  faTruck,
  faFire,
  faBook,
  faComments,
} from "@fortawesome/free-solid-svg-icons";

// Renders the stock manager navigation sidebar and section badges.
const Sidebar = ({
  activeTab,
  onTabChange,
  inventoryStats,
  orderStats,
  requestStats,
  supportMessageCount,
}) => {
  return (
    <div className="col-lg-2">
      <div className="stock-manager-sidebar">
        <h5 className="mb-4">Stock Manager</h5>
        <ul className="nav nav-pills flex-column stock-manager-nav">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "dashboard" ? "active" : ""}`}
              onClick={() => onTabChange("dashboard")}
            >
              <FontAwesomeIcon icon={faTachometerAlt} className="me-2" />
              Dashboard
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "inventory" ? "active" : ""}`}
              onClick={() => onTabChange("inventory")}
            >
              <FontAwesomeIcon icon={faBoxes} className="me-2" />
              Inventory
              {inventoryStats?.lowStockItems > 0 && (
                <span className="badge bg-warning ms-2">
                  {inventoryStats.lowStockItems}
                </span>
              )}
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => onTabChange("orders")}
            >
              <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
              Orders
              {orderStats?.processing > 0 && (
                <span className="badge bg-info ms-2">
                  {orderStats.processing}
                </span>
              )}
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "reports" ? "active" : ""}`}
              onClick={() => onTabChange("reports")}
            >
              <FontAwesomeIcon icon={faChartBar} className="me-2" />
              Reports
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "publishers" ? "active" : ""}`}
              onClick={() => onTabChange("publishers")}
            >
              <FontAwesomeIcon icon={faTruck} className="me-2" />
              Publishers
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "popular-books" ? "active" : ""}`}
              onClick={() => onTabChange("popular-books")}
            >
              <FontAwesomeIcon icon={faFire} className="me-2" />
              Popular Books
              {inventoryStats?.featuredBooks > 0 && (
                <span className="badge bg-danger ms-2">
                  {inventoryStats.featuredBooks}
                </span>
              )}
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "book-requests" ? "active" : ""}`}
              onClick={() => onTabChange("book-requests")}
            >
              <FontAwesomeIcon icon={faBook} className="me-2" />
              Book Requests
              {requestStats?.pending > 0 && (
                <span className="badge bg-danger ms-2">
                  {requestStats.pending}
                </span>
              )}
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "messages" ? "active" : ""}`}
              onClick={() => onTabChange("messages")}
            >
              <FontAwesomeIcon icon={faComments} className="me-2" />
              Messages
              {supportMessageCount > 0 && (
                <span className="badge bg-primary ms-2">
                  {supportMessageCount}
                </span>
              )}
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
