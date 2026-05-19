// Home page section for popular books.
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Badge } from "react-bootstrap";
import BookCard from "../Home/BookCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire, faBookmark, faCogs } from "@fortawesome/free-solid-svg-icons";
import { fetchBooksFromApi } from "../StockManager/utils";
import { isPrivilegedUser } from "../../utils/auth";

// Home page section for popular books.
const PopularBooksSection = ({ currentUser, onViewDetails }) => {
  const [featuredBooks, setFeaturedBooks] = useState([]);

  // Compares books using sales, stock, and title tie-breakers.
  const comparePopularBooks = (left, right) => {
    const leftMonthlySales = Number(left.salesThisMonth) || 0;
    const rightMonthlySales = Number(right.salesThisMonth) || 0;
    if (rightMonthlySales !== leftMonthlySales) {
      return rightMonthlySales - leftMonthlySales;
    }

    const leftTotalSales = Number(left.totalSales) || 0;
    const rightTotalSales = Number(right.totalSales) || 0;
    if (rightTotalSales !== leftTotalSales) {
      return rightTotalSales - leftTotalSales;
    }

    const leftStock = Number(left.stock) || 0;
    const rightStock = Number(right.stock) || 0;
    if (leftStock !== rightStock) {
      return leftStock - rightStock;
    }

    return String(left.title || "").localeCompare(String(right.title || ""));
  };

  // Resolves a book image from local assets or the provided data.
  const getBookImage = (bookTitle) => {
    const imageMap = {
      "The Midnight Library": "/assets/The_Midnight_Library.jpeg",
      "Project Hail Mary": "/assets/project_hail_mary.jpg",
      "Dune": "/assets/dune.jpg",
      "The Hobbit": "/assets/the_hobbit.jpg",
      "The Silent Patient": "/assets/silent_patient.jpg",
      "Where the Crawdads Sing": "/assets/crawdads_sing.jpg",
      "Atomic Habits": "/assets/atomic_habits.jpg",
      "The Alchemist": "/assets/alchemist.jpg",
    };

    return imageMap[bookTitle] || "/assets/default_book.jpg";
  };

  useEffect(() => {
    // Uses the best available image for each featured book.
    const resolveBookImage = (book) => {
      const localImage =
        book.image ||
        (Array.isArray(book.images) && book.images.length
          ? book.images[0]
          : "");

      return localImage || getBookImage(book.title);
    };

    // Loads and prioritizes the most popular books for the home page.
    const loadFeaturedBooks = async () => {
      try {
        const storedBooks = await fetchBooksFromApi();
        const featured = storedBooks.filter((book) => book.featured);
        const nonFeatured = storedBooks.filter((book) => !book.featured);

        const prioritizedBooks = [
          ...featured.sort(comparePopularBooks),
          ...nonFeatured.sort(comparePopularBooks),
        ].slice(0, 4);

        const formattedBooks = prioritizedBooks.map((book, index) => ({
          id: book.id,
          title: book.title,
          author: book.author,
          category: book.category,
          price: book.price,
          image: resolveBookImage(book),
          rating: Math.min(5, 4 + (Number(book.salesThisMonth) || 0) / 20),
          reviews: book.reviews || book.totalSales || 0,
          inStock: (Number(book.stock) || 0) > 0,
          stock: Number(book.stock) || 0,
          salesThisMonth: Number(book.salesThisMonth) || 0,
          publisher: book.publisher,
          publishedDate: book.publicationYear?.toString(),
          isbn: book.isbn,
          language: book.language,
          pages: book.pages,
          rank: index + 1,
        }));

        setFeaturedBooks(formattedBooks);
      } catch (error) {
        console.error("Error loading featured books:", error);
      }
    };

    void loadFeaturedBooks();

    // Refreshes the list when storage changes elsewhere in the app.
    const handleStorageUpdate = () => {
      void loadFeaturedBooks();
    };

    // Refreshes the list after book review updates.
    const handleBookReviewsUpdate = () => {
      void loadFeaturedBooks();
    };

    window.addEventListener("storage", handleStorageUpdate);
    window.addEventListener("book-reviews-updated", handleBookReviewsUpdate);
    return () => {
      window.removeEventListener("storage", handleStorageUpdate);
      window.removeEventListener("book-reviews-updated", handleBookReviewsUpdate);
    };
  }, []);

  return (
    <Container className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="section-title mb-0">
          <FontAwesomeIcon icon={faFire} className="me-2" />
          Popular This Week
          <div className="section-title-decoration"></div>
        </h2>
      </div>

      <Row id="featuredBooks">
        {featuredBooks.length > 0 ? (
          featuredBooks.map((book) => (
            <Col md={6} lg={3} key={book.id} className="mb-4">
              <BookCard
                book={book}
                currentUser={currentUser}
                onViewDetails={() => onViewDetails(book)}
                actionsDisabled={isPrivilegedUser()}
                rank={book.rank}
              />
            </Col>
          ))
        ) : (
          <Col xs={12} className="text-center py-5">
            <FontAwesomeIcon
              icon={faBookmark}
              className="fa-4x text-muted mb-3"
            />
            <h5>No popular books available</h5>
            <p className="text-muted">Check back later for featured books</p>
          </Col>
        )}
      </Row>

      <div className="text-center mt-4">
        <Link to="/marketplace" className="btn btn-primary me-3">
          <FontAwesomeIcon icon={faBookmark} className="me-2" />
          View All Books
        </Link>
        {currentUser?.role === "stock-manager" ||
        currentUser?.role === "admin" ||
        currentUser?.role === "stock" ? (
          <Link
            to="/stock-manager?tab=popular-books"
            className="btn btn-outline-primary"
          >
            <FontAwesomeIcon icon={faCogs} className="me-2" />
            Manage Popular Books
          </Link>
        ) : null}
      </div>
    </Container>
  );
};

export default PopularBooksSection;
