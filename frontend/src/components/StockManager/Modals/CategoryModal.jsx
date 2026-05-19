// Stock manager modal for managing categories.
import React from "react";

const CategoryModal = ({
  show,
  onClose,
  categoryName,
  onNameChange,
  categories,
  onSave,
  onDelete,
  onSelect,
  selectedCategory,
}) => {
  if (!show) return null;

  return (
    <>
      <div
        className="modal fade show"
        style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        tabIndex="-1"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Manage Categories</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Category Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter category name"
                  value={categoryName}
                  onChange={(e) => onNameChange(e.target.value)}
                />
              </div>

              <div className="d-flex gap-2 mb-3">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={onSave}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={onDelete}
                  disabled={!selectedCategory}
                >
                  Delete
                </button>
              </div>

              <div className="table-responsive">
                <table className="table table-sm table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Categories</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.length === 0 ? (
                      <tr>
                        <td className="text-muted">No categories yet</td>
                      </tr>
                    ) : (
                      categories.map((category) => (
                        <tr
                          key={category}
                          className={
                            selectedCategory === category ? "table-active" : ""
                          }
                          role="button"
                          onClick={() => onSelect(category)}
                        >
                          <td>{category}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default CategoryModal;
