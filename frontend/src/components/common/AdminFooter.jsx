// Shared footer for admin views.
import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faShieldAlt,
  faCode,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import "../../styles/components/AdminHeaderFooter.css";

// Admin footer component that provides quick links and system status.
const AdminFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="admin-footer">
      <div className="container-fluid">
        <div className="admin-footer-content">
          <div className="row">
            <div className="col-lg-4 mb-4">
              <div className="admin-footer-brand">
                <FontAwesomeIcon icon={faBookOpen} className="me-2" />
                <h5 className="d-inline">
                  <span className="brand-main">ReadVibe</span>
                  <span className="brand-admin">Admin</span>
                </h5>
              </div>
              <p className="admin-footer-description">
                Advanced administration panel for managing ReadVibe platform.
                Monitor users, content, and system performance with powerful
                tools.
              </p>
              <div className="admin-footer-security">
                <FontAwesomeIcon icon={faShieldAlt} className="me-2" />
                <span>Secure Admin Portal</span>
              </div>
            </div>

            <div className="col-lg-2 col-md-3 mb-4">
              <h6 className="admin-footer-heading">Quick Links</h6>
              <ul className="admin-footer-links">
                <li>
                  <Link to="/admin" className="admin-footer-link">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/admin?tab=users" className="admin-footer-link">
                    User Management
                  </Link>
                </li>
                <li>
                  <Link to="/admin?tab=posts" className="admin-footer-link">
                    Content Moderation
                  </Link>
                </li>
                <li>
                  <Link to="/admin?tab=analytics" className="admin-footer-link">
                    Analytics
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-lg-2 col-md-3 mb-4">
              <h6 className="admin-footer-heading">System</h6>
              <ul className="admin-footer-links">
                <li>
                  <Link to="/admin?tab=system" className="admin-footer-link">
                    Settings
                  </Link>
                </li>
                <li>
                  <a href="#" className="admin-footer-link">
                    Logs
                  </a>
                </li>
                <li>
                  <a href="#" className="admin-footer-link">
                    Backups
                  </a>
                </li>
                <li>
                  <a href="#" className="admin-footer-link">
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-lg-4 col-md-6 mb-4">
              <h6 className="admin-footer-heading">System Status</h6>
              <div className="admin-system-status">
                <div className="status-item">
                  <span className="status-label">Platform:</span>
                  <span className="status-value status-active">
                    Operational
                  </span>
                </div>
                <div className="status-item">
                  <span className="status-label">Database:</span>
                  <span className="status-value status-active">Connected</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Users Online:</span>
                  <span className="status-value">142</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Last Backup:</span>
                  <span className="status-value">Today, 02:00 AM</span>
                </div>
              </div>
            </div>
          </div>

          <hr className="admin-footer-divider" />

          <div className="admin-footer-bottom">
            <div className="row align-items-center">
              <div className="col-md-6">
                <p className="admin-copyright">
                  &copy; {currentYear} ReadVibe Admin Panel. All rights
                  reserved.
                </p>
              </div>
              <div className="col-md-6">
                <div className="admin-footer-info">
                  <div className="admin-developer-info">
                    <FontAwesomeIcon icon={faCode} className="me-1" />
                    <span>Admin Panel v2.1.0</span>
                  </div>
                  <div className="admin-legal-links">
                    <Link to="/privacy-policy" className="admin-legal-link">
                      Privacy
                    </Link>
                    <span className="separator">•</span>
                    <Link to="/terms" className="admin-legal-link">
                      Terms
                    </Link>
                    <span className="separator">•</span>
                    <span className="admin-made-with">
                      <FontAwesomeIcon icon={faHeart} className="me-1" />
                      Made for ReadVibe
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;
