// Cart page header and quick actions.
import React from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStore, faTrash } from "@fortawesome/free-solid-svg-icons";

// Cart header component that shows the page title and clear-cart action.
const CartHeader = ({ cart, onClearCart }) => {
  return (
    <div className="cart-header">
      <h2 className="mb-0">
        <FontAwesomeIcon icon={faStore} />
        Shopping Cart
      </h2>
      {cart.length > 0 && (
        <div className="cart-header-actions">
          <Button
            variant="outline-danger"
            onClick={onClearCart}
            id="clearCartBtn"
          >
            <FontAwesomeIcon icon={faTrash} className="me-1" />
            Clear Cart
          </Button>
        </div>
      )}
    </div>
  );
};

export default CartHeader;
