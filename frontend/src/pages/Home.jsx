// Home page that surfaces featured books, community content, and AI recommendations.
import { useState, useEffect, useRef } from "react";
import { Container } from "react-bootstrap";
import { getCurrentUser as getNormalizedCurrentUser } from "../utils/auth";
import { getBookReviewsForBook, loadBookReviewsForBook } from "../components/UserProfile/utils";
import GuestNotice from "../components/Home/GuestNotice";
import HeroSection from "../components/Home/HeroSection";
import FeaturesSection from "../components/Home/FeaturesSection";
import AISection from "../components/Home/AISection";
import PopularBooksSection from "../components/Home/PopularBooksSection";
import CommunitySection from "../components/Home/CommunitySection";
import StatsSection from "../components/Home/StatsSection";
import BookDetailsModal from "../components/Home/BookDetailsModal";
import { fetchBookByIdApi } from "../components/StockManager/utils";
import { isPrivilegedUser } from "../utils/auth";
import "../styles/pages/Home.css";

// Reads the current user for the home page.
const getStoredCurrentUser = () => {
  return getNormalizedCurrentUser();
};

// Home page component.
const Home = () => {
  const [currentUser, setCurrentUser] = useState(() => getStoredCurrentUser());
  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const selectedBookRef = useRef(null);

  useEffect(() => {
    selectedBookRef.current = selectedBook;
  }, [selectedBook]);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "currentUser") {
        setCurrentUser(getStoredCurrentUser());
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Returns whether a user is signed in.
  const isLoggedIn = () => {
    return currentUser !== null;
  };

  // Merges cached reviews into a book detail payload.
  const mergeBookReviews = (book) => {
    if (!book) return book;

    const cachedReviews = getBookReviewsForBook(book.id);
    if (cachedReviews.length === 0) return book;

    const nextReviewsList = [
      ...(Array.isArray(book.reviewsList) ? book.reviewsList : []),
      ...cachedReviews,
    ].filter((review, index, allReviews) => {
      const key = `${review.id || review.userName || review.user || index}-${review.text || review.comment || ""}`;
      return allReviews.findIndex((item, reviewIndex) => {
        const itemKey = `${item.id || item.userName || item.user || reviewIndex}-${item.text || item.comment || ""}`;
        return itemKey === key;
      }) === index;
    });

    return {
      ...book,
      reviews: Math.max(Number(book.reviews) || 0, nextReviewsList.length),
      reviewsList: nextReviewsList,
    };
  };

  // Loads a book's details and opens the modal.
  const handleViewDetails = async (book) => {
    try {
      const detailedBook = await fetchBookByIdApi(book.id);
      setSelectedBook(mergeBookReviews(detailedBook || book));
      if (book?.id) {
        await loadBookReviewsForBook(book.id);
      }
    } catch {
      setSelectedBook(mergeBookReviews(book));
    }
    setShowBookModal(true);
  };

  useEffect(() => {
    const handleBookReviewsUpdated = async () => {
      const currentBook = selectedBookRef.current;
      setSelectedBook((current) => mergeBookReviews(current));

      if (currentBook?.id) {
        try {
          const refreshed = await fetchBookByIdApi(currentBook.id);
          setSelectedBook((current) =>
            current && current.id === currentBook.id
              ? mergeBookReviews(refreshed || current)
              : current,
          );
        } catch {
          // keep the current book data if refresh fails
        }
      }
    };

    window.addEventListener("book-reviews-updated", handleBookReviewsUpdated);
    return () => window.removeEventListener("book-reviews-updated", handleBookReviewsUpdated);
  }, []);

  // Closes the book details modal.
  const handleCloseModal = () => {
    setShowBookModal(false);
  };

  return (
    <div className="home-page">
      <BookDetailsModal
        show={showBookModal}
        onHide={handleCloseModal}
        book={selectedBook}
        currentUser={currentUser}
        actionsDisabled={isPrivilegedUser()}
      />

      {!isLoggedIn() && <GuestNotice />}

      <HeroSection />

      <FeaturesSection />

      <Container>
        <AISection />
      </Container>

      <PopularBooksSection
        currentUser={currentUser}
        onViewDetails={handleViewDetails}
      />

      <CommunitySection currentUser={currentUser} />

      <StatsSection />
    </div>
  );
};

export default Home;
