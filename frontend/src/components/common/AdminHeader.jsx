// Shared header for admin views.
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faUserCog,
  faSignOutAlt,
  faHome,
  faChevronDown,
  faShieldAlt,
  faTachometerAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Dropdown } from "react-bootstrap";
import { getCurrentUser, logout } from "../../utils/auth";
import { useDispatch } from "react-redux";
import { logoutSuccess } from "../../store/slices/authSlice";
import "../../styles/components/AdminHeaderFooter.css";

// Admin header component that handles navigation and account actions.
const AdminHeader = () => {
  // Keeps the local user state in sync with storage changes.
  const [user, setUser] = useState(() => getCurrentUser());
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isOnAdminPanel = location.pathname === "/admin-panel";

  useEffect(() => {
    // Re-read the current user whenever another tab updates storage.
    const handleStorageChange = () => {
      setUser(getCurrentUser());
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Clears auth state and returns the user to the login page.
  const handleLogout = () => {
    dispatch(logoutSuccess());
    logout();
    setExpanded(false);
    navigate("/login");
  };

  // Navigates back to the main public site.
  const handleGoToMainSite = () => {
    setExpanded(false);
    navigate("/");
  };

  // Opens the admin dashboard route from the header menu.
  const handleGoToAdminPanel = () => {
    setExpanded(false);
    navigate("/admin-panel");
  };

  // Routes to the stock manager dashboard from the header menu.
  const handleGoToStockManger = () => {
    setExpanded(false);
    navigate("/admin-panel");
  };

  return (
    <nav className="admin-header navbar navbar-expand-lg">
      <div className="container-fluid">
        <Link
          to="/admin-panel"
          className="navbar-brand admin-brand"
          onClick={() => setExpanded(false)}
        >
          <FontAwesomeIcon icon={faBookOpen} className="me-2" />
          <span className="brand-text">
            <span className="brand-main fw-bold">ReadVibe</span>
            <span className="brand-admin">Admin</span>
          </span>
        </Link>

        <button
          className="navbar-toggler admin-toggler"
          type="button"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${expanded ? "show" : ""}`}>
          <div className="d-flex align-items-center admin-user-section">
            <div className="admin-user-info me-3 d-none d-md-block">
              <div className="admin-user-role">
                <FontAwesomeIcon icon={faShieldAlt} className="me-1" />
                <span>Administrator</span>
              </div>
              <div className="admin-user-name">
                {user?.name || user?.username || "Admin"}
              </div>
            </div>

            <Dropdown className="admin-dropdown">
              <Dropdown.Toggle
                variant="primary"
                id="admin-dropdown-toggle"
                className="admin-dropdown-toggle"
              >
                <div className="admin-avatar">
                  <FontAwesomeIcon icon={faUserCog} />
                </div>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className="admin-dropdown-arrow"
                />
              </Dropdown.Toggle>

              <Dropdown.Menu className="admin-dropdown-menu" align="end">
                <Dropdown.Header className="admin-dropdown-header">
                  <div className="admin-dropdown-welcome">Welcome,</div>
                  <div className="admin-dropdown-user">
                    {user?.name || user?.username || "Administrator"}
                  </div>
                  <div className="admin-dropdown-role">
                    <FontAwesomeIcon icon={faShieldAlt} className="me-1" />
                    Administrator
                  </div>
                </Dropdown.Header>
                <Dropdown.Divider className="admin-dropdown-divider" />

                {!isOnAdminPanel && (
                  <Dropdown.Item
                    as={Link}
                    to="/admin-panel"
                    className="admin-dropdown-item"
                    onClick={handleGoToAdminPanel}
                  >
                    <FontAwesomeIcon icon={faTachometerAlt} className="me-2" />
                    Admin Dashboard
                  </Dropdown.Item>
                )}

                <Dropdown.Item
                  as={Link}
                  to="/stock-manager"
                  className="admin-dropdown-item"
                  onClick={handleGoToStockManger}
                >
                  <FontAwesomeIcon icon={faTachometerAlt} className="me-2" />
                  Stock Manager Dashboard
                </Dropdown.Item>

                <Dropdown.Item
                  onClick={handleGoToMainSite}
                  className="admin-dropdown-item"
                >
                  <FontAwesomeIcon icon={faHome} className="me-2" />
                  Go to Main Site
                </Dropdown.Item>

                <Dropdown.Divider className="admin-dropdown-divider" />

                <Dropdown.Item
                  onClick={handleLogout}
                  className="admin-dropdown-item logout-item"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminHeader;
