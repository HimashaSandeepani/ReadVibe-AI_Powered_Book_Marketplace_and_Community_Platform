// Marketplace page for browsing, filtering, and opening book details.
import { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Badge,
  Pagination,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faBook,
  faRocket,
  faDragon,
  faSearch as faSearchIcon,
  faHeart,
  faGlasses,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import {
  formatPrice,
  generateStarRating,
  searchBooks,
  filterBooks,
  showNotification,
  getUserWishlist,
  addToWishlist,
} from "../utils/helpers";
import { getCurrentUser as getNormalizedCurrentUser, isPrivilegedUser } from "../utils/auth";
import { getBookReviewsForBook } from "../components/UserProfile/utils";
import { setCart } from "../store/slices/cartSlice";
import { addCartItemApi, fetchCartApi } from "../utils/cartApi";
import { fetchBooksFromApi, fetchBookByIdApi } from "../components/StockManager/utils";
import "../styles/pages/Marketplace.css";

// Components
import BookDetailsModal from "../components/Marketplace/BookDetailsModal";
import BookCard from "../components/Marketplace/BookCard";
import CategorySection from "../components/Marketplace/CategorySection";
import FilterSection from "../components/Marketplace/FilterSection";
import ActiveFilters from "../components/Marketplace/ActiveFilters";
import PaginationSection from "../components/Marketplace/PaginationSection";
import GuestNotice from "../components/Marketplace/GuestNotice";
import SearchBar from "../components/Marketplace/SearchBar";
import EmptyState from "../components/Marketplace/EmptyState";

// Reads the normalized current user for marketplace gating.
const getStoredUser = () => getNormalizedCurrentUser();

// Loads the current user's wishlist from storage.
const getStoredWishlist = () => getUserWishlist();

const DEFAULT_FILTERS = {
  category: "all",
  minPrice: 0,
  maxPrice: 10000,
  minRating: 0,
  minReviews: 0,
  inStock: false,
  preOrder: false,
};

// Loads persisted categories for marketplace filters.
const getStoredCategories = () => {
  try {
    const stored = JSON.parse(window.localStorage.getItem("categories"));
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
};

// Marketplace page component.
const Marketplace = () => {
  const dispatch = useDispatch();
  // Resolves a display image for a book.
  const resolveBookImage = useCallback((book) => {
    const imageFromBook =
      book.image ||
      (Array.isArray(book.images) && book.images.length ? book.images[0] : "");
    return imageFromBook || "/assets/default_book.jpg";
  }, []);

  // Normalizes API books for marketplace rendering.
  const normalizeBooks = useCallback(
    (booksArray) =>
      (booksArray || []).map((book) => ({
        ...book,
        image: resolveBookImage(book),
        inStock: book.inStock ?? book.stock > 0,
        stock: book.stock ?? 0,
        rating:
          book.rating !== undefined && book.rating !== null
            ? Number(book.rating)
            : 0,
        reviews:
          book.reviews !== undefined && book.reviews !== null
            ? Number(book.reviews)
            : 0,
        price: Number(book.price) || 0,
      })),
    [resolveBookImage],
  );

  // Merges cached reviews into a book detail object.
  const mergeBookReviews = useCallback((book) => {
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
  }, []);

  const [allBooks, setAllBooks] = useState([]);
  const [filters, setFilters] = useState(() => ({ ...DEFAULT_FILTERS }));
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(12);
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(false);
  const [user, setUser] = useState(() => getStoredUser());
  const [userWishlist, setUserWishlist] = useState(() => getStoredWishlist());
  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [storedCategories, setStoredCategories] = useState(() =>
    typeof window === "undefined" ? [] : getStoredCategories(),
  );
  const navigate = useNavigate();

  const availableCategories = useMemo(() => {
    const categories = new Set();

    for (const category of storedCategories) {
      if (category) categories.add(String(category).trim());
    }

    for (const book of allBooks) {
      if (book?.category) categories.add(String(book.category).trim());
    }

    return [...categories].filter(Boolean).sort((left, right) => left.localeCompare(right));
  }, [allBooks, storedCategories]);

  // Applies the current marketplace filters to the book list.
  const applyFilters = useCallback(() => {
    const filtered = filterBooks(filters, allBooks);
    setFilteredBooks(filtered);
    setCurrentPage(1);
  }, [allBooks, filters]);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const apiBooks = await fetchBooksFromApi();
        const normalized = normalizeBooks(apiBooks);
        setAllBooks(normalized);
        setFilteredBooks(filterBooks(DEFAULT_FILTERS, normalized));
      } catch (error) {
        console.error("Failed to load books from API", error);
        setAllBooks([]);
        setFilteredBooks([]);
      }
    };

    void loadBooks();

    const handleStorageChange = () => {
      const storedUser = getStoredUser();
      setUser(storedUser);
      setUserWishlist(getStoredWishlist());
      setStoredCategories(getStoredCategories());
      setCurrentPage(1);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [normalizeBooks]);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      setFilteredBooks(searchBooks(searchQuery, allBooks));
      setCurrentPage(1);
      return;
    }

    setFilteredBooks(filterBooks(filters, allBooks));
  }, [allBooks, filters, searchQuery]);

  useEffect(() => {
    const syncCart = async () => {
      if (!user?.id) return;
      try {
        const items = await fetchCartApi(user.id);
        dispatch(
          setCart(
            items.map((item) => ({
              id: item.bookId,
              quantity: item.quantity,
              title: item.title,
              price: item.price,
              image: resolveBookImage(item),
              stock: item.stock,
            })),
          ),
        );
      } catch (error) {
        console.error("Failed to sync cart from API", error);
      }
    };

    syncCart();
  }, [dispatch, resolveBookImage, user]);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length >= 2) {
      const results = searchBooks(query, allBooks);
      setFilteredBooks(results);
      setCurrentPage(1);
    } else if (query.length === 0) {
      applyFilters();
    }
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const changeRating = (change) => {
    let newRating = parseFloat(filters.minRating) + change * 0.5;
    newRating = Math.max(0.5, Math.min(5.0, newRating));
    setFilters((prev) => ({
      ...prev,
      minRating: newRating,
    }));
  };

  const resetFilters = () => {
    const resetState = { ...DEFAULT_FILTERS };
    setFilters(resetState);
    setSearchQuery("");
    setFilteredBooks(filterBooks(resetState, allBooks));
    setCurrentPage(1);
  };

  const validatePriceRange = () => {
    const minPrice = parseInt(filters.minPrice, 10) || 0;
    const maxPrice = parseInt(filters.maxPrice, 10) || 10000;

    if (minPrice > maxPrice) {
      showNotification(
        "Minimum price cannot be greater than maximum price",
        "danger",
      );
      return false;
    }
    return true;
  };

  const handleApplyFilters = () => {
    if (validatePriceRange()) {
      applyFilters();
      setIsFilterCollapsed(false);
      showNotification("Filters applied successfully!", "success");
    }
  };

  const isLoggedIn = () => {
    return user !== null;
  };

  const isCustomerActionAllowed = () => !isPrivilegedUser();

  const requireLogin = (actionName) => {
    if (!isLoggedIn()) {
      showNotification(`Please login to ${actionName}`, "warning");
      navigate("/login");
      return false;
    }
    return true;
  };

  const handleAddToCart = (bookId, e = null) => {
    if (e) e.stopPropagation();

    if (!requireLogin("add items to cart")) return;
    if (!isCustomerActionAllowed()) {
      showNotification("Admin and stock manager accounts cannot add books to cart.", "warning");
      return;
    }

    const targetBook = allBooks.find((b) => b.id === bookId);
    if (!targetBook) return;
    if (!targetBook.inStock || targetBook.stock === 0) {
      showNotification("This book is currently out of stock", "warning");
      return;
    }

    const add = async () => {
      try {
        const items = await addCartItemApi(user.id, targetBook.id, 1);
        dispatch(
          setCart(
            items.map((item) => ({
              id: item.bookId,
              quantity: item.quantity,
              title: item.title,
              price: item.price,
              image: resolveBookImage(item),
              stock: item.stock,
            })),
          ),
        );
        showNotification("Book added to cart!", "success");
      } catch (error) {
        showNotification(error.message || "Failed to add to cart", "danger");
      }
    };

    add();
  };

  const handleBuyNow = (bookId, e = null) => {
    if (e) e.stopPropagation();

    if (!requireLogin("buy books")) return;
    if (!isCustomerActionAllowed()) {
      showNotification("Admin and stock manager accounts cannot buy books.", "warning");
      return;
    }

    const targetBook = allBooks.find((b) => b.id === bookId);
    if (!targetBook || !targetBook.inStock || targetBook.stock === 0) {
      showNotification("This book is currently out of stock", "warning");
      return;
    }

    // Set cart to this single item and persist for checkout flow
    const payload = [
      {
        id: targetBook.id,
        title: targetBook.title,
        price: targetBook.price,
        quantity: 1,
        image: targetBook.image,
        stock: targetBook.stock,
      },
    ];

    dispatch(setCart(payload));
    sessionStorage.setItem("checkoutCart", JSON.stringify(payload));
    showNotification("Proceeding to delivery details", "success");
    navigate("/delivery-details");
  };

  const handleAddToWishlist = async (bookId, e = null) => {
    if (e) e.stopPropagation();

    if (!requireLogin("add items to wishlist")) return;
    if (!isCustomerActionAllowed()) {
      showNotification("Admin and stock manager accounts cannot use the wishlist.", "warning");
      return;
    }

    try {
      const items = await addToWishlist(bookId, user.id);
      setUserWishlist(items);
      showNotification("Book added to wishlist!", "success");
    } catch (error) {
      showNotification(error.message || "Failed to add to wishlist", "danger");
    }
  };

  const isInWishlist = (bookId) => {
    return userWishlist.some((item) => item.id === bookId);
  };

  const handleViewDetails = async (book) => {
    try {
      const detailedBook = await fetchBookByIdApi(book.id);
      setSelectedBook(mergeBookReviews(detailedBook || book));
    } catch (error) {
      console.error("Failed to load book details", error);
      setSelectedBook(mergeBookReviews(book));
    }

    setShowBookModal(true);
  };

  useEffect(() => {
    const handleBookReviewsUpdated = async () => {
      try {
        const apiBooks = await fetchBooksFromApi();
        const normalized = normalizeBooks(apiBooks);
        setAllBooks(normalized);
        setFilteredBooks(searchQuery.length >= 2 ? searchBooks(searchQuery, normalized) : filterBooks(filters, normalized));
      } catch (error) {
        console.error("Failed to refresh books after review update", error);
      }

      setSelectedBook((current) => mergeBookReviews(current));
    };

    window.addEventListener("book-reviews-updated", handleBookReviewsUpdated);
    return () => window.removeEventListener("book-reviews-updated", handleBookReviewsUpdated);
  }, [filters, mergeBookReviews, normalizeBooks, searchQuery]);

  const getCategoryIcon = (category) => {
    const icons = {
      Fiction: faBook,
      "Science Fiction": faRocket,
      Fantasy: faDragon,
      Mystery: faSearchIcon,
      Romance: faHeart,
      "Non-Fiction": faGlasses,
    };
    return icons[category] || faBook;
  };

  // Group books by category
  const groupBooksByCategory = (booksArray) => {
    const grouped = {};

    booksArray.forEach((book) => {
      if (!grouped[book.category]) {
        grouped[book.category] = [];
      }
      grouped[book.category].push(book);
    });

    return grouped;
  };

  // Change page with scroll
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Filter by category with scroll
  const filterByCategory = (category) => {
    setFilters((prev) => ({ ...prev, category }));
    setCurrentPage(1);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Show all books in category with scroll
  const showAllBooksInCategory = (category) => {
    setFilters((prev) => ({ ...prev, category }));
    setCurrentPage(1);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Tooltips
  const wishlistTooltip = (props) => (
    <Tooltip id="wishlist-tooltip" {...props}>
      {isLoggedIn() ? "Add to Wishlist" : "Login to add to wishlist"}
    </Tooltip>
  );

  const cartTooltip = (props) => (
    <Tooltip id="cart-tooltip" {...props}>
      {isLoggedIn() ? "Add to Cart" : "Login to add to cart"}
    </Tooltip>
  );

  const buyNowTooltip = (props) => (
    <Tooltip id="buynow-tooltip" {...props}>
      {isLoggedIn() ? "Buy Now" : "Login to buy"}
    </Tooltip>
  );

  // Render book card function
  const renderBookCard = (book) => (
    <Col lg={3} md={4} sm={6} key={book.id} className="mb-4">
      <BookCard
        book={book}
        isLoggedIn={isLoggedIn()}
        actionsDisabled={isPrivilegedUser()}
        isInWishlist={isInWishlist}
        onViewDetails={handleViewDetails}
        onAddToWishlist={handleAddToWishlist}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        navigate={navigate}
        wishlistTooltip={wishlistTooltip}
        cartTooltip={cartTooltip}
        buyNowTooltip={buyNowTooltip}
        formatPrice={formatPrice}
        generateStarRating={generateStarRating}
      />
    </Col>
  );

  // Render books by category view
  const renderBooksByCategory = () => {
    if (filters.category !== "all") {
      // Show only selected category
      const categoryBooks = filteredBooks.filter(
        (book) => book.category === filters.category,
      );

      if (categoryBooks.length === 0) {
        return <EmptyState resetFilters={resetFilters} />;
      }

      return (
        <div className="category-section mb-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="category-title mb-0">
              <FontAwesomeIcon
                icon={getCategoryIcon(filters.category)}
                className="me-2"
                style={{ color: "var(--primary-blue)" }}
              />
              {filters.category}
              <Badge bg="secondary" className="ms-2">
                {categoryBooks.length} books
              </Badge>
            </h3>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => filterByCategory("all")}
            >
              <FontAwesomeIcon icon={faChevronRight} className="me-1" />
              Back to Categories
            </Button>
          </div>

          <Row>{categoryBooks.map((book) => renderBookCard(book))}</Row>
        </div>
      );
    }

    // Group books by category
    const groupedBooks = groupBooksByCategory(filteredBooks);
    const categories = Object.keys(groupedBooks).sort();

    if (categories.length === 0) {
      return <EmptyState resetFilters={resetFilters} />;
    }

    return categories.map((category) => (
      <CategorySection
        key={category}
        category={category}
        books={groupedBooks[category]}
        filterByCategory={filterByCategory}
        showAllBooksInCategory={showAllBooksInCategory}
        renderBookCard={renderBookCard}
        getCategoryIcon={getCategoryIcon}
        formatPrice={formatPrice}
        generateStarRating={generateStarRating}
        isLoggedIn={isLoggedIn()}
        isInWishlist={isInWishlist}
        onViewDetails={handleViewDetails}
        onAddToWishlist={handleAddToWishlist}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        navigate={navigate}
        wishlistTooltip={wishlistTooltip}
        cartTooltip={cartTooltip}
        buyNowTooltip={buyNowTooltip}
      />
    ));
  };

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  return (
    <>
      <BookDetailsModal
        show={showBookModal}
        onHide={() => setShowBookModal(false)}
        book={selectedBook}
        isLoggedIn={isLoggedIn()}
        actionsDisabled={isPrivilegedUser()}
        isInWishlist={isInWishlist}
        onAddToWishlist={handleAddToWishlist}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        navigate={navigate}
        formatPrice={formatPrice}
        generateStarRating={generateStarRating}
      />

      <Container className="py-4 marketplace-page">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0" style={{ color: "var(--primary-blue)" }}>
            <FontAwesomeIcon icon={faBookmark} className="me-2" />
            Book Marketplace
          </h2>

          <SearchBar
            searchQuery={searchQuery}
            handleSearch={handleSearch}
            isFilterCollapsed={isFilterCollapsed}
            setIsFilterCollapsed={setIsFilterCollapsed}
          />
        </div>

        <GuestNotice user={user} />

        <FilterSection
          isFilterCollapsed={isFilterCollapsed}
          setIsFilterCollapsed={setIsFilterCollapsed}
          filters={filters}
          setFilters={setFilters}
          handleFilterChange={handleFilterChange}
          categories={availableCategories}
          changeRating={changeRating}
          resetFilters={resetFilters}
          handleApplyFilters={handleApplyFilters}
          filteredBooks={filteredBooks}
        />

        <ActiveFilters
          filters={filters}
          setFilters={setFilters}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <div id="booksContainerByCategory">{renderBooksByCategory()}</div>

        <PaginationSection
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={paginate}
          filteredBooks={filteredBooks}
          booksPerPage={booksPerPage}
          filters={filters}
        />
      </Container>
    </>
  );
};

export default Marketplace;
