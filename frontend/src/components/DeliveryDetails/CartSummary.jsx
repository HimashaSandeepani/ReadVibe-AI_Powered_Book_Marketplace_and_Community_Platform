// Delivery details cart summary panel.
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { formatPriceLKR } from "./utils";

// Cart summary component that previews delivery order items and pricing.
const CartSummary = ({ cartItems, orderSummary }) => {
  if (!cartItems || cartItems.length === 0) return null;

  return (
    <div className="delivery-cart-summary mb-4">
      <h5>
        <FontAwesomeIcon icon={faBook} className="me-2" />
        Your Order ({orderSummary.itemCount} items)
      </h5>
      <div className="cart-items-preview">
        {cartItems.map((item, index) => (
          <div key={index} className="cart-item-preview">
            <div className="d-flex align-items-center">
              <img
                src={item.image}
                alt={item.title}
                className="cart-item-preview-img"
              />
              <div className="ms-3">
                <div className="fw-bold">{item.title}</div>
                <div className="text-muted small">by {item.author}</div>
                <div className="small">
                  Qty: {item.quantity} × {formatPriceLKR(item.price)} ={" "}
                  {formatPriceLKR(item.price * item.quantity)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CartSummary;
