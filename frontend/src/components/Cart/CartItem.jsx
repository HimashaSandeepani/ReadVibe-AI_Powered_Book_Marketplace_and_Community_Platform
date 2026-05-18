import React from "react";
import { Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

const CartItem = ({ item, book, onRemove, onUpdateQuantity }) => {
  const formatPrice = (price, showCurrency = true) => {
    if (showCurrency) {
      return new Intl.NumberFormat("en-LK", {
        style: "currency",
        currency: "LKR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(price);
    } else {
      return new Intl.NumberFormat("en-LK", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(price);
    }
  };

  return (
    <div className="cart-item">
      <Row className="align-items-center">
        <Col md={2}>
          <img
            src={book.image}
            alt={book.title}
            className="img-fluid cart-item-image"
          />
        </Col>
        <Col md={3} className="cart-item-details">
          <h6 className="mb-1">{book.title}</h6>
          <p className="author mb-0">by {book.author || "Unknown Author"}</p>
          <small className="text-muted">
            Price: {formatPrice(book.price, true)} Each
          </small>
        </Col>
        <Col md={2} className="cart-item-price">
          <small className="text-muted">Per Item LKR</small>
          <div className="fw-medium">{formatPrice(book.price, false)}</div>
        </Col>
        <Col md={2} className="cart-item-price">
          <small className="text-muted">Total LKR</small>
          <div className="fw-medium">
            {formatPrice(book.price * item.quantity, false)}
          </div>
        </Col>
        <Col md={2} className="quantity-control-wrapper">
          <div className="quantity-control">
            <button
              className="quantity-btn"
              onClick={() => onUpdateQuantity(item.id, -1)}
              disabled={item.quantity <= 1}
            >
              <FontAwesomeIcon icon={faMinus} />
            </button>
            <span className="quantity-display">{item.quantity}</span>
            <button
              className="quantity-btn"
              onClick={() => onUpdateQuantity(item.id, 1)}
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
        </Col>
        <Col md={1} className="cart-item-actions">
          <button
            className="btn remove-item-btn"
            onClick={() => onRemove(item.id)}
            title="Remove item"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </Col>
      </Row>
    </div>
  );
};

export default CartItem;
