// Stock manager table for listing books, sorting columns, and managing stock actions.
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSort,
  faSortUp,
  faSortDown,
} from "@fortawesome/free-solid-svg-icons";
import StatusBadge from "../Common/StatusBadge";
import ActionButtons from "../Common/ActionButtons";

// Renders the books table with sort controls and row actions.
const BooksTable = ({
  books,
  sortConfig,
  onSort,
  onEdit,
  onDelete,
  onRestock,
  onToggleFeatured,
}) => {
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return faSort;
    return sortConfig.direction === "asc" ? faSortUp : faSortDown;
  };

  const getComputedStatus = (stock) => {
    if (stock === 0) return "Out of Stock";
    if (stock < 10) return "Low Stock";
    return "In Stock";
  };

  const getImageSrc = (book) => {
    if (book.image) return book.image;
    if (Array.isArray(book.images) && book.images.length) return book.images[0];
    if (book.imageUrl) return book.imageUrl;
    return null;
  };

  const formatMoney = (amount) => {
    const value = Number(amount || 0);
    return `LKR ${value.toFixed(2)}`;
  };

  return (
    <div className="table-responsive">
      <table className="table table-hover stock-manager-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>
              <button
                className="btn btn-link p-0 text-decoration-none text-dark fw-bold"
                onClick={() => onSort("title")}
              >
                Title
                <FontAwesomeIcon icon={getSortIcon("title")} className="ms-1" />
              </button>
            </th>
            <th>Description</th>
            <th>Author</th>
            <th>Publisher</th>
            <th>Category</th>
            <th>Dataset Book ID</th>
            <th>
              <button
                className="btn btn-link p-0 text-decoration-none text-dark fw-bold"
                onClick={() => onSort("price")}
              >
                Price
                <FontAwesomeIcon icon={getSortIcon("price")} className="ms-1" />
              </button>
            </th>
            <th>Stock Quantity</th>
            <th>Value</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td style={{ width: "80px" }}>
                {getImageSrc(book) ? (
                  <img
                    src={getImageSrc(book)}
                    alt={book.title}
                    className="img-thumbnail"
                    style={{
                      maxWidth: "72px",
                      maxHeight: "72px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <span className="text-muted small">No image</span>
                )}
              </td>
              <td>
                <div className="fw-medium">{book.title}</div>
                <small className="text-muted">ISBN: {book.isbn}</small>
              </td>
              <td className="text-muted" style={{ maxWidth: "220px" }}>
                {book.description || "-"}
              </td>
              <td>{book.author}</td>
              <td>{book.publisher || "-"}</td>
              <td>
                <span className="badge bg-secondary">{book.category}</span>
              </td>
              <td>
                <small className="text-muted">
                  {book.datasetBookId || book.dataset_book_id || "-"}
                </small>
              </td>
              <td className="text-end">
                <div className="fw-medium">{formatMoney(book.price)}</div>
                <small className="text-muted d-block">
                  Cost: {formatMoney(book.costPrice)}
                </small>
              </td>
              <td className="text-end">
                <div className="fw-medium">{book.stock}</div>
              </td>
              <td className="text-end">
                <div className="fw-medium">
                  {formatMoney(book.price * book.stock)}
                </div>
                <small className="text-muted d-block">
                  Profit:{" "}
                  {formatMoney((book.price - book.costPrice) * book.stock)}
                </small>
              </td>
              <td>
                <StatusBadge
                  status={getComputedStatus(book.stock)}
                  type="stock"
                />
              </td>
              <td>
                <ActionButtons
                  onEdit={() => onEdit(book.id)}
                  onDelete={() => onDelete(book.id)}
                  onRestock={() => onRestock(book.id, 10)}
                  onToggleFeatured={() => onToggleFeatured(book.id)}
                  isFeatured={book.featured}
                  showEdit={true}
                  showDelete={true}
                  showRestock={true}
                  showToggleFeatured={true}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BooksTable;
