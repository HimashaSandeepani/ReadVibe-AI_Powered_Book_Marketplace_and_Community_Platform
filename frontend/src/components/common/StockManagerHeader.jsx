// Shared header for stock manager views.
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
import "../../styles/components/StockManagerHeaderFooter.css";

// Stock manager header component that handles navigation and logout.
const StockManagerHeader = () => {
  const [user, setUser] = useState(() => getCurrentUser());
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isOnStockManager = location.pathname === "/stock-manager";
  const isAdminUser = user?.role === "admin";

  useEffect(() => {
    // Re-read the current user whenever storage changes in another tab.
    const handleStorageChange = () => {
      setUser(getCurrentUser());
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Clears auth state and redirects to the login page.
  const handleLogout = () => {
    dispatch(logoutSuccess());
    logout();
    setExpanded(false);
    navigate("/login");
  };

  // Returns the user to the public landing site.
  const handleGoToMainSite = () => {
    setExpanded(false);
    navigate("/");
  };

  // Opens the stock manager dashboard route.
  const handleGoToStockManager = () => {
    setExpanded(false);
    navigate("/stock-manager");
  };

  return (
    <nav className="stock-manager-header navbar navbar-expand-lg">
      <div className="container-fluid">
        <Link
          to="/stock-manager"
          className="navbar-brand stock-manager-brand"
          onClick={() => setExpanded(false)}
        >
          <FontAwesomeIcon icon={faBookOpen} className="me-2" />
          <span className="brand-text">
            <span className="brand-main fw-bold">ReadVibe</span>
            <span className="brand-stock-manager">Stock Manager</span>
          </span>
        </Link>

        <button
          className="navbar-toggler stock-manager-toggler"
          type="button"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${expanded ? "show" : ""}`}>
          <div className="d-flex align-items-center stock-manager-user-section">
            <div className="stock-manager-user-info me-3 d-none d-md-block">
              <div className="stock-manager-user-role">
                <FontAwesomeIcon icon={faShieldAlt} className="me-1" />
                <span>Stock Manager</span>
              </div>
              <div className="stock-manager-user-name">
                {user?.name || user?.username || "stock-manager"}
              </div>
            </div>

            <Dropdown className="stock-manager-dropdown">
              <Dropdown.Toggle
                variant="primary"
                id="stock-manager-dropdown-toggle"
                className="stock-manager-dropdown-toggle"
              >
                <div className="stock-manager-avatar">
                  <FontAwesomeIcon icon={faUserCog} />
                </div>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className="stock-manager-dropdown-arrow"
                />
              </Dropdown.Toggle>

              <Dropdown.Menu
                className="stock-manager-dropdown-menu"
                align="end"
              >
                <Dropdown.Header className="stock-manager-dropdown-header">
                  <div className="stock-manager-dropdown-welcome">Welcome,</div>
                  <div className="stock-manager-dropdown-user">
                    {user?.name || user?.username || "stock-manager"}
                  </div>
                  <div className="stock-manager-dropdown-role">
                    <FontAwesomeIcon icon={faShieldAlt} className="me-1" />
                    StockManager
                  </div>
                </Dropdown.Header>
                <Dropdown.Divider className="stock-manager-dropdown-divider" />

                {isAdminUser && (
                  <Dropdown.Item
                    as={Link}
                    to="/admin-panel"
                    className="stock-manager-dropdown-item"
                    onClick={() => setExpanded(false)}
                  >
                    <FontAwesomeIcon icon={faTachometerAlt} className="me-2" />
                    Admin Dashboard
                  </Dropdown.Item>
                )}

                {!isOnStockManager && (
                  <Dropdown.Item
                    as={Link}
                    to="/stock-manager"
                    className="stock-manager-dropdown-item"
                    onClick={handleGoToStockManager}
                  >
                    <FontAwesomeIcon icon={faTachometerAlt} className="me-2" />
                    Stock Manager Dashboard
                  </Dropdown.Item>
                )}

                <Dropdown.Item
                  onClick={handleGoToMainSite}
                  className="stock-manager-dropdown-item"
                >
                  <FontAwesomeIcon icon={faHome} className="me-2" />
                  Go to Main Site
                </Dropdown.Item>

                <Dropdown.Divider className="stock-manager-dropdown-divider" />

                <Dropdown.Item
                  onClick={handleLogout}
                  className="stock-manager-dropdown-item logout-item"
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

export default StockManagerHeader;
