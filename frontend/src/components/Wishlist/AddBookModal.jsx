// Wishlist modal for searching and adding books to the user's list.
import React from "react";
import {
  Modal,
  Tabs,
  Tab,
  Form,
  InputGroup,
  Button,
  Alert,
  ListGroup,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faSearch,
  faEdit,
  faHeart,
  faStar,
  faComment,
} from "@fortawesome/free-solid-svg-icons";
import { categories, renderPriorityStars, getPriorityLabel } from "./utils.jsx";
// In WishlistItem.jsx, EditItemModal.jsx, etc.

// Renders the modal for searching or manually adding wishlist books.
const AddBookModal = ({
  show,
  onHide,
  searchTerm,
  setSearchTerm,
  searchResults,
  onSearchBooks,
  onAddToWishlist,
  newBook,
  setNewBook,
  priority,
  setPriority,
  notes,
  setNotes,
  onAddCustomBook,
}) => {
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Add Book to Wishlist
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
        <Tabs defaultActiveKey="search" id="add-book-tabs" className="mb-3">
          <Tab
            eventKey="search"
            title={
              <>
                <FontAwesomeIcon icon={faSearch} className="me-2" />
                Search Books
              </>
            }
          >
            <Form.Group className="mb-3">
              <Form.Label>Search for Books</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Search by title or author..."
                  value={searchTerm}
                  onChange={(e) => {
                    const nextTerm = e.target.value;
                    setSearchTerm(nextTerm);
                    if (nextTerm.trim()) {
                      onSearchBooks(nextTerm);
                    }
                  }}
                />
                <Button variant="outline-primary" onClick={onSearchBooks}>
                  <FontAwesomeIcon icon={faSearch} />
                </Button>
              </InputGroup>
              <Form.Text className="text-muted">
                Search from our collection of books
              </Form.Text>
            </Form.Group>

            {searchResults.length > 0 ? (
              <>
                <h6 className="mb-3">
                  Search Results ({searchResults.length})
                </h6>
                <ListGroup
                  className="mb-3"
                  style={{ maxHeight: "200px", overflowY: "auto" }}
                >
                  {searchResults.map((book) => (
                    <ListGroup.Item
                      key={book.id}
                      action
                      className="d-flex align-items-center"
                      onClick={() => {
                        onAddToWishlist(book, priority, notes);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src={book.image}
                        alt={book.title}
                        className="me-3"
                        style={{
                          width: "50px",
                          height: "70px",
                          objectFit: "cover",
                        }}
                      />
                      <div className="grow">
                        <h6 className="mb-1">{book.title}</h6>
                        <small className="text-muted">by {book.author}</small>
                        <br />
                        <small className="text-success fw-bold">
                          LKR {book.price.toFixed(2)}
                        </small>
                      </div>
                      <FontAwesomeIcon icon={faPlus} className="text-primary" />
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </>
            ) : searchTerm ? (
              <Alert variant="info" className="text-center">
                No books found matching "{searchTerm}"
              </Alert>
            ) : (
              <Alert variant="secondary" className="text-center">
                Enter a search term to find books
              </Alert>
            )}
          </Tab>

          <Tab
            eventKey="custom"
            title={
              <>
                <FontAwesomeIcon icon={faEdit} className="me-2" />
                Add Custom Book
              </>
            }
          >
            <div
              style={{
                maxHeight: "400px",
                overflowY: "auto",
                paddingRight: "10px",
              }}
            >
              <Form>
                <h6 className="mb-3">Book Information</h6>

                <Form.Group className="mb-3">
                  <Form.Label>Book Title *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter book title"
                    value={newBook.title}
                    onChange={(e) =>
                      setNewBook({ ...newBook, title: e.target.value })
                    }
                    required
                    size="sm"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Author *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter author name"
                    value={newBook.author}
                    onChange={(e) =>
                      setNewBook({ ...newBook, author: e.target.value })
                    }
                    required
                    size="sm"
                  />
                </Form.Group>

                <div className="row g-2">
                  <div className="col-md-6">
                    <Form.Group className="mb-3">
                      <Form.Label>Price (LKR) *</Form.Label>
                      <InputGroup size="sm">
                        <InputGroup.Text>LKR</InputGroup.Text>
                        <Form.Control
                          type="number"
                          placeholder="0.00"
                          value={newBook.price}
                          onChange={(e) =>
                            setNewBook({ ...newBook, price: e.target.value })
                          }
                          required
                          min="0"
                          step="0.01"
                        />
                      </InputGroup>
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <Form.Group className="mb-3">
                      <Form.Label>Category</Form.Label>
                      <Form.Select
                        value={newBook.category}
                        onChange={(e) =>
                          setNewBook({ ...newBook, category: e.target.value })
                        }
                        size="sm"
                      >
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </div>
                </div>

                {/* Priority Selection */}
                <div className="card mb-3">
                  <div className="card-body p-3">
                    <Form.Label className="fw-bold mb-2">
                      <FontAwesomeIcon
                        icon={faStar}
                        className="me-2 text-warning"
                      />
                      Priority Level
                    </Form.Label>
                    <div className="priority-selection">
                      <p className="text-muted small mb-2">
                        How soon do you want to read this?
                      </p>
                      <div className="d-flex justify-content-center mb-2">
                        {renderPriorityStars(priority, true, setPriority)}
                      </div>
                      <div className="priority-labels mt-1 text-center">
                        <small className="text-muted d-block">
                          {getPriorityLabel(priority)}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="card">
                  <div className="card-body p-3">
                    <Form.Label className="fw-bold mb-2">
                      <FontAwesomeIcon
                        icon={faComment}
                        className="me-2 text-info"
                      />
                      Notes (Optional)
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Why do you want this book?"
                      maxLength={200}
                      size="sm"
                      className="mb-2"
                    />
                    <Form.Text className="text-muted small">
                      {notes.length}/200 characters
                    </Form.Text>
                  </div>
                </div>

                <div className="text-center mt-3">
                  <Button
                    variant="primary"
                    onClick={onAddCustomBook}
                    disabled={
                      !newBook.title || !newBook.author || !newBook.price
                    }
                    size="sm"
                  >
                    <FontAwesomeIcon icon={faHeart} className="me-2" />
                    Add to Wishlist
                  </Button>
                </div>
              </Form>
            </div>
          </Tab>
        </Tabs>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} size="sm">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddBookModal;
