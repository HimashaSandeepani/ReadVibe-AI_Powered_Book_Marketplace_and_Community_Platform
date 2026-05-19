// Marketplace book card with quick actions and book preview.
import React from "react";
import { Button, Badge, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faUser,
  faStar,
  faTimes,
  faHeart,
  faShoppingCart,
  faTruck,
  faTag,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import createBookCoverPlaceholder from "../../utils/imagePlaceholders";

const BookCard = ({
  book,
  isLoggedIn,
  actionsDisabled = false,
  isInWishlist,
  onViewDetails,
  onAddToWishlist,
  onAddToCart,
  onBuyNow,
  navigate,
  wishlistTooltip,
  cartTooltip,
  buyNowTooltip,
  formatPrice,
  generateStarRating,
}) => {
  return (
    <div className="book-card" onClick={() => onViewDetails(book)}>
      <div className="book-cover">
        <img
          src={book.image}
          alt={book.title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = createBookCoverPlaceholder();
          }}
        />
        {!book.inStock && (
          <span className="badge bg-danger position-absolute top-0 end-0 m-2">
            <FontAwesomeIcon icon={faTimes} className="me-1" />
            Out of Stock
          </span>
        )}
        {book.rating >= 4.5 && (
          <Badge
            bg="warning"
            className="ai-badge position-absolute top-0 start-0 m-2"
          >
            <FontAwesomeIcon icon={faStar} className="me-1" />
            AI Recommended
          </Badge>
        )}
      </div>

      <div className="book-info">
        {book.rating >= 4.5 && (
          <Badge bg="warning" className="mb-2">
            <FontAwesomeIcon icon={faStar} className="me-1" />
            Top Rated
          </Badge>
        )}

        <h5 className="book-title">
          <FontAwesomeIcon icon={faBook} className="me-2" />
          {book.title}
        </h5>

        <p className="book-author">
          <FontAwesomeIcon icon={faUser} className="me-2" />
          by {book.author}
        </p>

        <div className="rating-badge mb-3">
          <FontAwesomeIcon icon={faStar} className="me-1" />
          {generateStarRating(book.rating)} ({book.reviews})
        </div>

        <div className="book-price mb-3">
          <FontAwesomeIcon icon={faTag} className="me-2" />
          {formatPrice(book.price)}
        </div>

        <div className="book-actions d-flex gap-1 mt-auto">
          <OverlayTrigger placement="top" overlay={wishlistTooltip}>
            <Button
              variant={
                isLoggedIn && isInWishlist(book.id)
                  ? "danger"
                  : "outline-danger"
              }
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                if (actionsDisabled) {
                  return;
                }
                if (isLoggedIn) {
                  onAddToWishlist(book.id, e);
                } else {
                  navigate("/login");
                }
              }}
              className="book-action-btn"
              disabled={actionsDisabled}
              title={actionsDisabled ? "Not available for admin or stock manager accounts" : ""}
            >
              <FontAwesomeIcon
                icon={
                  isLoggedIn && isInWishlist(book.id) ? faHeart : faHeartRegular
                }
                className="me-1"
              />
            </Button>
          </OverlayTrigger>

          {book.inStock ? (
            <>
              <OverlayTrigger placement="top" overlay={cartTooltip}>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (actionsDisabled) {
                      return;
                    }
                    if (isLoggedIn) {
                      onAddToCart(book.id, e);
                    } else {
                      navigate("/login");
                    }
                  }}
                  className="book-action-btn"
                >
                  <FontAwesomeIcon icon={faShoppingCart} className="me-1" />
                </Button>
              </OverlayTrigger>

              <OverlayTrigger placement="top" overlay={buyNowTooltip}>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (actionsDisabled) {
                      return;
                    }
                    if (isLoggedIn) {
                      onBuyNow(book.id, e);
                    } else {
                      navigate("/login");
                    }
                  }}
                  className="book-action-btn"
                  disabled={actionsDisabled}
                >
                  <FontAwesomeIcon icon={faTruck} className="me-1" />
                </Button>
              </OverlayTrigger>
            </>
          ) : (
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id="outofstock-tooltip">
                  This book is currently out of stock
                </Tooltip>
              }
            >
              <Button variant="outline-secondary" size="sm" disabled>
                <FontAwesomeIcon icon={faTimes} className="me-1" />
              </Button>
            </OverlayTrigger>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;
