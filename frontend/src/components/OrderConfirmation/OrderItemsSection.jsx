// Ordered items section for confirmation view.
import React from "react";
import { Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxOpen } from "@fortawesome/free-solid-svg-icons";
import { formatPrice } from "./utils";
import createBookCoverPlaceholder from "../../utils/imagePlaceholders";

const OrderItemsSection = ({ items }) => {
  if (!items || items.length === 0) {
    return (
      <div className="order-items-section">
        <h6>
          <FontAwesomeIcon icon={faBoxOpen} className="me-2" />
          Order Items
        </h6>
        <p className="text-muted text-center py-3">No items found</p>
      </div>
    );
  }

  return (
    <div className="order-items-section">
      <h6>
        <FontAwesomeIcon icon={faBoxOpen} className="me-2" />
        Order Items
      </h6>
      {items.map((item, index) => (
        <div key={index} className="order-item mb-3 pb-3 border-bottom">
          <Row className="align-items-stretch g-3">
            <Col xs={12} md={4} lg={3} className="d-flex align-items-center justify-content-center">
              <div className="w-100 d-flex justify-content-center">
                <img
                  src={item.image}
                  alt={item.title}
                  className="order-item-image img-fluid rounded shadow-sm"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = createBookCoverPlaceholder("Book", 60, 80);
                  }}
                  style={{ width: "100%", maxWidth: "260px", height: "260px", objectFit: "cover" }}
                />
              </div>
            </Col>

            <Col xs={12} md={8} lg={9} className="d-flex flex-column justify-content-center">
              <div className="d-flex flex-column flex-md-row justify-content-between gap-3 align-items-md-start">
                <div>
                  <h6 className="mb-1 fw-semibold text-dark">{item.title}</h6>
                  {item.author ? (
                    <p className="text-muted mb-0">by {item.author}</p>
                  ) : null}
                </div>

                <div className="text-md-end">
                  <div className="order-item-price fw-semibold">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                  <div className="order-item-quantity">Qty: {item.quantity}</div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      ))}
    </div>
  );
};

export default OrderItemsSection;
