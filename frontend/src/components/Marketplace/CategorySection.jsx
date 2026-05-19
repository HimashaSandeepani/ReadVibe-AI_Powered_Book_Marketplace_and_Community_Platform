// Marketplace category browsing section.
import React from "react";
import { Row, Badge, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import BookCard from "./BookCard";

// Renders a category shelf with featured marketplace books.
const CategorySection = ({
  category,
  books,
  filterByCategory,
  showAllBooksInCategory,
  renderBookCard,
  getCategoryIcon,
  formatPrice,
  generateStarRating,
  isLoggedIn,
  isInWishlist,
  onViewDetails,
  onAddToWishlist,
  onAddToCart,
  onBuyNow,
  navigate,
  wishlistTooltip,
  cartTooltip,
  buyNowTooltip,
}) => {
  const icon = getCategoryIcon(category);

  return (
    <div className="category-section mb-5" key={category}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="category-title mb-0">
          <FontAwesomeIcon
            icon={icon}
            className="me-2"
            style={{ color: "var(--primary-blue)" }}
          />
          {category}
          <Badge bg="secondary" className="ms-2">
            {books.length} books
          </Badge>
        </h3>
        <Link
          to="#"
          className="text-decoration-none small view-more"
          onClick={(e) => {
            e.preventDefault();
            filterByCategory(category);
          }}
        >
          View all <FontAwesomeIcon icon={faChevronRight} className="ms-1" />
        </Link>
      </div>

      <Row>
        {books
          .slice(0, 4)
          .map((book) =>
            renderBookCard ? (
              renderBookCard(book)
            ) : (
              <BookCard
                key={book.id}
                book={book}
                isLoggedIn={isLoggedIn}
                isInWishlist={isInWishlist}
                onViewDetails={onViewDetails}
                onAddToWishlist={onAddToWishlist}
                onAddToCart={onAddToCart}
                onBuyNow={onBuyNow}
                navigate={navigate}
                wishlistTooltip={wishlistTooltip}
                cartTooltip={cartTooltip}
                buyNowTooltip={buyNowTooltip}
                formatPrice={formatPrice}
                generateStarRating={generateStarRating}
              />
            ),
          )}
      </Row>

      {books.length > 4 && (
        <div className="text-center mt-3">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => showAllBooksInCategory(category)}
          >
            Show {books.length - 4} more books
          </Button>
        </div>
      )}
    </div>
  );
};

export default CategorySection;
