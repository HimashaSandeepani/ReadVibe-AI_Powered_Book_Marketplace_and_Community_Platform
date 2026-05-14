import { useState, useEffect, useMemo, useCallback } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Import Components
import GuestRestriction from "../components/Wishlist/GuestRestriction";
import PageHeader from "../components/Wishlist/PageHeader";
import FiltersBar from "../components/Wishlist/FiltersBar";
import WishlistItem from "../components/Wishlist/WishlistItem";
import EmptyWishlist from "../components/Wishlist/EmptyWishlist";
import SummaryCard from "../components/Wishlist/SummaryCard";
import QuickActions from "../components/Wishlist/QuickActions";
import AddBookModal from "../components/Wishlist/AddBookModal";
import EditItemModal from "../components/Wishlist/EditItemModal";

// Import Utilities
import { sampleBooks, applyFilter, sortWishlist } from "../components/Wishlist/utils.jsx";

import { showNotification, getAllBooks, getCurrentUser } from "../utils/helpers";
import { isPrivilegedUser } from "../utils/auth";
import { addItem, selectCartItems, setCart } from "../store/slices/cartSlice";
import { fetchBooksFromApi } from "../components/StockManager/utils";
import {
  fetchWishlistApi,
  addWishlistItemApi,
  updateWishlistItemApi,
  deleteWishlistItemApi,
  clearWishlistApi,
} from "../utils/wishlistApi";
import { addCartItemApi } from "../utils/cartApi";
import "../styles/pages/Wishlist.css";

const SAMPLE_NOTES = [
  "Really want to read this!",
  "Great reviews from friends",
  "Classic sci-fi masterpiece",
];

const Wishlist = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);

  const resolveBookImage = useCallback((book) => {
    if (!book) return "/assets/default_book.jpg";
    const fromBook =
      book.image ||
      (Array.isArray(book.images) && book.images.length ? book.images[0] : "");
    return fromBook || "/assets/default_book.jpg";
  }, []);

  const normalizeWishlistItems = useCallback(
    (items, catalog) => {
      const catalogMap = new Map(
        (catalog || []).map((b) => [String(b.id), { ...b, image: resolveBookImage(b) }]),
      );

      return (items || []).map((item) => {
        const itemId = item.id ?? item.bookId;
        const match = catalogMap.get(String(itemId));
        const base = match || {};

        return {
          ...base,
          ...item,
          id: itemId,
          bookId: item.bookId ?? itemId,
          image: resolveBookImage(item) || base.image || "/assets/default_book.jpg",
          inStock:
            item.inStock ?? base.inStock ?? (base.stock !== undefined ? base.stock > 0 : true),
          price: Number(item.price ?? base.price ?? 0),
          rating: item.rating ?? base.rating ?? null,
          reviews: item.reviews ?? base.reviews ?? null,
          dateAdded: item.dateAdded || new Date().toISOString(),
        };
      });
    },
    [resolveBookImage],
  );

  // State management
  const [user, setUser] = useState(() => getCurrentUser());
  const [allBooks, setAllBooks] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [currentFilter, setCurrentFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [priority, setPriority] = useState(3);
  const [notes, setNotes] = useState("");
  const [sortOrder, setSortOrder] = useState("priority");
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    price: "",
    category: "Fiction",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const apiBooks = await fetchBooksFromApi();
        setAllBooks(Array.isArray(apiBooks) ? apiBooks : []);
      } catch (error) {
        console.error("Failed to load books for wishlist", error);
        setAllBooks(getAllBooks());
      }
    };

    loadBooks();
  }, []);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "currentUser") {
        setUser(getCurrentUser());
      }

      if (event.key === "stockBooks") {
        const updated = getAllBooks();
        setAllBooks(updated);
        setWishlist((prev) => normalizeWishlistItems(prev, updated));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [normalizeWishlistItems]);

  useEffect(() => {
    const loadWishlist = async () => {
      if (!user?.id) {
        setWishlist([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const items = await fetchWishlistApi(user.id);
        setWishlist(normalizeWishlistItems(items, allBooks));
      } catch (error) {
        console.error("Failed to load wishlist", error);
        showNotification(error.message || "Failed to load wishlist", "danger");
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, [user, allBooks, normalizeWishlistItems]);

  const filteredWishlist = useMemo(() => {
    if (!user) return [];
    return sortWishlist(applyFilter(wishlist, currentFilter), sortOrder);
  }, [wishlist, currentFilter, sortOrder, user]);

  // Apply filters to wishlist
  const handleApplyFilter = (filter) => {
    setCurrentFilter(filter);
  };

  // Sort wishlist
  const handleSortWishlist = (sortType) => {
    setSortOrder(sortType);
    const sorted = sortWishlist(wishlist, sortType);
    setWishlist(sorted);
  };

  // Search books
  const handleSearchBooks = (term = searchTerm) => {
    const normalizedTerm = (term || "").trim();

    if (!normalizedTerm) {
      setSearchResults([]);
      return;
    }
    const catalog = allBooks.length ? allBooks : sampleBooks;

    const results = catalog
      .filter(
        (book) =>
          book.title.toLowerCase().includes(normalizedTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(normalizedTerm.toLowerCase()),
      )
      .filter(
        (book) =>
          !wishlist.some((item) => String(item.id) === String(book.id ?? book.bookId)),
      );

    setSearchResults(results);
  };

  // Add to wishlist
  const handleAddToWishlist = (
    book,
    priorityLevel = priority,
    notesText = notes,
  ) => {
    if (!user) {
      showNotification("Please login to add items to wishlist", "warning");
      navigate("/login");
      return false;
    }

    if (isPrivilegedUser()) {
      showNotification("Admin and stock manager accounts cannot use the wishlist.", "warning");
      return false;
    }

    const existingItem = wishlist.find((item) => item.id === book.id);
    if (existingItem) {
      showNotification("This book is already in your wishlist", "info");
      return false;
    }

    const add = async () => {
      try {
        const items = await addWishlistItemApi({
          userId: user.id,
          bookId: book.id,
          priority: priorityLevel,
          notes: notesText,
        });
        setWishlist(normalizeWishlistItems(items, allBooks));
        // Always show full list after adding so the user can immediately see the new item.
        setCurrentFilter("all");
        showNotification("Book added to wishlist!", "success");
        setSearchTerm("");
        setSearchResults([]);
        setPriority(3);
        setNotes("");
        setShowAddModal(false);
        return true;
      } catch (error) {
        showNotification(error.message || "Failed to add to wishlist", "danger");
        return false;
      }
    };

    void add();
    return true;
  };

  // Add custom book to wishlist
  const handleAddCustomBook = () => {
    if (!user) {
      showNotification("Please login to add items to wishlist", "warning");
      navigate("/login");
      return;
    }

    if (isPrivilegedUser()) {
      showNotification("Admin and stock manager accounts cannot use the wishlist.", "warning");
      return;
    }

    showNotification("Please select an existing catalog book to wishlist", "warning");
  };

  // Remove from wishlist
  const handleRemoveFromWishlist = (bookId) => {
    if (!window.confirm("Remove this book from your wishlist?")) return;

    const remove = async () => {
      try {
        const items = await deleteWishlistItemApi({ userId: user.id, bookId });
        setWishlist(normalizeWishlistItems(items, allBooks));
        showNotification("Book removed from wishlist", "info");
      } catch (error) {
        showNotification(error.message || "Failed to remove item", "danger");
      }
    };

    void remove();
  };

  // Clear wishlist
  const handleClearWishlist = () => {
    if (
      !window.confirm(
        "Clear your entire wishlist? This action cannot be undone.",
      )
    )
      return;

    if (wishlist.length === 0) {
      showNotification("Your wishlist is already empty", "info");
      return;
    }

    const clear = async () => {
      try {
        await clearWishlistApi(user.id);
        setWishlist([]);
        showNotification("Wishlist cleared", "info");
      } catch (error) {
        showNotification(error.message || "Failed to clear wishlist", "danger");
      }
    };

    void clear();
  };

  // Edit wishlist item
  const handleEditItem = (item) => {
    setSelectedItem(item);
    setPriority(item.priority || 3);
    setNotes(item.notes || "");
    setShowEditModal(true);
  };

  // Update wishlist item
  const handleUpdateItem = () => {
    if (!selectedItem) return;

    const update = async () => {
      try {
        const items = await updateWishlistItemApi({
          userId: user.id,
          bookId: selectedItem.id,
          priority,
          notes,
        });
        setWishlist(normalizeWishlistItems(items, allBooks));
        setShowEditModal(false);
        showNotification("Wishlist item updated!", "success");
      } catch (error) {
        showNotification(error.message || "Failed to update item", "danger");
      }
    };

    void update();
  };

  // Add to cart from wishlist
  const handleAddToCart = (bookId) => {
    if (!user) {
      showNotification("Please login to add items to cart", "warning");
      navigate("/login");
      return;
    }

    if (isPrivilegedUser()) {
      showNotification("Admin and stock manager accounts cannot add books to cart.", "warning");
      return;
    }

    const book =
      allBooks.find((b) => b.id === bookId) ||
      wishlist.find((b) => b.id === bookId) ||
      sampleBooks.find((b) => b.id === bookId);

    const inStock = book?.inStock ?? (book?.stock ?? 0) > 0;

    if (!book || !inStock) {
      showNotification("This book is currently out of stock", "warning");
      return;
    }

    dispatch(
      addItem({
        id: book.id,
        title: book.title,
        author: book.author,
        price: book.price,
        image: book.image,
        quantity: 1,
        stock: book.stock ?? 0,
      }),
    );

    if (
      window.confirm(
        "Remove this book from wishlist since it's now in your cart?",
      )
    ) {
      handleRemoveFromWishlist(bookId);
    }

    showNotification("Book added to cart!", "success");
  };

  const handleBuyNow = (bookId) => {
    if (!user) {
      showNotification("Please login to buy books", "warning");
      navigate("/login");
      return;
    }

    if (isPrivilegedUser()) {
      showNotification("Admin and stock manager accounts cannot buy books.", "warning");
      return;
    }

    const book =
      allBooks.find((b) => b.id === bookId) ||
      wishlist.find((b) => b.id === bookId) ||
      sampleBooks.find((b) => b.id === bookId);

    const inStock = book?.inStock ?? (book?.stock ?? 0) > 0;

    if (!book || !inStock) {
      showNotification("This book is currently out of stock", "warning");
      return;
    }

    const payload = [
      {
        id: book.id,
        title: book.title,
        author: book.author,
        price: book.price,
        image: book.image,
        quantity: 1,
        stock: book.stock ?? 0,
      },
    ];

    dispatch(setCart(payload));
    sessionStorage.setItem("checkoutCart", JSON.stringify(payload));
    showNotification("Proceeding to delivery details", "success");
    navigate("/delivery-details");
  };

  // Add all available to cart
  const handleAddAllToCart = () => {
    if (isPrivilegedUser()) {
      showNotification("Admin and stock manager accounts cannot add books to cart.", "warning");
      return;
    }

    const availableItems = wishlist.filter((item) => item.inStock);

    if (availableItems.length === 0) {
      showNotification("No available items in your wishlist", "warning");
      return;
    }

    if (
      window.confirm(`Add ${availableItems.length} available items to cart?`)
    ) {
      const addItemsToCart = async () => {
        try {
          let latestCartItems = cartItems;

          for (const item of availableItems) {
            const responseItems = await addCartItemApi(user.id, item.id, 1);
            latestCartItems = Array.isArray(responseItems)
              ? responseItems.map((cartItem) => ({
                  id: cartItem.bookId,
                  quantity: cartItem.quantity,
                  title: cartItem.title,
                  author: cartItem.author,
                  price: cartItem.price,
                  image: resolveBookImage(cartItem),
                  stock: cartItem.stock,
                }))
              : latestCartItems;
          }

          dispatch(setCart(latestCartItems));

          const updatedWishlist = wishlist.filter((item) => !item.inStock);
          setWishlist(updatedWishlist);

          // Remove added items from backend wishlist
          Promise.all(
            availableItems.map((item) =>
              deleteWishlistItemApi({ userId: user.id, bookId: item.id }).catch(() => null),
            ),
          ).catch(() => null);

          showNotification(
            `${availableItems.length} items added to cart!`,
            "success",
          );
        } catch (error) {
          showNotification(error.message || "Failed to add items to cart", "danger");
        }
      };

      void addItemsToCart();
    }
  };

  // Share wishlist
  const handleShareWishlist = (method) => {
    if (!user || isPrivilegedUser()) return;

    switch (method) {
      case "link": {
        const shareableLink = `${window.location.origin}/wishlist-share?user=${user.id}`;
        navigator.clipboard
          .writeText(shareableLink)
          .then(() => showNotification("Link copied to clipboard!", "success"))
          .catch(() => showNotification("Failed to copy link", "danger"));
        break;
      }
      case "email": {
        const subject = `${user.name}'s ReadVibe Wishlist`;
        const body =
          `Check out my book wishlist on ReadVibe!\n\n` +
          `${wishlist
            .map(
              (item) =>
                `• ${item.title} by ${item.author} - LKR ${item.price.toFixed(
                  2,
                )}`,
            )
            .join("\n")}\n\n` +
          `Total: LKR ${wishlist
            .reduce((sum, item) => sum + item.price, 0)
            .toFixed(2)}\n\n` +
          `View my wishlist: ${window.location.origin}/wishlist-share?user=${user.id}`;

        window.location.href = `mailto:?subject=${encodeURIComponent(
          subject,
        )}&body=${encodeURIComponent(body)}`;
        break;
      }
      default:
        break;
    }
  };

  // Close add modal with reset
  const closeAddModal = () => {
    setShowAddModal(false);
    setSearchTerm("");
    setSearchResults([]);
    setNewBook({
      title: "",
      author: "",
      price: "",
      category: "Fiction",
    });
    setPriority(3);
    setNotes("");
  };

  if (loading) {
    return (
      <Container className="py-4 wishlist-page">
        <div className="text-center py-5">Loading wishlist...</div>
      </Container>
    );
  }

  return (
    <>
      <Container className="py-4 wishlist-page">
        <PageHeader wishlistCount={wishlist.length} />

        {!user ? (
          <GuestRestriction />
        ) : (
          <>
            <FiltersBar
              currentFilter={currentFilter}
              onFilterChange={handleApplyFilter}
              sortOrder={sortOrder}
              onSortChange={handleSortWishlist}
              onAddBook={() => setShowAddModal(true)}
            />

            <Row>
              {/* Wishlist Items */}
              <Col lg={9}>
                {filteredWishlist.length === 0 ? (
                  <EmptyWishlist onAddBook={() => setShowAddModal(true)} />
                ) : (
                  <Row>
                    {filteredWishlist.map((item) => (
                      <WishlistItem
                        key={item.id}
                        item={item}
                        onRemove={handleRemoveFromWishlist}
                        onEdit={handleEditItem}
                        onAddToCart={handleAddToCart}
                        onBuyNow={handleBuyNow}
                        onEditItem={handleEditItem}
                        actionsDisabled={isPrivilegedUser()}
                      />
                    ))}
                  </Row>
                )}
              </Col>

              {/* Sidebar */}
              <Col lg={3}>
                <SummaryCard
                  wishlist={wishlist}
                  onAddAllToCart={handleAddAllToCart}
                  onClearWishlist={handleClearWishlist}
                />

                <QuickActions
                  onSearchBooks={() => setShowAddModal(true)}
                  onShareLink={() => handleShareWishlist("link")}
                  onShareEmail={() => handleShareWishlist("email")}
                />
              </Col>
            </Row>
          </>
        )}
      </Container>

      <AddBookModal
        show={showAddModal}
        onHide={closeAddModal}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchResults={searchResults}
        onSearchBooks={handleSearchBooks}
        onAddToWishlist={handleAddToWishlist}
        newBook={newBook}
        setNewBook={setNewBook}
        priority={priority}
        setPriority={setPriority}
        notes={notes}
        setNotes={setNotes}
        onAddCustomBook={handleAddCustomBook}
      />

      <EditItemModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        selectedItem={selectedItem}
        priority={priority}
        setPriority={setPriority}
        notes={notes}
        setNotes={setNotes}
        onRemove={handleRemoveFromWishlist}
        onUpdate={handleUpdateItem}
      />

      {/* Modal backdrop */}
      {(showAddModal || showEditModal) && (
        <div className="modal-backdrop fade show"></div>
      )}
    </>
  );
};

export default Wishlist;
