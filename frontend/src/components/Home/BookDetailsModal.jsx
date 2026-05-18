import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Modal, Button, Badge, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faUser,
  faStar,
  faTimes,
  faHeart,
  faShoppingCart,
  faTruck,
  faInfoCircle,
  faPrint,
  faCalendar,
  faBarcode,
  faLanguage,
  faComments,
  faStore,
  faChartLine,
  faBookmark,
  faBookOpen,
  faFire,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import {
  formatPrice,
  generateStarRating,
  addToWishlist,
  showNotification,
  getUserWishlist,
} from "../../utils/helpers";
import { addItem, setCart } from "../../store/slices/cartSlice";
import { getCurrentUser, isPrivilegedUser } from "../../utils/auth";

const BookDetailsModal = ({ show, onHide, book, currentUser, actionsDisabled }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!book) return null;
  const reviewItems = Array.isArray(book.reviewsList) ? book.reviewsList : [];

  const resolvedCurrentUser =
    currentUser && typeof currentUser === "object" ? currentUser : getCurrentUser();
  const currentUserId = resolvedCurrentUser?.id ?? null;
  const isLoggedIn = () => resolvedCurrentUser !== null;
  const isActionsDisabled = actionsDisabled || isPrivilegedUser();
  const isBookInStock = book.inStock ?? Number(book.stock) > 0;

  const isInWishlist = (bookId) => {
    if (!resolvedCurrentUser) return false;
    const wishlist = getUserWishlist();
    return wishlist.some((item) => item.id === bookId);
  };

  const handleAddToWishlist = async () => {
    if (isActionsDisabled) {
      showNotification("Admin and stock manager accounts cannot use wishlist actions.", "warning");
      return;
    }

    if (!isLoggedIn()) {
      onHide();
      navigate("/login");
      return;
    }

    try {
      await addToWishlist(book.id, currentUserId);
      showNotification("Book added to wishlist!", "success");
    } catch (error) {
      showNotification(error.message || "Failed to add to wishlist", "danger");
    }
  };

  const handleAddToCart = () => {
    if (isActionsDisabled) {
      showNotification("Admin and stock manager accounts cannot add books to cart.", "warning");
      return;
    }

    if (!isLoggedIn()) {
      onHide();
      navigate("/login");
      return;
    }

    if (!isBookInStock) {
      showNotification("This book is currently out of stock", "warning");
      return;
    }

    dispatch(
      addItem({
        id: book.id,
        title: book.title,
        price: book.price,
        quantity: 1,
        image: book.image,
        stock: book.stock,
      }),
    );
    showNotification("Book added to cart!", "success");
  };

  const handleBuyNow = () => {
    if (isActionsDisabled) {
      showNotification("Admin and stock manager accounts cannot buy books.", "warning");
      return;
    }

    if (!isLoggedIn()) {
      onHide();
      navigate("/login");
      return;
    }

    if (!isBookInStock) {
      showNotification("This book is currently out of stock", "warning");
      return;
    }

    dispatch(
      setCart([
        {
          id: book.id,
          title: book.title,
          price: book.price,
          quantity: 1,
          image: book.image,
          stock: book.stock,
        },
      ]),
    );
    sessionStorage.setItem(
      "checkoutCart",
      JSON.stringify([
        {
          id: book.id,
          quantity: 1,
        },
      ]),
    );
    onHide();
    navigate("/delivery-details");
  };

  const getStockBadge = () => {
    if (book.stock > 10) {
      return <Badge bg="success">In Stock</Badge>;
    } else if (book.stock > 0) {
      return <Badge bg="warning">Low Stock</Badge>;
    } else {
      return <Badge bg="danger">Out of Stock</Badge>;
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" animation={true} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <FontAwesomeIcon icon={faBook} className="me-2" />
          {book.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={4}>
            <div className="text-center">
              <img
                src={book.image}
                alt={book.title}
                className="img-fluid rounded mb-3"
                style={{ maxHeight: "300px" }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/assets/default_book.jpg";
                }}
              />
              <div className="mb-3">
                {getStockBadge()}
                {book.salesThisMonth > 0 && (
                  <Badge bg="info" className="ms-2">
                    <FontAwesomeIcon icon={faFire} className="me-1" />
                    {book.salesThisMonth} sold this month
                  </Badge>
                )}
              </div>
            </div>
          </Col>

          <Col md={8}>
            <h4>
              <FontAwesomeIcon icon={faUser} className="me-2" />
              by {book.author}
            </h4>

            <div className="d-flex align-items-center mb-3">
              <div className="rating-badge">
                <FontAwesomeIcon icon={faStar} className="me-1" />
                {generateStarRating(book.rating)} ({book.reviews} reviews)
              </div>
              <span className="ms-3 fs-5 fw-bold">
                {formatPrice(book.price)}
              </span>
            </div>

            <div className="mb-3">
              <span className="badge bg-primary me-2">
                <FontAwesomeIcon icon={faBookmark} className="me-1" />
                {book.category}
              </span>
              <span className="badge bg-secondary me-2">
                <FontAwesomeIcon icon={faBookOpen} className="me-1" />
                {book.pages || "N/A"} pages
              </span>
              {book.stock > 0 && (
                <span className="badge bg-success">
                  <FontAwesomeIcon icon={faStore} className="me-1" />
                  {book.stock} in stock
                </span>
              )}
            </div>

            <p className="mb-4">
              {book.description || "No description available."}
            </p>

            <div className="mb-4">
              <h5>
                <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                Details
              </h5>
              <ul className="list-unstyled">
                <li>
                  <strong>
                    <FontAwesomeIcon icon={faPrint} className="me-2" />
                    Publisher:
                  </strong>{" "}
                  {book.publisher || "Not specified"}
                </li>
                <li>
                  <strong>
                    <FontAwesomeIcon icon={faCalendar} className="me-2" />
                    Published:
                  </strong>{" "}
                  {book.publishedDate || book.publicationYear || "Not specified"}
                </li>
                <li>
                  <strong>
                    <FontAwesomeIcon icon={faBarcode} className="me-2" />
                    ISBN:
                  </strong>{" "}
                  {book.isbn || "Not specified"}
                </li>
                <li>
                  <strong>
                    <FontAwesomeIcon icon={faLanguage} className="me-2" />
                    Language:
                  </strong>{" "}
                  {book.language || "English"}
                </li>
                {book.salesThisMonth > 0 && (
                  <li>
                    <strong>
                      <FontAwesomeIcon icon={faChartLine} className="me-2" />
                      Monthly Sales:
                    </strong>{" "}
                    {book.salesThisMonth} copies
                  </li>
                )}
              </ul>
            </div>

            <div>
              <h5>
                <FontAwesomeIcon icon={faComments} className="me-2" />
                Customer Reviews
              </h5>
              {reviewItems.length > 0 ? (
                reviewItems.map((review, index) => (
                  <div key={index} className="mb-3 p-3 border rounded">
                    <div className="d-flex align-items-center mb-2">
                      <span className="fw-bold fs-5 me-2">
                        <FontAwesomeIcon icon={faUser} className="me-1" />
                        {review.userName || "Reader"}
                      </span>
                      <span className="text-warning">
                        {generateStarRating(review.rating)}
                      </span>
                    </div>
                    {review.title ? <div className="fw-semibold mb-1">{review.title}</div> : null}
                    <p className="mb-0">{review.text}</p>
                  </div>
                ))
              ) : (
                <div className="mb-3 p-3 border rounded">
                  <div className="d-flex align-items-center mb-2">
                    <span className="fw-bold fs-5 me-2">
                      <FontAwesomeIcon icon={faUser} className="me-1" />
                      Verified Reader
                    </span>
                    <span className="text-warning">{generateStarRating(5)}</span>
                  </div>
                  <p className="mb-0">
                    Sold {book.salesThisMonth || 0} copies this month! Highly
                    recommended.
                  </p>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          <FontAwesomeIcon icon={faTimes} className="me-2" />
          Close
        </Button>

        {isLoggedIn() ? (
          <>
            <Button
              variant={isInWishlist(book.id) ? "danger" : "outline-danger"}
              onClick={handleAddToWishlist}
              className="book-action-btn"
              disabled={isActionsDisabled}
            >
              <FontAwesomeIcon
                icon={isInWishlist(book.id) ? faHeart : faHeartRegular}
                className="me-2"
              />
              {isInWishlist(book.id)
                ? "Remove from Wishlist"
                : "Add to Wishlist"}
            </Button>
            <Button
              variant="outline-primary"
              onClick={handleAddToCart}
              className="book-action-btn"
              disabled={isActionsDisabled || !isBookInStock}
            >
              <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
              Add to Cart
            </Button>
            <Button
              variant="primary"
              onClick={handleBuyNow}
              className="book-action-btn"
              disabled={isActionsDisabled || !isBookInStock}
            >
              <FontAwesomeIcon icon={faTruck} className="me-2" />
              Buy Now
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline-danger"
              onClick={() => {
                onHide();
                navigate("/login");
              }}
              className="book-action-btn"
            >
              <FontAwesomeIcon icon={faHeartRegular} className="me-2" />
              Login for Wishlist
            </Button>
            <Button
              variant="outline-primary"
              onClick={() => {
                onHide();
                navigate("/login");
              }}
              className="book-action-btn"
            >
              <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
              Login to Add to Cart
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                onHide();
                navigate("/login");
              }}
              className="book-action-btn"
            >
              <FontAwesomeIcon icon={faTruck} className="me-2" />
              Login to Buy
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default BookDetailsModal;
