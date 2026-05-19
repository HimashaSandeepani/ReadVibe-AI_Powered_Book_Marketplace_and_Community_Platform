// Modal for requesting a book from the community.
import React from "react";

// Book request modal that captures title, author, category, and reason.
const RequestBookModal = ({
  showRequestBookModal,
  setShowRequestBookModal,
  requestForm,
  setRequestForm,
  categories = [],
  handleRequestBook,
}) => {
  if (!showRequestBookModal) return null;

  return (
    <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header bg-success text-white">
            <h5 className="modal-title">
              <i className="fas fa-book-medical me-2"></i>Request a New Book
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={() => setShowRequestBookModal(false)}
            ></button>
          </div>
          <div className="modal-body">
            <form id="requestBookForm">
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Book Title <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter book title"
                  required
                  value={requestForm.title}
                  onChange={(e) =>
                    setRequestForm({
                      ...requestForm,
                      title: e.target.value,
                    })
                  }
                />
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    Author <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Author name"
                    required
                    value={requestForm.author}
                    onChange={(e) =>
                      setRequestForm({
                        ...requestForm,
                        author: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    ISBN (Optional)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="ISBN number"
                    value={requestForm.isbn}
                    onChange={(e) =>
                      setRequestForm({
                        ...requestForm,
                        isbn: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Category</label>
                <select
                  className="form-select"
                  value={requestForm.category}
                  onChange={(e) =>
                    setRequestForm({
                      ...requestForm,
                      category: e.target.value,
                    })
                  }
                >
                  <option value="">Select category...</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Why do you want this book?{" "}
                  <span className="text-danger">*</span>
                </label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Tell us why this book would be valuable to you and other readers..."
                  required
                  maxLength="500"
                  value={requestForm.reason}
                  onChange={(e) =>
                    setRequestForm({
                      ...requestForm,
                      reason: e.target.value,
                    })
                  }
                ></textarea>
                <div className="text-end mt-1">
                  <small className="text-muted">Max 500 characters</small>
                </div>
              </div>
              <div className="alert alert-info">
                <i className="fas fa-info-circle me-2"></i>
                <small>
                  Your request will be reviewed by our stock team. You'll be
                  notified when it's available!
                </small>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setShowRequestBookModal(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-success"
              onClick={handleRequestBook}
            >
              <i className="fas fa-paper-plane me-2"></i>Submit Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestBookModal;
