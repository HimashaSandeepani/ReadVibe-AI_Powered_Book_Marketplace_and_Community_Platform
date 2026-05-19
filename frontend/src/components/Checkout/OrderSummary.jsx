// Checkout order summary panel.
import React from "react";
import { Card } from "react-bootstrap";
import OrderItems from "./OrderItems";
import OrderTotals from "./OrderTotals";
import DeliveryAddressDisplay from "./DeliveryAddressDisplay";
import SecurityBadges from "./SecurityBadges";

// Checkout order summary wrapper that combines items, totals, and trust cues.
const OrderSummary = ({ orderData }) => {
  return (
    <Card className="checkout-order-summary">
      <Card.Body>
        <h5 className="mb-3">Order Summary</h5>

        <OrderItems items={orderData.items} />

        <OrderTotals totals={orderData.totals} />

        <DeliveryAddressDisplay shipping={orderData.shipping} />

        <SecurityBadges />
      </Card.Body>
    </Card>
  );
};

export default OrderSummary;
