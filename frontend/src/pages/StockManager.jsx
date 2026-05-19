// Stock manager dashboard for inventory, orders, and publisher workflows.
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/pages/StockManager.css";

// Import Components
import StockManagerHeader from "../components/common/StockManagerHeader";
import StockManagerFooter from "../components/common/StockManagerFooter";
import Sidebar from "../components/StockManager/Sidebar";
import DashboardTab from "../components/StockManager/Tabs/DashboardTab";
import InventoryTab from "../components/StockManager/Tabs/InventoryTab";
import OrdersTab from "../components/StockManager/Tabs/OrdersTab";
import ReportsTab from "../components/StockManager/Tabs/ReportsTab";
import PublishersTab from "../components/StockManager/Tabs/PublishersTab";
import BookRequestsTab from "../components/StockManager/Tabs/BookRequestsTab";
import PopularBooksTab from "../components/StockManager/Tabs/PopularBooksTab";
import SupportMessagesTab from "../components/StockManager/Tabs/SupportMessagesTab";
import AddBookModal, {
  EditBookModal,
} from "../components/StockManager/Modals/AddBookModal";
import AddPublisherModal from "../components/StockManager/Modals/AddPublisherModal";
import TrackingModal from "../components/StockManager/Modals/TrackingModal";
import RequestDetailsModal from "../components/StockManager/Modals/RequestDetailsModal";
import {
  fetchBookRequestsApi,
  updateBookRequestStatusApi,
} from "../utils/communityApi";

// Import Utilities
import {
  calculateInventoryStats,
  calculateOrderStats,
  calculateRequestStats,
  calculateBookSalesMetrics,
  filterBooks,
  sortBooks,
  showNotification,
  initialStockBooks,
  initialStockOrders,
  initialPublishers,
  fetchBooksFromApi,
  fetchAllOrdersApi,
  fetchPublishersFromApi,
  createBookApi,
  updateBookApi,
  deleteBookApi,
  createPublisherApi,
  updatePublisherApi,
  deletePublisherApi,
  updateOrderStatusApi,
  updateOrderTrackingApi,
} from "../components/StockManager/utils";
import {
  addSupportReply,
  getSupportMessages,
  getSupportMessagesUpdatedEventName,
  SUPPORT_MESSAGES_CACHE_KEY,
  getUnreadSupportMessageCount,
  loadSupportMessages,
} from "../utils/supportMessages";

const StockManager = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(() => {
    if (typeof window === "undefined") return null;
    try {
      return JSON.parse(window.localStorage.getItem("currentUser"));
    } catch (error) {
      console.error("Failed to parse currentUser from storage", error);
      return null;
    }
  });

  // Extract tab from query parameters
  const queryParams = new URLSearchParams(location.search);
  const tabFromQuery = queryParams.get("tab");
  const activeTab = tabFromQuery || "dashboard";
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [editingBookId, setEditingBookId] = useState(null);
  const [showAddPublisherModal, setShowAddPublisherModal] = useState(false);
  const [showRequestDetailsModal, setShowRequestDetailsModal] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [stock_managerNotes, setstock_managerNotes] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Form states
  const defaultCategories = ["Fiction", "Non-Fiction", "Science", "Fantasy"];

  const [categories, setCategories] = useState(() => {
    if (typeof window === "undefined") return defaultCategories;
    const stored = JSON.parse(window.localStorage.getItem("categories"));
    return Array.isArray(stored) && stored.length ? stored : defaultCategories;
  });

  const [authors, setAuthors] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = JSON.parse(window.localStorage.getItem("authors"));
      return Array.isArray(stored) ? stored : [];
    } catch (error) {
      console.error("Failed to parse authors from storage", error);
      return [];
    }
  });

  const [newBook, setNewBook] = useState({
    datasetBookId: "",
    isbn: "",
    title: "",
    author: "",
    category: (Array.isArray(categories) && categories[0]) || "Fiction",
    price: "",
    costPrice: "",
    stock: "",
    minStock: 5,
    maxStock: 100,
    description: "",
    publisher: "",
    publicationYear: new Date().getFullYear(),
    pages: 300,
    language: "English",
    weight: "0.5",
    dimensions: "20x13x3 cm",
    images: [],
    image: "",
  });

  const [newPublisher, setNewPublisher] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [editingPublisherId, setEditingPublisherId] = useState(null);

  const [trackingUpdate, setTrackingUpdate] = useState({
    status: "Shipped",
    note: "",
    location: "",
    courier: "",
    trackingNumber: "",
  });

  // Data states
  const [stockBooks, setStockBooks] = useState(() => {
    if (typeof window === "undefined") return initialStockBooks();
    const stored = JSON.parse(window.localStorage.getItem("stockBooks"));
    return stored || initialStockBooks();
  });

  const [stockOrders, setStockOrders] = useState(() => {
    if (typeof window === "undefined") return initialStockOrders();
    const stored = JSON.parse(window.localStorage.getItem("stockOrders"));
    return stored || initialStockOrders();
  });

  const [publishers, setPublishers] = useState(() => {
    return [];
  });

  const [bookRequests, setBookRequests] = useState(() => {
    return [];
  });
  const [supportMessages, setSupportMessages] = useState([]);
  const [replyDrafts, setReplyDrafts] = useState({});

  const computeStockStatus = useCallback((stock, minStock) => {
    const safeStock = Number.isFinite(stock) ? stock : 0;
    const safeMin = Number.isFinite(minStock) ? minStock : 0;
    if (safeStock === 0) return "Out of Stock";
    if (safeStock <= safeMin) return "Low Stock";
    return "In Stock";
  }, []);

  const normalizeBook = useCallback((book) => {
    if (!book) return null;
    const images = Array.isArray(book.images)
      ? book.images
      : book.images
        ? book.images
        : [];

    const stockValue = Number(book.stock) || 0;
    const minValue = Number(book.minStock ?? book.min_stock ?? 0);

    return {
      ...book,
      datasetBookId: book.datasetBookId ?? book.dataset_book_id ?? "",
      price: Number(book.price) || 0,
      costPrice:
        book.costPrice !== undefined
          ? Number(book.costPrice)
          : book.cost_price !== undefined
            ? Number(book.cost_price)
            : null,
      stock: stockValue,
      minStock: minValue,
      maxStock: Number(book.maxStock ?? book.max_stock ?? 0),
      status: book.status || computeStockStatus(stockValue, minValue),
      images,
      image: book.image || (Array.isArray(images) && images[0]) || "",
    };
  }, [computeStockStatus]);

  const comparePopularBooks = useCallback((left, right) => {
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
  }, []);

  const getRankedPopularBooks = useCallback((books) => {
    return [...books]
      .sort(comparePopularBooks)
      .slice(0, 12)
      .map((book, index) => ({
        ...book,
        rank: index + 1,
      }));
  }, [comparePopularBooks]);

  const salesMetricsByBookId = useMemo(
    () => calculateBookSalesMetrics(stockBooks, stockOrders),
    [stockBooks, stockOrders],
  );

  const booksWithSalesMetrics = useMemo(
    () =>
      stockBooks.map((book) => {
        const metrics = salesMetricsByBookId.get(Number(book.id)) || {
          salesThisMonth: 0,
          totalSales: 0,
          monthlyRevenue: 0,
        };

        return {
          ...book,
          salesThisMonth: metrics.salesThisMonth,
          totalSales: metrics.totalSales,
          monthlyRevenue: metrics.monthlyRevenue,
        };
      }),
    [salesMetricsByBookId, stockBooks],
  );

  const persistBooks = useCallback((books) => {
    setStockBooks(books);
    localStorage.setItem("stockBooks", JSON.stringify(books));
    window.dispatchEvent(new Event("storage"));
  }, []);

  const persistPublishers = useCallback((items) => {
    setPublishers(items);
    localStorage.setItem("publishers", JSON.stringify(items));
    window.dispatchEvent(new Event("storage"));
  }, []);

  const refreshPublishersFromApi = useCallback(async () => {
    try {
      const apiPublishers = await fetchPublishersFromApi();
      const normalized = Array.isArray(apiPublishers)
        ? apiPublishers.map((publisher) => ({
            ...publisher,
            status: publisher.status || "Active",
            booksSupplied: Number(publisher.booksSupplied || 0),
          }))
        : [];
      persistPublishers(normalized);
    } catch (error) {
      console.error("Failed to refresh publishers from API", error);
    }
  }, [persistPublishers]);

  const persistOrders = useCallback((orders) => {
    setStockOrders(orders);
    localStorage.setItem("stockOrders", JSON.stringify(orders));
    window.dispatchEvent(new Event("storage"));
  }, []);

  useEffect(() => {
    const loadBooksFromApi = async () => {
      try {
        const apiBooks = await fetchBooksFromApi();
        if (Array.isArray(apiBooks) && apiBooks.length) {
          const normalized = apiBooks.map((b) => normalizeBook(b)).filter(Boolean);
          persistBooks(normalized);
        }
      } catch (error) {
        console.error("Failed to load books from API", error);
      }
    };

    loadBooksFromApi();
  }, [normalizeBook, persistBooks]);

  const normalizeOrder = useCallback((order) => {
    const itemsArray = Array.isArray(order.items) ? order.items : [];
    const itemCount =
      order.itemCount ??
      itemsArray.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);

    return {
      ...order,
      customer: order.customer || "Customer",
      customerEmail: order.customerEmail || "",
      items: itemCount,
      itemsList: itemsArray,
      total: Number(order.total) || 0,
      status: order.status || "Processing",
      orderDate: order.orderDate || order.createdAt,
    };
  }, []);

  const normalizeBookRequest = useCallback((request) => {
    if (!request) return null;

    const normalizedStatus =
      typeof request.status === "string"
        ? request.status.charAt(0).toUpperCase() + request.status.slice(1).toLowerCase()
        : "Pending";

    return {
      ...request,
      userName: request.userFullName || request.username || "User",
      userEmail: request.userEmail || "",
      dateRequested: request.createdAt || request.dateRequested || new Date().toISOString(),
      dateUpdated: request.updatedAt || request.dateUpdated || request.createdAt || new Date().toISOString(),
      status: normalizedStatus,
    };
  }, []);

  useEffect(() => {
    const loadOrdersFromApi = async () => {
      try {
        const apiOrders = await fetchAllOrdersApi();
        if (Array.isArray(apiOrders)) {
          persistOrders(apiOrders.map(normalizeOrder));
        }
      } catch (error) {
        console.error("Failed to load orders from API", error);
      }
    };

    loadOrdersFromApi();
  }, [normalizeOrder, persistOrders]);

  const loadBookRequestsFromApi = useCallback(async () => {
    try {
      const apiRequests = await fetchBookRequestsApi();
      if (Array.isArray(apiRequests)) {
        const normalized = apiRequests.map((request) => normalizeBookRequest(request)).filter(Boolean);
        setBookRequests(normalized);
        localStorage.setItem("bookRequests", JSON.stringify(normalized));
        window.dispatchEvent(new Event("storage"));
      }
    } catch (error) {
      console.error("Failed to load book requests from API", error);
    }
  }, [normalizeBookRequest]);

  useEffect(() => {
    void loadBookRequestsFromApi();
  }, [loadBookRequestsFromApi]);

  useEffect(() => {
    void refreshPublishersFromApi();
  }, [refreshPublishersFromApi]);

  const loadAllData = useCallback(() => {
    if (typeof window === "undefined") return;

    const storedBooks = JSON.parse(window.localStorage.getItem("stockBooks"));
    if (storedBooks) setStockBooks(storedBooks);

    const storedOrders = JSON.parse(window.localStorage.getItem("stockOrders"));
    if (storedOrders) setStockOrders(storedOrders);

    const storedAuthors = JSON.parse(window.localStorage.getItem("authors"));
    if (storedAuthors)
      setAuthors(Array.isArray(storedAuthors) ? storedAuthors : []);
  }, []);

  const handleStorageChange = useCallback(
    (e) => {
      if (typeof window === "undefined") return;

      if (
        e.key === "stockBooks" ||
        e.key === "stockOrders" ||
        e.key === "authors"
      ) {
        loadAllData();
      }

      if (e.key === SUPPORT_MESSAGES_CACHE_KEY) {
        void loadSupportMessages().then((messages) => setSupportMessages(messages));
      }

      if (e.key === "currentUser") {
        try {
          const updatedUser = JSON.parse(
            window.localStorage.getItem("currentUser"),
          );
          setCurrentUser(updatedUser);
        } catch (error) {
          console.error("Failed to parse currentUser from storage", error);
          setCurrentUser(null);
        }
      }
    },
    [loadAllData, setCurrentUser],
  );

  useEffect(() => {
    const handleBookRequestsUpdated = () => {
      void loadBookRequestsFromApi();
    };

    window.addEventListener("book-requests-updated", handleBookRequestsUpdated);
    return () => {
      window.removeEventListener("book-requests-updated", handleBookRequestsUpdated);
    };
  }, [loadBookRequestsFromApi]);

  useEffect(() => {
    const refreshSupportMessages = () => {
      void loadSupportMessages().then((messages) => setSupportMessages(messages));
    };

    const handleStorageUpdate = (event) => {
      if (event.key === SUPPORT_MESSAGES_CACHE_KEY) {
        refreshSupportMessages();
      }
    };

    const handleFocus = () => {
      refreshSupportMessages();
    };

    const pollId = window.setInterval(refreshSupportMessages, 15000);

    window.addEventListener(getSupportMessagesUpdatedEventName(), refreshSupportMessages);
    window.addEventListener("storage", handleStorageUpdate);
    window.addEventListener("focus", handleFocus);
    void loadSupportMessages().then((messages) => setSupportMessages(messages));
    return () => {
      window.clearInterval(pollId);
      window.removeEventListener(getSupportMessagesUpdatedEventName(), refreshSupportMessages);
      window.removeEventListener("storage", handleStorageUpdate);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  useEffect(() => {
    if (activeTab !== "messages") return;

    void loadSupportMessages().then((messages) => setSupportMessages(messages));
  }, [activeTab]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    if (!currentUser) {
      navigate("/login");
      return undefined;
    }

    if (
      currentUser.role !== "stock" &&
      currentUser.role !== "stock-manager" &&
      currentUser.role !== "admin"
    ) {
      alert("Access denied. Stock manager or admin privileges required.");
      navigate("/");
      return undefined;
    }

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [currentUser, navigate, handleStorageChange]);

  // Calculate statistics
  const inventoryStats = calculateInventoryStats(booksWithSalesMetrics, stockOrders);
  const orderStats = calculateOrderStats(stockOrders);
  const requestStats = calculateRequestStats(bookRequests);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleTabChange = (tab) => {
    navigate(`${location.pathname}?tab=${tab}`);
  };

  const handleReplyDraftChange = (messageId, value) => {
    setReplyDrafts((prev) => ({
      ...prev,
      [messageId]: value,
    }));
  };

  const handleReplyMessage = async (messageId) => {
    const replyText = replyDrafts[messageId] || "";
    const reply = await addSupportReply(messageId, replyText, {
      name: currentUser?.name || currentUser?.fullName || "Stock Manager",
      role: currentUser?.role || "stock",
    });

    if (!reply) {
      showNotification("Please write a reply before sending.", "info");
      return;
    }

    setReplyDrafts((prev) => ({
      ...prev,
      [messageId]: "",
    }));
    showNotification("Reply sent to the customer.", "success");
  };

  const resetPublisherForm = () => {
    setNewPublisher({
      name: "",
      email: "",
      phone: "",
      address: "",
    });
    setEditingPublisherId(null);
  };

  const readFileAsDataURL = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleInputChange = (setter) => async (e) => {
    const { name, value, type, checked, files } = e.target;

    if (name === "images" && files) {
      const fileList = Array.from(files);
      const dataUrls = await Promise.all(fileList.map(readFileAsDataURL));
      setter((prev) => ({
        ...prev,
        images: dataUrls,
        image: dataUrls[0] || "",
      }));
      return;
    }

    setter((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNewAuthor = (author) => {
    setAuthors((prev) => {
      const next = [...prev, author];
      if (typeof window !== "undefined") {
        window.localStorage.setItem("authors", JSON.stringify(next));
      }
      return next;
    });
  };

  const handleEditAuthor = (author) => {
    const key = author.id || author;
    setAuthors((prev) => {
      const next = prev.map((a) => ((a.id || a) === key ? author : a));
      if (typeof window !== "undefined") {
        window.localStorage.setItem("authors", JSON.stringify(next));
      }
      return next;
    });
  };

  const handleDeleteAuthor = (author) => {
    const key = author.id || author;
    setAuthors((prev) => {
      const next = prev.filter((a) => (a.id || a) !== key);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("authors", JSON.stringify(next));
      }
      return next;
    });
  };

  const resetBookForm = () => {
    setNewBook({
      datasetBookId: "",
      isbn: "",
      title: "",
      author: "",
      category: categories[0] || defaultCategories[0],
      price: "",
      costPrice: "",
      stock: "",
      minStock: 5,
      maxStock: 100,
      description: "",
      publisher: "",
      publicationYear: new Date().getFullYear(),
      pages: 300,
      language: "English",
      weight: "0.5",
      dimensions: "20x13x3 cm",
      images: [],
      image: "",
    });
    setEditingBookId(null);
  };

  const openAddBookModal = () => {
    resetBookForm();
    setShowAddBookModal(true);
  };

  const handleSaveCategory = (name, previousName = null) => {
    const trimmed = (name || "").trim();
    if (!trimmed) return;

    setCategories((prev) => {
      let next = [...prev];

      if (previousName && previousName !== trimmed) {
        // Rename
        if (!prev.includes(previousName)) return prev;
        if (prev.includes(trimmed)) {
          showNotification("Category already exists", "info");
          return prev;
        }
        next = prev.map((cat) => (cat === previousName ? trimmed : cat));
      } else if (!prev.includes(trimmed)) {
        // Add
        next = [...prev, trimmed];
      }

      localStorage.setItem("categories", JSON.stringify(next));
      setNewBook((book) => ({ ...book, category: trimmed }));
      return next;
    });
  };

  const handleDeleteCategory = (name) => {
    const trimmed = (name || "").trim();
    if (!trimmed) return;

    setCategories((prev) => {
      const next = prev.filter((cat) => cat !== trimmed);
      if (!next.length) {
        const fallback = defaultCategories[0];
        localStorage.setItem("categories", JSON.stringify([fallback]));
        setNewBook((book) => ({ ...book, category: fallback }));
        return [fallback];
      }

      localStorage.setItem("categories", JSON.stringify(next));
      setNewBook((book) => ({ ...book, category: next[0] }));
      return next;
    });
  };

  const handleAddBook = async (e) => {
    e.preventDefault();

    if (
      !newBook.isbn ||
      !newBook.title ||
      !newBook.author ||
      !newBook.price ||
      !newBook.stock
    ) {
      showNotification("Please fill in all required fields correctly", "error");
      return;
    }

    const stockValue = parseInt(newBook.stock, 10);
    const minValue = parseInt(newBook.minStock, 10);
    const status = computeStockStatus(stockValue, minValue);

    const payload = {
      datasetBookId: newBook.datasetBookId,
      isbn: newBook.isbn,
      title: newBook.title,
      author: newBook.author,
      category: newBook.category,
      price: parseFloat(newBook.price),
      costPrice:
        newBook.costPrice !== undefined && newBook.costPrice !== ""
          ? parseFloat(newBook.costPrice)
          : parseFloat(newBook.price) * 0.6,
      stock: stockValue,
      minStock: minValue,
      maxStock: parseInt(newBook.maxStock, 10),
      status,
      description: newBook.description,
      publisher: newBook.publisher,
      publicationYear: parseInt(newBook.publicationYear, 10),
      pages: parseInt(newBook.pages, 10),
      language: newBook.language,
      weight: newBook.weight,
      dimensions: newBook.dimensions,
      images: newBook.images || [],
      image:
        newBook.image ||
        (Array.isArray(newBook.images) ? newBook.images[0] : ""),
      featured: false,
      salesThisMonth: 0,
      totalSales: 0,
    };

    try {
      const created = await createBookApi(payload);
      const normalized = normalizeBook(created);
      const updatedBooks = [...stockBooks, normalized];
      persistBooks(updatedBooks);
      await refreshPublishersFromApi();

      resetBookForm();
      setShowAddBookModal(false);
      showNotification("Book added successfully!", "success");
    } catch (error) {
      showNotification(error.message || "Failed to add book", "danger");
    }
  };

  const handleUpdateBook = async (e) => {
    e.preventDefault();

    if (!editingBookId) return;

    if (
      !newBook.isbn ||
      !newBook.title ||
      !newBook.author ||
      !newBook.price ||
      !newBook.stock
    ) {
      showNotification("Please fill in all required fields correctly", "error");
      return;
    }

    const stockValue = parseInt(newBook.stock, 10);
    const minValue = parseInt(newBook.minStock, 10);
    const status = computeStockStatus(stockValue, minValue);

    const payload = {
      datasetBookId: newBook.datasetBookId,
      isbn: newBook.isbn,
      title: newBook.title,
      author: newBook.author,
      category: newBook.category,
      price: parseFloat(newBook.price),
      costPrice:
        newBook.costPrice !== undefined && newBook.costPrice !== ""
          ? parseFloat(newBook.costPrice)
          : parseFloat(newBook.price) * 0.6,
      stock: stockValue,
      minStock: minValue,
      maxStock: parseInt(newBook.maxStock, 10),
      status,
      description: newBook.description,
      publisher: newBook.publisher,
      publicationYear: parseInt(newBook.publicationYear, 10),
      pages: parseInt(newBook.pages, 10),
      language: newBook.language,
      weight: newBook.weight,
      dimensions: newBook.dimensions,
      images: newBook.images || [],
      image:
        newBook.image ||
        (Array.isArray(newBook.images) && newBook.images[0]) ||
        "",
    };

    try {
      const updated = await updateBookApi(editingBookId, payload);
      const normalized = normalizeBook(updated);
      const updatedBooks = stockBooks.map((book) =>
        book.id === editingBookId ? normalized : book,
      );

      persistBooks(updatedBooks);
      await refreshPublishersFromApi();
      resetBookForm();
      setShowAddBookModal(false);
      showNotification("Book updated successfully!", "success");
    } catch (error) {
      showNotification(error.message || "Failed to update book", "danger");
    }
  };

  const handleAddPublisher = (e) => {
    e.preventDefault();

    if (!newPublisher.name || !newPublisher.email) {
      showNotification("Please fill in all required fields", "error");
      return;
    }

    const submit = async () => {
      try {
        if (editingPublisherId) {
          const updatedPublisher = await updatePublisherApi(editingPublisherId, {
            name: newPublisher.name,
            email: newPublisher.email,
            phone: newPublisher.phone,
            address: newPublisher.address,
          });

          const updatedPublishers = publishers.map((publisher) =>
            publisher.id === editingPublisherId
              ? {
                  ...publisher,
                  ...updatedPublisher,
                  status: publisher.status || "Active",
                }
              : publisher,
          );
          persistPublishers(updatedPublishers);
          showNotification("Publisher updated successfully!", "success");
        } else {
          const createdPublisher = await createPublisherApi({
            name: newPublisher.name,
            email: newPublisher.email,
            phone: newPublisher.phone,
            address: newPublisher.address,
          });

          persistPublishers([
            ...publishers,
            {
              ...createdPublisher,
              status: "Active",
            },
          ]);
          showNotification("Publisher added successfully!", "success");
        }

        resetPublisherForm();
        setShowAddPublisherModal(false);
        handleTabChange("publishers");
      } catch (error) {
        showNotification(error.message || "Failed to save publisher", "danger");
      }
    };

    void submit();
  };

  const handleEditPublisher = (publisher) => {
    setNewPublisher({
      name: publisher.name || "",
      email: publisher.email || "",
      phone: publisher.phone || "",
      address: publisher.address || "",
    });
    setEditingPublisherId(publisher.id);
    setShowAddPublisherModal(true);
  };

  const handleCloseAddPublisher = () => {
    resetPublisherForm();
    setShowAddPublisherModal(false);
  };

  const handleDeleteBook = (bookId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this book from inventory?",
      )
    ) {
      const remove = async () => {
        try {
          await deleteBookApi(bookId);
          const updatedBooks = stockBooks.filter((book) => book.id !== bookId);
          persistBooks(updatedBooks);
          await refreshPublishersFromApi();
          showNotification("Book deleted successfully", "success");
        } catch (error) {
          showNotification(error.message || "Failed to delete book", "danger");
        }
      };

      remove();
    }
  };

  const handleEditBook = (bookId) => {
    const book = stockBooks.find((b) => b.id === bookId);
    if (book) {
      setNewBook({
        datasetBookId: book.datasetBookId || "",
        isbn: book.isbn,
        title: book.title,
        author: book.author,
        category: book.category,
        price: book.price.toString(),
        costPrice: book.costPrice.toString(),
        stock: book.stock.toString(),
        minStock: book.minStock,
        maxStock: book.maxStock,
        description: book.description || "",
        publisher: book.publisher || "",
        publicationYear: book.publicationYear || new Date().getFullYear(),
        pages: book.pages || 300,
        language: book.language || "English",
        weight: book.weight || "0.5",
        dimensions: book.dimensions || "20x13x3 cm",
        images: book.images || (book.image ? [book.image] : []),
        image: book.image || (Array.isArray(book.images) ? book.images[0] : ""),
      });
      setEditingBookId(bookId);
      setShowAddBookModal(true);
    }
  };

  const handleRestockBook = (bookId, quantity) => {
    const target = stockBooks.find((b) => b.id === bookId);
    if (!target) return;

    const newStock = target.stock + quantity;
    const status = computeStockStatus(newStock, target.minStock);

    const update = async () => {
      try {
        const updated = await updateBookApi(bookId, {
          stock: newStock,
          status,
        });
        const normalized = normalizeBook(updated);
        const updatedBooks = stockBooks.map((book) =>
          book.id === bookId ? normalized : book,
        );
        persistBooks(updatedBooks);
        showNotification(`Restocked ${quantity} items`, "success");
      } catch (error) {
        showNotification(error.message || "Failed to restock", "danger");
      }
    };

    update();
  };

  const handleViewOrder = (orderId) => {
    const order = stockOrders.find((o) => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
      showNotification(`Viewing order: ${orderId}`, "info");
    }
  };

  const handleShipOrder = (orderId) => {
    if (window.confirm(`Mark order ${orderId} as shipped?`)) {
      const update = async () => {
        try {
          const updated = await updateOrderStatusApi(orderId, "Shipped");
          const normalized = normalizeOrder(updated);
          const updatedOrders = stockOrders.map((order) =>
            String(order.id) === String(orderId) ? normalized : order,
          );
          persistOrders(updatedOrders);
          showNotification(`Order ${orderId} marked as shipped`, "success");
        } catch (error) {
          showNotification(error.message || "Failed to update order", "danger");
        }
      };

      void update();
    }
  };

  const handleUpdateTracking = (orderId) => {
    const order = stockOrders.find((o) => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
      setTrackingUpdate({
        status: order.status === "Processing" ? "Shipped" : order.status,
        note: "",
        location: "",
        courier: order.courier || "",
        trackingNumber: order.trackingNumber || "",
      });
      setShowTrackingModal(true);
    }
  };

  const handleSaveTracking = () => {
    if (!trackingUpdate.status) {
      showNotification("Please select a status", "error");
      return;
    }

    const save = async () => {
      try {
        const updated = await updateOrderTrackingApi(selectedOrder.id, {
          status: trackingUpdate.status,
          note: trackingUpdate.note,
          location: trackingUpdate.location,
          courier: trackingUpdate.courier,
          trackingNumber: trackingUpdate.trackingNumber,
          updatedBy: currentUser?.name,
        });
        const normalized = normalizeOrder(updated);

        const updatedOrders = stockOrders.map((order) =>
          String(order.id) === String(selectedOrder.id) ? normalized : order,
        );

        persistOrders(updatedOrders);
        setShowTrackingModal(false);
        showNotification("Tracking updated successfully!", "success");
      } catch (error) {
        showNotification(error.message || "Failed to update tracking", "danger");
      }
    };

    void save();
  };

  const handleContactPublisher = (publisherId) => {
    const publisher = publishers.find((p) => p.id === publisherId);
    if (publisher) {
      window.location.href = `mailto:${publisher.email}`;
    }
  };

  const handleDeletePublisher = (publisherId) => {
    if (window.confirm("Are you sure you want to delete this publisher?")) {
      const remove = async () => {
        try {
          await deletePublisherApi(publisherId);
          const updatedPublishers = publishers.filter((p) => p.id !== publisherId);
          persistPublishers(updatedPublishers);
          showNotification("Publisher deleted successfully", "success");
        } catch (error) {
          showNotification(error.message || "Failed to delete publisher", "danger");
        }
      };

      void remove();
    }
  };

  const handleViewRequestDetails = (requestId) => {
    const request = bookRequests.find((r) => r.id === requestId);
    if (request) {
      setSelectedRequest(request);
      setstock_managerNotes(request.stock_managerNotes || "");
      setShowRequestDetailsModal(true);
    }
  };

  const handleApproveRequest = (requestId, notes = "") => {
    const approve = async () => {
      try {
        await updateBookRequestStatusApi(requestId, "Approved");
        await loadBookRequestsFromApi();
        setShowRequestDetailsModal(false);
        showNotification("Request approved successfully!", "success");
      } catch (error) {
        showNotification(error.message || "Failed to approve request", "danger");
      }
    };

    void approve();
  };

  const handleRejectRequest = (requestId, notes = "") => {
    const reject = async () => {
      try {
        await updateBookRequestStatusApi(requestId, "Rejected");
        await loadBookRequestsFromApi();
        setShowRequestDetailsModal(false);
        showNotification("Request rejected", "warning");
      } catch (error) {
        showNotification(error.message || "Failed to reject request", "danger");
      }
    };

    void reject();
  };

  const toggleFeaturedBook = (bookId) => {
    const target = stockBooks.find((b) => b.id === bookId);
    if (!target) return;

    const nextFeatured = !target.featured;

    const toggle = async () => {
      try {
        const updated = await updateBookApi(bookId, { featured: nextFeatured });
        const normalized = normalizeBook(updated);
        const updatedBooks = stockBooks.map((book) =>
          book.id === bookId ? normalized : book,
        );
        persistBooks(updatedBooks);

        showNotification(
          nextFeatured
            ? "Book marked as featured for home page"
            : "Book removed from featured",
          "success",
        );
      } catch (error) {
        showNotification(error.message || "Failed to update book", "danger");
      }
    };

    toggle();
  };

  const handlePrintReport = () => {
    const printContent = document.querySelector(".report-content-container");
    const printWindow = window.open("", "_blank", "width=800,height=600");

    if (printContent && printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Stock Manager Report</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #333; }
              .report-section { margin-bottom: 30px; }
              .table { width: 100%; border-collapse: collapse; }
              .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              .table th { background-color: #f5f5f5; }
              .total-row { font-weight: bold; background-color: #f9f9f9; }
            </style>
          </head>
          <body>
            <h1>Stock Manager Report</h1>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    } else {
      showNotification("No report content found to print", "warning");
    }
  };

  const handleExportReport = () => {
    let csvContent = "Stock Manager Report\n";
    csvContent += `Generated on: ${new Date().toLocaleDateString()}\n\n`;

    // Stock Summary
    csvContent += "Stock Summary\n";
    csvContent += `Total Books in Inventory,${inventoryStats.totalBooks}\n`;
    csvContent += `Low Stock Items,${inventoryStats.lowStockItems}\n`;
    csvContent += `Out of Stock Items,${inventoryStats.outOfStockBooks}\n\n`;

    // Sales Summary
    csvContent += "Sales Summary\n";
    csvContent += `Total Orders,${orderStats.total}\n`;
    csvContent += `Orders Processing,${orderStats.processing}\n`;
    csvContent += `Orders Shipped,${orderStats.shipped}\n`;
    csvContent += `Orders Delivered,${orderStats.delivered}\n\n`;

    // Books Inventory
    csvContent += "Books Inventory\n";
    csvContent += "Title,Author,Category,Price,Stock,Status\n";
    stockBooks.forEach((book) => {
      csvContent += `"${book.title}","${book.author}","${book.category}",${book.price},${book.stock},"${book.status}"\n`;
    });

    // Create a blob and download link
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stock-manager-report-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    showNotification("Report exported successfully as CSV", "success");
  };

  const renderActiveTab = () => {
    const stats = {
      inventory: inventoryStats,
      orders: orderStats,
      requests: requestStats,
    };

    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardTab
            stats={stats}
            onAddBook={openAddBookModal}
            onAddPublisher={() => {
              resetPublisherForm();
              setShowAddPublisherModal(true);
            }}
            onViewRequests={() => handleTabChange("book-requests")}
            onViewReports={() => handleTabChange("reports")}
            onManagePopularBooks={() => handleTabChange("popular-books")}
            onViewOrders={() => handleTabChange("orders")}
            orders={stockOrders}
            lowStockBooks={stockBooks.filter(
              (book) =>
                book.status === "Low Stock" || book.status === "Out of Stock",
            )}
            onViewOrder={handleViewOrder}
            onUpdateTracking={handleUpdateTracking}
            onRestockBook={handleRestockBook}
          />
        );
      case "inventory":
        return (
          <InventoryTab
            stats={inventoryStats}
            books={sortBooks(filterBooks(booksWithSalesMetrics, searchQuery), sortConfig)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSort={handleSort}
            sortConfig={sortConfig}
            onAddBook={openAddBookModal}
            onEditBook={handleEditBook}
            onDeleteBook={handleDeleteBook}
            onRestockBook={handleRestockBook}
            onToggleFeatured={toggleFeaturedBook}
          />
        );
      case "orders":
        return (
          <OrdersTab
            stats={orderStats}
            orders={stockOrders}
            onViewOrder={handleViewOrder}
            onShipOrder={handleShipOrder}
            onUpdateTracking={handleUpdateTracking}
          />
        );
      case "reports":
        return (
          <ReportsTab
            inventoryStats={inventoryStats}
            orderStats={orderStats}
            stockBooks={booksWithSalesMetrics}
            onPrint={handlePrintReport}
            onExport={handleExportReport}
          />
        );
      case "publishers":
        return (
          <PublishersTab
            publishers={publishers}
            onAddPublisher={() => {
              resetPublisherForm();
              setShowAddPublisherModal(true);
            }}
            onEditPublisher={handleEditPublisher}
            onContactPublisher={handleContactPublisher}
            onDeletePublisher={handleDeletePublisher}
          />
        );
      case "book-requests":
        return (
          <BookRequestsTab
            stats={requestStats}
            requests={bookRequests}
            onViewRequestDetails={handleViewRequestDetails}
            onApproveRequest={handleApproveRequest}
            onRejectRequest={handleRejectRequest}
            onChangeTab={handleTabChange}
          />
        );
      case "popular-books":
        return (
          <PopularBooksTab
            popularBooks={getRankedPopularBooks(booksWithSalesMetrics)}
            featuredBooks={booksWithSalesMetrics.filter((book) => book.featured)}
            inventoryStats={inventoryStats}
            onEditBook={handleEditBook}
            onRestockBook={handleRestockBook}
            onToggleFeatured={toggleFeaturedBook}
            onChangeTab={handleTabChange}
          />
        );
      case "messages":
        return (
          <SupportMessagesTab
            messages={supportMessages}
            replyDrafts={replyDrafts}
            onReplyDraftChange={handleReplyDraftChange}
            onReplyMessage={handleReplyMessage}
          />
        );
      default:
        return (
          <DashboardTab
            stats={stats}
            onAddBook={openAddBookModal}
            onAddPublisher={() => {
              resetPublisherForm();
              setShowAddPublisherModal(true);
            }}
            onViewRequests={() => handleTabChange("book-requests")}
            onViewReports={() => handleTabChange("reports")}
            onManagePopularBooks={() => handleTabChange("popular-books")}
            onViewOrders={() => handleTabChange("orders")}
            orders={stockOrders}
            lowStockBooks={stockBooks.filter(
              (book) =>
                book.status === "Low Stock" || book.status === "Out of Stock",
            )}
            onViewOrder={handleViewOrder}
            onUpdateTracking={handleUpdateTracking}
            onRestockBook={handleRestockBook}
          />
        );
    }
  };

  if (!currentUser) {
    return (
      <div className="stock-manager">
        <StockManagerHeader />
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading stock manager...</span>
          </div>
          <p className="mt-3">Loading stock manager...</p>
        </div>
        <StockManagerFooter />
      </div>
    );
  }

  return (
    <div className="stock-manager">
      <StockManagerHeader />

      <div className="container-fluid mt-4">
        <div className="row">
          <Sidebar
            activeTab={activeTab}
            onTabChange={handleTabChange}
            inventoryStats={inventoryStats}
            orderStats={orderStats}
            requestStats={requestStats}
            supportMessageCount={getUnreadSupportMessageCount()}
          />

          <div className="col-lg-10">
            <div className="tab-content">{renderActiveTab()}</div>
          </div>
        </div>
      </div>

      <StockManagerFooter />
      {editingBookId ? (
        <EditBookModal
          show={showAddBookModal}
          onClose={() => {
            setShowAddBookModal(false);
            resetBookForm();
          }}
          newBook={newBook}
          onInputChange={handleInputChange(setNewBook)}
          onSubmit={handleUpdateBook}
          categories={categories}
          onSaveCategory={handleSaveCategory}
          onDeleteCategory={handleDeleteCategory}
          authors={authors}
          onNewAuthor={handleNewAuthor}
          onEditAuthor={handleEditAuthor}
          onDeleteAuthor={handleDeleteAuthor}
          publishers={publishers}
        />
      ) : (
        <AddBookModal
          show={showAddBookModal}
          onClose={() => {
            setShowAddBookModal(false);
            resetBookForm();
          }}
          newBook={newBook}
          onInputChange={handleInputChange(setNewBook)}
          onSubmit={handleAddBook}
          categories={categories}
          onSaveCategory={handleSaveCategory}
          onDeleteCategory={handleDeleteCategory}
          authors={authors}
          onNewAuthor={handleNewAuthor}
          onEditAuthor={handleEditAuthor}
          onDeleteAuthor={handleDeleteAuthor}
          publishers={publishers}
        />
      )}

      <AddPublisherModal
        show={showAddPublisherModal}
        onClose={handleCloseAddPublisher}
        newPublisher={newPublisher}
        onInputChange={handleInputChange(setNewPublisher)}
        onSubmit={handleAddPublisher}
        isEditing={!!editingPublisherId}
      />

      <TrackingModal
        show={showTrackingModal}
        onClose={() => setShowTrackingModal(false)}
        selectedOrder={selectedOrder}
        trackingUpdate={trackingUpdate}
        onTrackingUpdate={setTrackingUpdate}
        onSave={handleSaveTracking}
        currentUser={currentUser}
      />

      <RequestDetailsModal
        show={showRequestDetailsModal}
        onClose={() => setShowRequestDetailsModal(false)}
        selectedRequest={selectedRequest}
        stock_managerNotes={stock_managerNotes}
        onNotesChange={setstock_managerNotes}
        onApprove={handleApproveRequest}
        onReject={handleRejectRequest}
        currentUser={currentUser}
      />
    </div>
  );
};

export default StockManager;
