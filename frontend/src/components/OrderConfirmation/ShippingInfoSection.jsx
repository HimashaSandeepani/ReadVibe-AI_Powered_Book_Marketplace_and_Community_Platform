// Shipping information section for confirmed orders.
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faMapMarkerAlt,
  faGlobe,
  faPhone,
  faEnvelope,
  faReceipt,
} from "@fortawesome/free-solid-svg-icons";
import { formatPrice } from "./utils";

// Renders the shipping address and delivery method details.
const ShippingInfoSection = ({ order, methodDetails }) => {
  if (!order.shipping) {
    return (
      <div className="order-info-section mb-4">
        <h6>
          <FontAwesomeIcon icon="truck" className="me-2" />
          Shipping Information
        </h6>
        <p className="text-muted">No shipping information available</p>
      </div>
    );
  }

  return (
    <div className="order-info-section mb-4">
      <h6>
        <FontAwesomeIcon icon="truck" className="me-2" />
        Shipping Information
      </h6>
      <div className="shipping-info-content">
        <p>
          <FontAwesomeIcon icon={faUser} className="me-2" />
          <strong>Recipient:</strong> {order.shipping.firstName}{" "}
          {order.shipping.lastName}
        </p>
        <p>
          <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />
          <strong>Address:</strong> {order.shipping.address},{" "}
          {order.shipping.city}, {order.shipping.state} {order.shipping.zipCode}
        </p>
        <p>
          <FontAwesomeIcon icon={faGlobe} className="me-2" />
          <strong>Country:</strong> {order.shipping.country}
        </p>
        <p>
          <FontAwesomeIcon icon={faPhone} className="me-2" />
          <strong>Phone:</strong> {order.shipping.phone}
        </p>
        <p>
          <FontAwesomeIcon icon={faEnvelope} className="me-2" />
          <strong>Email:</strong> {order.shipping.email || "Not provided"}
        </p>
        <p>
          <FontAwesomeIcon icon={methodDetails.icon} className="me-2" />
          <strong>Shipping Method:</strong> {methodDetails.title} (
          {methodDetails.days})
        </p>
        <p>
          <FontAwesomeIcon icon={faReceipt} className="me-2" />
          <strong>Shipping Cost:</strong>{" "}
          {formatPrice(order.totals?.shipping || 0)}
        </p>
      </div>
    </div>
  );
};

export default ShippingInfoSection;
