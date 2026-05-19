// Empty cart message and call to action.
import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

// Empty cart state component that encourages users to browse books.
const EmptyCart = () => {
  return (
    <div className="empty-cart-state">
      <FontAwesomeIcon icon={faShoppingCart} size="4x" />
      <h4>Your cart is empty</h4>
      <p>Browse our marketplace to find books you'll love!</p>
      <Button as={Link} to="/marketplace" variant="primary">
        Browse Books
      </Button>
    </div>
  );
};

export default EmptyCart;
