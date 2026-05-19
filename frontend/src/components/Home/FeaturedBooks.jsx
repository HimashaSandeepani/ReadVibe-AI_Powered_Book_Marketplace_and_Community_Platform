// Home page section for featured books.
import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Tooltip } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faBookmark } from "@fortawesome/free-solid-svg-icons";
import BookCard from "./BookCard";

// Home page section for featured books.
const FeaturedBooks = ({
  featuredBooks,
  isLoggedIn,
  navigate,
  handleViewDetails,
  handleAddToWishlist,
  handleAddToCart,
  handleBuyNow,
  isInWishlist,
}) => {
  // Tooltip shown for wishlist actions.
  const wishlistTooltip = (props) => (
    <Tooltip id="wishlist-tooltip" {...props}>
      {isLoggedIn ? "Add to Wishlist" : "Login to add to wishlist"}
    </Tooltip>
  );

  // Tooltip shown for cart actions.
  const cartTooltip = (props) => (
    <Tooltip id="cart-tooltip" {...props}>
      {isLoggedIn ? "Add to Cart" : "Login to add to cart"}
    </Tooltip>
  );

  // Tooltip shown for the buy-now action.
  const buyNowTooltip = (props) => (
    <Tooltip id="buynow-tooltip" {...props}>
      {isLoggedIn ? "Buy Now" : "Login to buy"}
    </Tooltip>
  );

  return (
    <Container className="my-5">
      <h2 className="section-title">
        <FontAwesomeIcon icon={faChartLine} className="me-2" />
        Popular This Week
        <div className="section-title-decoration"></div>
      </h2>

      <Row id="featuredBooks">
        {featuredBooks &&
          featuredBooks.map((book) => (
            <Col md={3} key={book.id} className="mb-4">
              <BookCard
                book={book}
                isLoggedIn={isLoggedIn}
                isInWishlist={isInWishlist}
                onViewDetails={handleViewDetails}
                onAddToWishlist={handleAddToWishlist}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                navigate={navigate}
                wishlistTooltip={wishlistTooltip}
                cartTooltip={cartTooltip}
                buyNowTooltip={buyNowTooltip}
              />
            </Col>
          ))}
      </Row>

      <div className="text-center mt-4">
        <Link to="/marketplace" className="btn btn-primary me-3">
          <FontAwesomeIcon icon={faBookmark} className="me-2" />
          View All Books
        </Link>
      </div>
    </Container>
  );
};

export default FeaturedBooks;
