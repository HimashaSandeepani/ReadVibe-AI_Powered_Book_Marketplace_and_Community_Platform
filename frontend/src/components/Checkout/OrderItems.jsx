// Checkout order items list.
import React from "react";
import { formatPrice } from "./utils";

// Order items list shown in the checkout summary.
const OrderItems = ({ items }) => {
  return (
    <div id="orderItems" className="mb-3">
      {items.map((item, index) => (
        <div key={index} className="checkout-order-item">
          <div className="checkout-order-item-details">
            <h6>{item.title}</h6>
            <div className="checkout-order-item-meta">by {item.author}</div>
          </div>
          <div className="checkout-order-item-price">
            {formatPrice(item.price * item.quantity)}
            <span className="checkout-order-item-quantity">
              Qty: {item.quantity}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderItems;
