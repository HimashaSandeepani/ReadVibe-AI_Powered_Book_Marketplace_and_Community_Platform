// Stock manager modal for adding a book.
import React, { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";

const BookModalBase = ({
  show,
  onClose,
  newBook,
  onInputChange,
  onSubmit,
  isEditing,
  categories = [],
  authors = [],
  publishers = [],
  onNewAuthor = () => {},
  onEditAuthor = () => {},
  onDeleteAuthor = () => {},
  onSaveCategory = () => {},
  onDeleteCategory = () => {},
}) => {
  const [showAuthorsPanel, setShowAuthorsPanel] = useState(false);
  const [showNewAuthorForm, setShowNewAuthorForm] = useState(false);
  const [selectedAuthorId, setSelectedAuthorId] = useState(null);
  const [authorFilter, setAuthorFilter] = useState("");
  const [authorNameInput, setAuthorNameInput] = useState("");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryInput, setCategoryInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const authorsList = useMemo(
    () => (Array.isArray(authors) ? authors : []),
    [authors],
  );

  const selectedAuthor = useMemo(
    () => authorsList.find((a) => (a.id || a) === selectedAuthorId) || null,
    [authorsList, selectedAuthorId],
  );

  if (!show) return null;

  const handleAddAuthor = () => {
    const name = (authorNameInput || "").trim();
    if (!name) return;

    const [first, ...rest] = name.split(" ");
    const payload = {
      id: Date.now(),
      firstName: first || "",
      lastName: rest.join(" ") || "",
      name,
    };

    onNewAuthor(payload);
    setSelectedAuthorId(payload.id);
    setAuthorNameInput("");
  };

  return (
    <>
      <div
        className="modal fade show"
        style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        tabIndex="-1"
      >
        <div className="modal-dialog stock-manager-modal modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                {isEditing ? "Edit Book" : "Add New Book"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              <form id="addBookForm" onSubmit={onSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">ISBN *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter ISBN"
                      name="isbn"
                      value={newBook.isbn}
                      onChange={onInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Dataset Book ID</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. BK-A102 or 2024X15"
                      name="datasetBookId"
                      value={newBook.datasetBookId || ""}
                      onChange={onInputChange}
                    />
                    <small className="text-muted">
                      Optional. Use this if your AI dataset needs a custom alphanumeric ID.
                    </small>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Book title"
                      name="title"
                      value={newBook.title}
                      onChange={onInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Author *</label>
                    <div className="d-flex gap-2 align-items-center">
                      <input
                        type="text"
                        className="form-control grow"
                        placeholder="Author name"
                        name="author"
                        value={newBook.author}
                        onChange={onInputChange}
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        aria-label="Search authors"
                        onClick={() => setShowAuthorsPanel(true)}
                        title="Search authors"
                      >
                        <FontAwesomeIcon icon={faSearch} />
                      </button>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Category *</label>
                    <div className="d-flex gap-2">
                      <select
                        className="form-select grow"
                        name="category"
                        value={newBook.category}
                        onChange={onInputChange}
                        required
                      >
                        {(categories.length ? categories : ["Fiction"]).map(
                          (cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ),
                        )}
                      </select>
                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{ minWidth: "90px" }}
                        onClick={() => {
                          setSelectedCategory(null);
                          setCategoryInput("");
                          setShowCategoryModal(true);
                        }}
                      >
                        New
                      </button>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Selling Price (LKR) *</label>
                    <div className="input-group">
                      <span className="input-group-text">LKR</span>
                      <input
                        type="number"
                        className="form-control text-end"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        name="price"
                        value={newBook.price}
                        onChange={onInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Cost Price (LKR)</label>
                    <div className="input-group">
                      <span className="input-group-text">LKR</span>
                      <input
                        type="number"
                        className="form-control text-end"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        name="costPrice"
                        value={newBook.costPrice}
                        onChange={onInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Stock Quantity *</label>
                    <input
                      type="number"
                      className="form-control text-end"
                      placeholder="0"
                      min="0"
                      name="stock"
                      value={newBook.stock}
                      onChange={onInputChange}
                      required
                    />
                  </div>
                </div>
                {/* <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Minimum Stock</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="5"
                      min="0"
                      name="minStock"
                      value={newBook.minStock}
                      onChange={onInputChange}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Maximum Stock</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="100"
                      min="0"
                      name="maxStock"
                      value={newBook.maxStock}
                      onChange={onInputChange}
                    />
                  </div> 
                </div>*/}
                <div className="mb-3">
                  <label className="form-label">Book Images</label>
                  <input
                    type="file"
                    className="form-control"
                    name="images"
                    accept="image/*"
                    multiple
                    onChange={onInputChange}
                  />
                  <small className="text-muted">
                    Upload one or more cover images (JPG, PNG, GIF)
                  </small>
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Book description"
                    name="description"
                    value={newBook.description}
                    onChange={onInputChange}
                  ></textarea>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Publisher</label>
                    <select
                      className="form-select"
                      name="publisher"
                      value={newBook.publisher}
                      onChange={onInputChange}
                    >
                      <option value="">Select publisher</option>
                      {(Array.isArray(publishers) ? publishers : []).map(
                        (publisher) => (
                          <option
                            key={publisher.id || publisher.name || publisher}
                            value={publisher.name || publisher}
                          >
                            {publisher.name || publisher}
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Publication Year</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="2024"
                      min="1900"
                      max={new Date().getFullYear()}
                      name="publicationYear"
                      value={newBook.publicationYear}
                      onChange={onInputChange}
                    />
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="addBookForm"
                className="btn btn-primary"
              >
                {isEditing ? "Update Book" : "Add Book"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>

      {showNewAuthorForm && (
        <>
          <div
            className="modal fade show"
            style={{
              display: "block",
              backgroundColor: "rgba(0,0,0,0.4)",
              zIndex: 1080,
            }}
            tabIndex="-1"
          >
            <div className="modal-dialog modal-md">
              <div className="modal-content">
                <div className="modal-header py-2 d-flex align-items-center">
                  <h6 className="modal-title mb-0">Manage Authors</h6>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowNewAuthorForm(false);
                      setAuthorNameInput("");
                      setSelectedAuthorId(null);
                    }}
                  ></button>
                </div>
                <div
                  className="modal-body"
                  style={{ maxHeight: "420px", overflowY: "auto" }}
                >
                  <div className="mb-3">
                    <label className="form-label">Author name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. J. K. Rowling"
                      value={authorNameInput}
                      onChange={(e) => setAuthorNameInput(e.target.value)}
                    />
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          setShowNewAuthorForm(false);
                          setAuthorNameInput("");
                          setSelectedAuthorId(null);
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          const name = (authorNameInput || "").trim();
                          if (!name) return;

                          const [first, ...rest] = name.split(" ");
                          const base = {
                            firstName: first || "",
                            lastName: rest.join(" ") || "",
                            name,
                          };

                          if (selectedAuthor) {
                            const key = selectedAuthor.id || selectedAuthor;
                            const updated = {
                              ...(typeof selectedAuthor === "object"
                                ? selectedAuthor
                                : {}),
                              ...base,
                              id: key,
                            };
                            onEditAuthor(updated);
                            setSelectedAuthorId(key);
                          } else {
                            handleAddAuthor();
                          }
                          setAuthorNameInput("");
                        }}
                      >
                        Save
                      </button>
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      disabled={!selectedAuthor}
                      onClick={() => {
                        if (!selectedAuthor) return;
                        onDeleteAuthor(selectedAuthor);
                        if (
                          (authorNameInput || "").trim() ===
                          (selectedAuthor.name || selectedAuthor)
                        ) {
                          setAuthorNameInput("");
                        }
                        setSelectedAuthorId(null);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-hover table-sm align-middle mb-0">
                      <thead
                        style={{ backgroundColor: "#0d6efd", color: "#ffffff" }}
                      >
                        <tr>
                          <th className="ps-3">Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {authorsList.map((author) => (
                          <tr
                            key={author.id || author}
                            className={
                              selectedAuthor &&
                              (selectedAuthor.id === (author.id || author) ||
                                selectedAuthor === author)
                                ? "table-primary"
                                : ""
                            }
                            role="button"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setSelectedAuthorId(author.id || author);
                              setAuthorNameInput(author.name || author);
                            }}
                          >
                            <td className="small py-2">
                              {author.name || author}
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
          <div
            className="modal-backdrop fade show"
            style={{ zIndex: 1075 }}
          ></div>
        </>
      )}

      {showCategoryModal && (
        <>
          <div
            className="modal fade show"
            style={{
              display: "block",
              backgroundColor: "rgba(0,0,0,0.45)",
              zIndex: 1080,
            }}
            tabIndex="-1"
          >
            <div className="modal-dialog modal-md">
              <div className="modal-content">
                <div className="modal-header py-2 d-flex align-items-center">
                  <h6 className="modal-title mb-0">Manage Categories</h6>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowCategoryModal(false);
                      setCategoryInput("");
                      setSelectedCategory(null);
                    }}
                  ></button>
                </div>
                <div
                  className="modal-body"
                  style={{ maxHeight: "420px", overflowY: "auto" }}
                >
                  <div className="mb-3">
                    <label className="form-label">Category name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Thriller"
                      value={categoryInput}
                      onChange={(e) => setCategoryInput(e.target.value)}
                    />
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          setShowCategoryModal(false);
                          setCategoryInput("");
                          setSelectedCategory(null);
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          if (!categoryInput.trim()) return;
                          onSaveCategory(
                            categoryInput.trim(),
                            selectedCategory || null,
                          );
                          onInputChange({
                            target: {
                              name: "category",
                              value: categoryInput.trim(),
                            },
                          });
                          setSelectedCategory(categoryInput.trim());
                          setShowCategoryModal(false);
                          setCategoryInput("");
                        }}
                      >
                        Save
                      </button>
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      disabled={!selectedCategory}
                      onClick={() => {
                        if (!selectedCategory) return;
                        setCategoryToDelete(selectedCategory);
                        setShowDeleteConfirm(true);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-hover table-sm align-middle mb-0">
                      <thead
                        style={{ backgroundColor: "#0d6efd", color: "#ffffff" }}
                      >
                        <tr>
                          <th className="ps-3">Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(Array.isArray(categories) ? categories : []).map(
                          (cat) => (
                            <tr
                              key={cat}
                              className={
                                selectedCategory === cat ? "table-primary" : ""
                              }
                              role="button"
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                setSelectedCategory(cat);
                                setCategoryInput(cat);
                              }}
                            >
                              <td className="small py-2">{cat}</td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="modal-backdrop fade show"
            style={{ zIndex: 1075 }}
          ></div>
        </>
      )}

      {showDeleteConfirm && (
        <>
          <div
            className="modal fade show"
            style={{
              display: "block",
              backgroundColor: "rgba(0,0,0,0.55)",
              zIndex: 1100,
            }}
            tabIndex="-1"
          >
            <div className="modal-dialog modal-sm modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header py-2">
                  <h6 className="modal-title mb-0">Confirm Delete</h6>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setCategoryToDelete(null);
                    }}
                  ></button>
                </div>
                <div className="modal-body">
                  <p className="mb-0 small">
                    Are you sure you want to delete category{" "}
                    <strong>{categoryToDelete}</strong>?
                  </p>
                </div>
                <div className="modal-footer py-2">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setCategoryToDelete(null);
                    }}
                  >
                    No
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      if (!categoryToDelete) {
                        setShowDeleteConfirm(false);
                        return;
                      }
                      onDeleteCategory(categoryToDelete);
                      if (selectedCategory === categoryToDelete) {
                        setSelectedCategory(null);
                      }
                      if (categoryInput === categoryToDelete) {
                        setCategoryInput("");
                      }
                      setShowDeleteConfirm(false);
                      setCategoryToDelete(null);
                    }}
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div
            className="modal-backdrop fade show"
            style={{ zIndex: 1095 }}
          ></div>
        </>
      )}

      {showAuthorsPanel && (
        <>
          <div
            className="modal fade show"
            style={{
              display: "block",
              backgroundColor: "rgba(0,0,0,0.35)",
              zIndex: 1070,
            }}
            tabIndex="-1"
          >
            <div className="modal-dialog modal-md">
              <div className="modal-content">
                <div className="modal-header py-2 d-flex align-items-center">
                  <h6 className="modal-title mb-0">Authors</h6>
                  <div className="ms-auto d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        setAuthorNameInput("");
                        setSelectedAuthorId(null);
                        setShowNewAuthorForm(true);
                      }}
                    >
                      New
                    </button>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowAuthorsPanel(false)}
                    ></button>
                  </div>
                </div>
                <div
                  className="modal-body"
                  style={{ maxHeight: "320px", overflowY: "auto" }}
                >
                  <div className="mb-2">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Search by author name"
                      value={authorFilter}
                      onChange={(e) => setAuthorFilter(e.target.value)}
                    />
                  </div>
                  {authorsList.length === 0 ? (
                    <div className="text-muted small">
                      No authors available.
                    </div>
                  ) : (
                    authorsList
                      .filter((author) => {
                        const name = (author.name || author || "")
                          .toString()
                          .toLowerCase();
                        return name.includes(authorFilter.toLowerCase());
                      })
                      .map((author) => (
                        <div
                          key={author.id || author}
                          className={`d-flex justify-content-between align-items-center py-2 border-bottom ${selectedAuthor && (selectedAuthor.id === (author.id || author) || selectedAuthor === author) ? "bg-light" : ""}`}
                          role="button"
                          onClick={() => {
                            setSelectedAuthorId(author.id || author);
                            onInputChange({
                              target: {
                                name: "author",
                                value: author.name || author,
                              },
                            });
                            setShowAuthorsPanel(false);
                          }}
                        >
                          <span>{author.name || author}</span>
                        </div>
                      ))
                  )}
                </div>
                <div className="modal-footer py-2">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowAuthorsPanel(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div
            className="modal-backdrop fade show"
            style={{ zIndex: 1065 }}
          ></div>
        </>
      )}
    </>
  );
};

const AddBookModal = (props) => <BookModalBase {...props} isEditing={false} />;

export const EditBookModal = (props) => (
  <BookModalBase {...props} isEditing={true} />
);

export default AddBookModal;
