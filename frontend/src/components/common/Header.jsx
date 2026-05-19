// Global site header and navigation.
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faShoppingCart,
  faUser,
  faHeart,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import {
  Navbar,
  Nav,
  Container,
  Dropdown,
  Button,
  Badge,
} from "react-bootstrap";
import { getCurrentUser, logout } from "../../utils/auth";
import { getWishlistCount } from "../../utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import { logoutSuccess } from "../../store/slices/authSlice";
import {
  selectCartCount,
  syncFromStorage as syncCartFromStorage,
} from "../../store/slices/cartSlice";

// Reads the initial wishlist count from storage.
const getInitialWishlistCount = () => {
  return getWishlistCount();
};

// Global site header component.
const Header = () => {
  const [user, setUser] = useState(() => getCurrentUser());
  const [wishlistCount, setWishlistCount] = useState(() =>
    getInitialWishlistCount(),
  );
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartCount = useSelector(selectCartCount);

  const isAdminUser = user?.role === "admin";
  const isStockManagerUser =
    user?.role === "stock" || user?.role === "stock-manager";
  const isRegularUser = !!user && !isAdminUser && !isStockManagerUser;

  // Refreshes the wishlist count from storage.
  const updateWishlistCount = () => {
    setWishlistCount(getWishlistCount());
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUser = getCurrentUser();
      setUser(updatedUser);
      updateWishlistCount();
      dispatch(syncCartFromStorage());
    };

    const handleWishlistUpdate = () => {
      const updatedUser = getCurrentUser();
      setUser(updatedUser);
      updateWishlistCount();
    };

    const handleCartUpdate = () => {
      dispatch(syncCartFromStorage());
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("wishlist-updated", handleWishlistUpdate);
    window.addEventListener("cart-updated", handleCartUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("wishlist-updated", handleWishlistUpdate);
      window.removeEventListener("cart-updated", handleCartUpdate);
    };
  }, [dispatch]);

  // Logs the current user out and resets header state.
  const handleLogout = () => {
    dispatch(logoutSuccess());
    logout();
    setUser(null);
    setWishlistCount(0);
    setExpanded(false);
    navigate("/");
  };

  // Collapses the mobile nav after a link click.
  const handleNavLinkClick = () => {
    setExpanded(false);
  };

  return (
    <Navbar
      expand="lg"
      expanded={expanded}
      onToggle={(expanded) => setExpanded(expanded)}
      className="navbar sticky-top shadow-sm"
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          className="navbar-brand fw-bold"
          onClick={handleNavLinkClick}
        >
          <FontAwesomeIcon icon={faBookOpen} className="me-2" />
          ReadVibe
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbarNav" />

        <Navbar.Collapse id="navbarNav">
          <Nav className="me-auto">
            <Nav.Link
              as={Link}
              to="/"
              className="fw-medium"
              onClick={handleNavLinkClick}
            >
              Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/marketplace"
              className="fw-medium"
              onClick={handleNavLinkClick}
            >
              Browse
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/community"
              className="fw-medium"
              onClick={handleNavLinkClick}
            >
              Community
            </Nav.Link>
          </Nav>

          <div className="d-flex align-items-center gap-3">
            {/* Cart Button */}
            {isRegularUser && (
              <Button
                as={Link}
                to="/cart"
                variant="outline-primary"
                className="cart-btn position-relative"
                onClick={handleNavLinkClick}
              >
                <FontAwesomeIcon icon={faShoppingCart} />
                {cartCount > 0 && (
                  <span
                    className="cart-badge bg-danger text-white rounded-circle d-inline-flex align-items-center justify-content-center"
                    style={{
                      minWidth: "1.75rem",
                      height: "1.75rem",
                      marginLeft: "0.5rem",
                      fontSize: "0.75rem",
                      padding: "0 0.45rem",
                    }}
                  >
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Button>
            )}

            {/* User Menu or Login/Signup */}
            {user ? (
              <Dropdown
                className="dropdown-container"
                align="end"
                onToggle={(isOpen) => {
                  if (isOpen && window.innerWidth < 992) {
                    setExpanded(true);
                  }
                }}
              >
                <Dropdown.Toggle
                  variant="primary"
                  id="user-dropdown"
                  className="dropdown-toggle-btn"
                >
                  <FontAwesomeIcon icon={faUser} className="me-1" />
                  {user.name.split(" ")[0]}
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className="ms-2"
                    style={{ fontSize: "0.8rem" }}
                  />
                </Dropdown.Toggle>
                <Dropdown.Menu className="custom-dropdown-menu">
                  <Dropdown.Header>
                    <div className="text-muted small">Welcome back,</div>
                    <strong>{user.name}</strong>
                  </Dropdown.Header>
                  {(isAdminUser || isStockManagerUser) && <Dropdown.Divider />}
                  {isAdminUser && (
                    <>
                      <Dropdown.Item
                        as={Link}
                        to="/admin-panel"
                        className="dropdown-item"
                        onClick={() => setExpanded(false)}
                      >
                        Admin Dashboard
                      </Dropdown.Item>
                      <Dropdown.Item
                        as={Link}
                        to="/stock-manager"
                        className="dropdown-item"
                        onClick={() => setExpanded(false)}
                      >
                        Stock Manager Dashboard
                      </Dropdown.Item>
                    </>
                  )}
                  {!isAdminUser && isStockManagerUser && (
                    <Dropdown.Item
                      as={Link}
                      to="/stock-manager"
                      className="dropdown-item"
                      onClick={() => setExpanded(false)}
                    >
                      Stock Manager Dashboard
                    </Dropdown.Item>
                  )}
                  {isRegularUser && (
                    <>
                      <Dropdown.Divider />
                      <Dropdown.Item
                        as={Link}
                        to="/user-profile"
                        className="dropdown-item"
                        onClick={() => setExpanded(false)}
                      >
                        <FontAwesomeIcon icon={faUser} className="me-2" />
                        My Profile
                      </Dropdown.Item>
                      <Dropdown.Item
                        as={Link}
                        to="/wishlist"
                        className="dropdown-item"
                        onClick={() => setExpanded(false)}
                      >
                        <FontAwesomeIcon icon={faHeart} className="me-2" />
                        Wishlist
                        {wishlistCount > 0 && (
                          <Badge bg="danger" className="ms-auto">
                            {wishlistCount}
                          </Badge>
                        )}
                      </Dropdown.Item>
                    </>
                  )}
                  <Dropdown.Divider />
                  <Dropdown.Item
                    onClick={handleLogout}
                    className="dropdown-item text-danger"
                  >
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <>
                <Button
                  as={Link}
                  to="/login?login=true"
                  variant="outline-primary"
                  className="login-btn me-2"
                  onClick={handleNavLinkClick}
                >
                  Login
                </Button>
                <Button
                  as={Link}
                  to="/login?signup=true"
                  variant="primary"
                  className="signup-btn"
                  onClick={handleNavLinkClick}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
