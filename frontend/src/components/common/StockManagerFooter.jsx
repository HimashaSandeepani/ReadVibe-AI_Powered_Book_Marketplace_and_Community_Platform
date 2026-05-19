// Shared footer for stock manager views.
import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faShieldAlt,
  faCube,
  faBoxes,
  faChartBar,
  faClipboardList,
} from "@fortawesome/free-solid-svg-icons";
import "../../styles/components/StockManagerHeaderFooter.css";

// Stock manager footer component with operational links and status.
const StockManagerFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="stock-manager-footer">
      <div className="container-fluid">
        <div className="stock-manager-footer-content">
          <div className="row">
            <div className="col-lg-4 mb-4">
              <div className="stock-manager-footer-brand d-flex align-items-center mb-2">
                <FontAwesomeIcon icon={faBookOpen} className="me-2" />
                <h5 className="mb-0">
                  <span className="brand-main">ReadVibe</span>
                  <span className="brand-admin"> Stock</span>
                </h5>
              </div>
              <p className="stock-manager-footer-description mb-3">
                Operational console for inventory, warehouse coordination, and
                order fulfillment.
              </p>
              <div className="stock-manager-footer-security">
                <FontAwesomeIcon icon={faShieldAlt} className="me-2" />
                <span>Secure Stock Portal</span>
              </div>
            </div>

            <div className="col-lg-2 col-md-4 mb-4">
              <h6 className="stock-manager-footer-heading">Quick Links</h6>
              <ul className="stock-manager-footer-links list-unstyled mb-0">
                <li>
                  <Link
                    to="/stock-manager?tab=inventory"
                    className="stock-manager-footer-link"
                  >
                    Inventory
                  </Link>
                </li>
                <li>
                  <Link
                    to="/stock-manager?tab=orders"
                    className="stock-manager-footer-link"
                  >
                    Orders
                  </Link>
                </li>
                <li>
                  <Link
                    to="/stock-manager?tab=reports"
                    className="stock-manager-footer-link"
                  >
                    Reports
                  </Link>
                </li>
                <li>
                  <Link
                    to="/stock-manager?tab=popular-books"
                    className="stock-manager-footer-link"
                  >
                    Featured
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-lg-2 col-md-4 mb-4">
              <h6 className="stock-manager-footer-heading">Operations</h6>
              <ul className="stock-manager-footer-links list-unstyled mb-0">
                <li className="d-flex align-items-center mb-2">
                  <FontAwesomeIcon icon={faCube} className="me-2" />
                  Stock Movements
                </li>
                <li className="d-flex align-items-center mb-2">
                  <FontAwesomeIcon icon={faBoxes} className="me-2" />
                  Warehousing
                </li>
                <li className="d-flex align-items-center mb-2">
                  <FontAwesomeIcon icon={faChartBar} className="me-2" />
                  Performance
                </li>
                <li className="d-flex align-items-center">
                  <FontAwesomeIcon icon={faClipboardList} className="me-2" />
                  Audits
                </li>
              </ul>
            </div>

            <div className="col-lg-4 col-md-4 mb-4">
              <h6 className="stock-manager-footer-heading">System Status</h6>
              <div className="stock-manager-system-status">
                <div className="status-item">
                  <span className="status-label">Inventory:</span>
                  <span className="status-value status-active">Synced</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Orders:</span>
                  <span className="status-value status-active">Processing</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Warehouses:</span>
                  <span className="status-value">3 active</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Last Sync:</span>
                  <span className="status-value">Just now</span>
                </div>
              </div>
            </div>
          </div>

          <hr className="stock-manager-footer-divider" />

          <div className="stock-manager-footer-bottom">
            <div className="row align-items-center">
              <div className="col-md-6">
                <p className="mb-0">
                  &copy; {currentYear} ReadVibe Stock Manager. All rights
                  reserved.
                </p>
              </div>
              <div className="col-md-6 text-md-end mt-3 mt-md-0">
                <span className="stock-manager-footer-meta">
                  Ops Portal v1.0.0
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default StockManagerFooter;
