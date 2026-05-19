// Stock manager reports tab.
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxes,
  faMoneyBillWave,
  faTags,
  faChartBar,
  faPrint,
  faDownload,
  faCrown,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import { formatCurrency, getStockStatusClass } from "../utils";

const ReportsTab = ({
  inventoryStats,
  orderStats,
  stockBooks,
  onPrint,
  onExport,
}) => {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Inventory Reports</h2>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary" onClick={onPrint}>
            <FontAwesomeIcon icon={faPrint} className="me-2" />
            Print
          </button>
          <button className="btn btn-outline-success" onClick={onExport}>
            <FontAwesomeIcon icon={faDownload} className="me-2" />
            Export
          </button>
        </div>
      </div>

      <div className="report-content-container">
        <div className="row">
          {/* Stock Summary */}
          <div className="col-md-6 mb-4">
            <div className="stock-manager-dashboard-card">
              <h5 className="d-flex align-items-center">
                <FontAwesomeIcon icon={faBoxes} className="text-primary me-2" />
                Stock Summary
              </h5>
              <div className="mt-3">
                <div className="d-flex justify-content-between py-2 border-bottom">
                  <span>Total Books in Inventory:</span>
                  <strong>{inventoryStats.totalBooks}</strong>
                </div>
                <div className="d-flex justify-content-between py-2 border-bottom">
                  <span>Total Stock Value:</span>
                  <strong>
                    {formatCurrency(inventoryStats.totalStockValue)}
                  </strong>
                </div>
                <div className="d-flex justify-content-between py-2 border-bottom">
                  <span>Total Cost Value:</span>
                  <strong>
                    {formatCurrency(inventoryStats.totalCostValue)}
                  </strong>
                </div>
                <div className="d-flex justify-content-between py-2 border-bottom">
                  <span>Potential Profit:</span>
                  <strong className="text-success">
                    {formatCurrency(inventoryStats.potentialProfit)}
                  </strong>
                </div>
                <div className="d-flex justify-content-between py-2 border-bottom">
                  <span>Total Sales Count:</span>
                  <strong className="text-primary">
                    {inventoryStats.totalSalesCount}
                  </strong>
                </div>
                <div className="d-flex justify-content-between py-2 border-bottom">
                  <span>Total Profit Earned:</span>
                  <strong className="text-success">
                    {formatCurrency(inventoryStats.totalProfitEarned)}
                  </strong>
                </div>
                <div className="d-flex justify-content-between py-2 border-bottom">
                  <span>Low Stock Items:</span>
                  <strong className="text-warning">
                    {inventoryStats.lowStockItems}
                  </strong>
                </div>
                <div className="d-flex justify-content-between py-2">
                  <span>Out of Stock Items:</span>
                  <strong className="text-danger">
                    {inventoryStats.outOfStockBooks}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Sales Summary */}
          <div className="col-md-6 mb-4">
            <div className="stock-manager-dashboard-card">
              <h5 className="d-flex align-items-center">
                <FontAwesomeIcon
                  icon={faMoneyBillWave}
                  className="text-success me-2"
                />
                Sales Summary
              </h5>
              <div className="mt-3">
                <div className="d-flex justify-content-between py-2 border-bottom">
                  <span>Total Orders:</span>
                  <strong>{orderStats.total}</strong>
                </div>
                <div className="d-flex justify-content-between py-2 border-bottom">
                  <span>Total Revenue:</span>
                  <strong>{formatCurrency(orderStats.totalRevenue)}</strong>
                </div>
                <div className="d-flex justify-content-between py-2 border-bottom">
                  <span>Average Order Value:</span>
                  <strong>{formatCurrency(orderStats.avgOrderValue)}</strong>
                </div>
                <div className="d-flex justify-content-between py-2 border-bottom">
                  <span>Orders Processing:</span>
                  <strong className="text-warning">
                    {orderStats.processing}
                  </strong>
                </div>
                <div className="d-flex justify-content-between py-2 border-bottom">
                  <span>Orders Shipped:</span>
                  <strong className="text-info">{orderStats.shipped}</strong>
                </div>
                <div className="d-flex justify-content-between py-2">
                  <span>Orders Delivered:</span>
                  <strong className="text-success">
                    {orderStats.delivered}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Distribution Report */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="stock-manager-dashboard-card">
              <h5 className="d-flex align-items-center">
                <FontAwesomeIcon icon={faTags} className="text-info me-2" />
                Category Distribution
              </h5>
              <div className="table-responsive mt-3">
                <table className="table table-hover stock-manager-table">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Number of Books</th>
                      <th>Percentage</th>
                      <th>Total Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from(
                      new Set(stockBooks.map((book) => book.category)),
                    ).map((category) => {
                      const categoryBooks = stockBooks.filter(
                        (book) => book.category === category,
                      );
                      const count = categoryBooks.length;
                      const percentage = (
                        (count / inventoryStats.totalBooks) *
                        100
                      ).toFixed(1);
                      const totalValue = categoryBooks.reduce(
                        (sum, book) => sum + book.price * book.stock,
                        0,
                      );

                      return (
                        <tr key={category}>
                          <td>{category}</td>
                          <td>{count}</td>
                          <td>{percentage}%</td>
                          <td>{formatCurrency(totalValue)}</td>
                        </tr>
                      );
                    })}
                    <tr className="total-row">
                      <td>
                        <strong>Total</strong>
                      </td>
                      <td>
                        <strong>{inventoryStats.totalBooks}</strong>
                      </td>
                      <td>
                        <strong>100%</strong>
                      </td>
                      <td>
                        <strong>
                          {formatCurrency(inventoryStats.totalStockValue)}
                        </strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Top Selling Books */}
        <div className="row">
          <div className="col-12">
            <div className="stock-manager-dashboard-card">
              <h5 className="d-flex align-items-center">
                <FontAwesomeIcon
                  icon={faChartBar}
                  className="text-warning me-2"
                />
                Top Selling Books (This Month)
              </h5>
              <div className="table-responsive mt-3">
                <table className="table table-hover stock-manager-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Category</th>
                      <th>Sales (This Month)</th>
                      <th>Total Sales</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th>Featured</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...stockBooks]
                      .sort((a, b) => b.salesThisMonth - a.salesThisMonth)
                      .slice(0, 10)
                      .map((book, index) => (
                        <tr key={book.id}>
                          <td>
                            <div className={`rank-badge rank-${index + 1}`}>
                              #{index + 1}
                              {index < 3 && (
                                <FontAwesomeIcon
                                  icon={faCrown}
                                  className="ms-1 text-warning"
                                />
                              )}
                            </div>
                          </td>
                          <td>{book.title}</td>
                          <td>{book.author}</td>
                          <td>
                            <span className="badge bg-secondary">
                              {book.category}
                            </span>
                          </td>
                          <td>
                            <strong className="text-primary">
                              {book.salesThisMonth}
                            </strong>
                          </td>
                          <td>{book.totalSales}</td>
                          <td>{book.stock}</td>
                          <td>
                            <span className={getStockStatusClass(book.status)}>
                              {book.status}
                            </span>
                          </td>
                          <td>
                            {book.featured ? (
                              <FontAwesomeIcon
                                icon={faStar}
                                className="text-warning"
                              />
                            ) : (
                              <FontAwesomeIcon
                                icon={faStarRegular}
                                className="text-muted"
                              />
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportsTab;
