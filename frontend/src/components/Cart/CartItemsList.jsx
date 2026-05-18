import React from "react";
import { Card } from "react-bootstrap";
import CartItem from "./CartItem";

const CartItemsList = ({ cart, books, onRemoveItem, onUpdateQuantity }) => {
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Card className="cart-items-container">
      <Card.Body>
        <h4>Cart Items ({itemCount} items)</h4>
        <div id="cartItemsList">
          {cart.map((item) => {
            const book = books.find((b) => b.id === item.id) || item;

            return (
              <CartItem
                key={item.id}
                item={item}
                book={book}
                onRemove={onRemoveItem}
                onUpdateQuantity={onUpdateQuantity}
              />
            );
          })}
        </div>
      </Card.Body>
    </Card>
  );
};

export default CartItemsList;
