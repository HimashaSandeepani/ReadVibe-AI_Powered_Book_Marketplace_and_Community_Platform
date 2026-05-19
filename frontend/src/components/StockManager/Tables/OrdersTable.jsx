// Stock manager table for tracking orders and handling fulfillment actions.
import React from "react";
import StatusBadge from "../Common/StatusBadge";
import ActionButtons from "../Common/ActionButtons";
import { formatCurrency } from "../utils";

// Renders the stock manager orders table with fulfillment actions.
const OrdersTable = ({ orders, onView, onShip, onUpdateTracking }) => {
  return (
    <div className="table-responsive">
      <table className="table table-hover stock-manager-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
            <th>Order Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>
                <strong>{order.id}</strong>
                {order.trackingNumber && (
                  <div className="small text-muted">
                    Track: {order.trackingNumber}
                  </div>
                )}
              </td>
              <td>
                <div>{order.customer}</div>
                <small className="text-muted">{order.customerEmail}</small>
              </td>
              <td>{order.items} items</td>
              <td>{formatCurrency(order.total)}</td>
              <td>
                <StatusBadge status={order.status} type="order" />
              </td>
              <td>{order.orderDate}</td>
              <td>
                <ActionButtons
                  onView={() => onView(order.id)}
                  onShip={() => onShip(order.id)}
                  onUpdateTracking={() => onUpdateTracking(order.id)}
                  showView={true}
                  showShip={order.status === "Processing"}
                  showUpdateTracking={true}
                  isDisabled={order.status === "Delivered"}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;
