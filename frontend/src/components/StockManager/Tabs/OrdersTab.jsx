// Stock manager orders tab.
import React from "react";
import StatsCard from "../Common/StatsCard";
import OrdersTable from "../Tables/OrdersTable";

const OrdersTab = ({
  stats,
  orders,
  onViewOrder,
  onShipOrder,
  onUpdateTracking,
}) => {
  return (
    <>
      <h2 className="mb-4">Order Management</h2>

      <div className="row mb-4">
        <div className="col-md-3 col-sm-6 mb-3">
          <StatsCard number={stats.total} label="Total Orders" />
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <StatsCard
            number={stats.processing}
            label="Processing"
            variant="warning"
          />
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <StatsCard number={stats.shipped} label="Shipped" variant="info" />
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <StatsCard
            number={stats.delivered}
            label="Delivered"
            variant="success"
          />
        </div>
      </div>

      <div className="stock-manager-dashboard-card">
        {orders.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted">No orders found</p>
          </div>
        ) : (
          <OrdersTable
            orders={orders}
            onView={onViewOrder}
            onShip={onShipOrder}
            onUpdateTracking={onUpdateTracking}
          />
        )}
      </div>
    </>
  );
};

export default OrdersTab;
