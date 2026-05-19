// Stock manager utility functions for API access, formatting, filters, and metrics.
const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// Sends JSON requests to the stock manager backend APIs.
const handleApi = async (path, options = {}) => {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error || data?.message || "Request failed";
    throw new Error(msg);
  }
  return data;
};

// Fetches all books for stock manager screens.
export const fetchBooksFromApi = async () => {
  const data = await handleApi("/api/books");
  return data.books || [];
};

// Fetches one book by ID for editing or inspection.
export const fetchBookByIdApi = async (bookId) => {
  const data = await handleApi(`/api/books/${bookId}`);
  return data.book || null;
};

// Creates a new book through the backend API.
export const createBookApi = async (payload) => {
  const data = await handleApi("/api/books", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data.book;
};

// Updates an existing book through the backend API.
export const updateBookApi = async (bookId, payload) => {
  const data = await handleApi(`/api/books/${bookId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return data.book;
};

// Deletes a book through the backend API.
export const deleteBookApi = async (bookId) => {
  await handleApi(`/api/books/${bookId}`, { method: "DELETE" });
  return true;
};

// Fetches the complete order list for stock management.
export const fetchAllOrdersApi = async () => {
  const data = await handleApi("/api/orders/all");
  return data.orders || [];
};

// Updates the fulfillment status for an order.
export const updateOrderStatusApi = async (orderId, status) => {
  const data = await handleApi(`/api/orders/${orderId}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
  return data.order;
};

// Updates tracking details for an order.
export const updateOrderTrackingApi = async (orderId, payload) => {
  const data = await handleApi(`/api/orders/${orderId}/tracking`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return data.order;
};

// Fetches all publishers for stock manager screens.
export const fetchPublishersFromApi = async () => {
  const data = await handleApi("/api/publishers");
  return data.publishers || [];
};

// Creates a publisher through the backend API.
export const createPublisherApi = async (payload) => {
  const data = await handleApi("/api/publishers", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data.publisher;
};

// Updates a publisher through the backend API.
export const updatePublisherApi = async (publisherId, payload) => {
  const data = await handleApi(`/api/publishers/${publisherId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return data.publisher;
};

// Deletes a publisher through the backend API.
export const deletePublisherApi = async (publisherId) => {
  await handleApi(`/api/publishers/${publisherId}`, { method: "DELETE" });
  return true;
};

// Currency formatter for LKR
// Formats currency in LKR for stock manager displays.
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Helper function to convert USD to LKR (approximate rate)
// Converts USD amounts to an approximate LKR value.
export const usdToLkr = (usd) => usd * 325;

// Stock status helper functions
// Maps book stock status to a Bootstrap badge class.
export const getStockStatusClass = (status) => {
  const classes = {
    "In Stock": "badge bg-success",
    "Low Stock": "badge bg-warning text-dark",
    "Out of Stock": "badge bg-danger",
  };
  return classes[status] || "badge bg-secondary";
};

// Maps order status to a Bootstrap badge class.
export const getOrderStatusClass = (status) => {
  const classes = {
    Processing: "badge bg-warning text-dark",
    Shipped: "badge bg-info text-dark",
    Delivered: "badge bg-success",
    "Out for Delivery": "badge bg-primary",
    Returned: "badge bg-dark",
  };
  return classes[status] || "badge bg-secondary";
};

// Maps request status to a Bootstrap badge class.
export const getRequestStatusClass = (status) => {
  const classes = {
    Pending: "badge bg-warning text-dark",
    Approved: "badge bg-success",
    Rejected: "badge bg-danger",
    Fulfilled: "badge bg-info text-dark",
  };
  return classes[status] || "badge bg-secondary";
};

// Returns the badge class for a publisher status.
export const getPublisherStatusClass = (status) => {
  return status === "Active" ? "badge bg-success" : "badge bg-secondary";
};

// Calculate stock percentage
// Calculates how full a book's stock is relative to max stock.
export const getStockPercentage = (book) => {
  return (book.stock / book.maxStock) * 100;
};

// Filter books by search query
// Filters books by title, author, ISBN, or category.
export const filterBooks = (books, searchQuery) => {
  if (!searchQuery) return books;

  const query = searchQuery.toLowerCase();
  return books.filter(
    (book) =>
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.isbn.includes(query) ||
      book.category.toLowerCase().includes(query)
  );
};

// Sort books
// Sorts books by the selected column and direction.
export const sortBooks = (books, sortConfig) => {
  if (!sortConfig.key) return books;

  return [...books].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });
};

// Calculate statistics
// Aggregates sales metrics for books and orders.
export const calculateBookSalesMetrics = (stockBooks, stockOrders = []) => {
  const metricsByBookId = new Map(
    stockBooks.map((book) => [Number(book?.id), {
      salesThisMonth: 0,
      totalSales: 0,
      monthlyRevenue: 0,
    }]),
  );

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  for (const order of stockOrders) {
    const orderDate = new Date(order?.createdAt || order?.orderDate || null);
    const isCurrentMonth =
      !Number.isNaN(orderDate.getTime()) &&
      orderDate.getMonth() === currentMonth &&
      orderDate.getFullYear() === currentYear;

    const items = Array.isArray(order?.itemsList)
      ? order.itemsList
      : Array.isArray(order?.items)
        ? order.items
        : [];

    for (const item of items) {
      const bookId = Number(item?.bookId ?? item?.book_id);
      const quantity = Number(item?.quantity) || 0;
      if (!bookId || quantity <= 0 || !metricsByBookId.has(bookId)) continue;

      const entry = metricsByBookId.get(bookId);
      entry.totalSales += quantity;

      if (isCurrentMonth) {
        entry.salesThisMonth += quantity;
        const lineTotal = Number(item?.lineTotal ?? item?.line_total);
        entry.monthlyRevenue += Number.isFinite(lineTotal)
          ? lineTotal
          : (Number(item?.unitPrice ?? item?.unit_price) || 0) * quantity;
      }
    }
  }

  return metricsByBookId;
};

// Summarizes inventory health and profit metrics.
export const calculateInventoryStats = (stockBooks, stockOrders = []) => {
  const isLowStockBook = (book) => {
    const stock = Number(book?.stock) || 0;
    const minStock = Number(book?.minStock ?? book?.min_stock ?? 0);

    if (stock <= 0) return false;
    if (String(book?.status || "").toLowerCase() === "low stock") return true;
    if (stock < 10) return true;
    return Number.isFinite(minStock) && minStock > 0 && stock <= minStock;
  };

  const booksById = new Map(stockBooks.map((book) => [Number(book?.id), book]));
  const salesMetricsByBookId = calculateBookSalesMetrics(stockBooks, stockOrders);

  const orderSales = stockOrders.flatMap((order) => {
    const items = Array.isArray(order?.itemsList)
      ? order.itemsList
      : Array.isArray(order?.items)
        ? order.items
        : [];

    return items.map((item) => {
      const quantity = Number(item?.quantity) || 0;
      const bookId = Number(item?.bookId ?? item?.book_id ?? 0);
      const book = booksById.get(bookId);
      const unitPrice = Number(item?.unitPrice ?? item?.unit_price) || 0;
      const costPrice = Number(
        book?.costPrice ?? book?.cost_price ?? item?.costPrice ?? item?.cost_price ?? 0,
      ) || 0;

      return { quantity, unitPrice, costPrice };
    });
  });

  const totalSalesCount = [...salesMetricsByBookId.values()].reduce(
    (sum, item) => sum + item.totalSales,
    0,
  );

  const totalMonthlySales = [...salesMetricsByBookId.values()].reduce(
    (sum, item) => sum + item.salesThisMonth,
    0,
  );

  const totalProfitEarned = orderSales.reduce(
    (sum, item) => sum + ((item.unitPrice - item.costPrice) * item.quantity),
    0,
  );

  return {
    totalBooks: stockBooks.length,
    inStockBooks: stockBooks.filter((book) => book.status === "In Stock").length,
    lowStockBooks: stockBooks.filter((book) => isLowStockBook(book)).length,
    outOfStockBooks: stockBooks.filter((book) => book.status === "Out of Stock").length,
    lowStockItems: stockBooks.filter((book) => isLowStockBook(book)).length,
    totalStockValue: stockBooks.reduce((sum, book) => sum + book.price * book.stock, 0),
    totalCostValue: stockBooks.reduce((sum, book) => sum + (book.costPrice || 0) * book.stock, 0),
    potentialProfit: stockBooks.reduce((sum, book) => sum + ((book.price || 0) - (book.costPrice || 0)) * book.stock, 0),
    totalSalesCount,
    totalProfitEarned,
    featuredBooks: stockBooks.filter((book) => book.featured).length,
    totalMonthlySales,
  };
};

// Summarizes order status and revenue metrics.
export const calculateOrderStats = (stockOrders) => {
  const normalizeStatus = (status) => String(status || "").toLowerCase();

  return {
    total: stockOrders.length,
    processing: stockOrders.filter((order) => {
      const status = normalizeStatus(order.status);
      return status === "processing" || status === "pending";
    }).length,
    shipped: stockOrders.filter((order) => normalizeStatus(order.status) === "shipped").length,
    delivered: stockOrders.filter((order) => normalizeStatus(order.status) === "delivered").length,
    totalRevenue: stockOrders.reduce((sum, order) => sum + order.total, 0),
    avgOrderValue: stockOrders.length > 0
      ? stockOrders.reduce((sum, order) => sum + order.total, 0) / stockOrders.length
      : 0,
  };
};

// Summarizes request status metrics.
export const calculateRequestStats = (bookRequests) => {
  return {
    total: bookRequests.length,
    pending: bookRequests.filter((req) => req.status === "Pending").length,
    approved: bookRequests.filter((req) => req.status === "Approved").length,
    rejected: bookRequests.filter((req) => req.status === "Rejected").length,
    fulfilled: bookRequests.filter((req) => req.status === "Fulfilled").length,
  };
};

// Show notification
// Displays a temporary Bootstrap notification.
export const showNotification = (message, type) => {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = `alert alert-${type} position-fixed`;
  notification.style.cssText = `
      top: 80px;
      right: 20px;
      z-index: 9999;
      min-width: 300px;
  `;
  notification.textContent = message;

  document.body.appendChild(notification);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.remove();
  }, 3000);
};

// Initial data
// Returns seeded stock book data for the manager views.
export const initialStockBooks = () => {
  return [
    {
      id: 1,
      isbn: "978-0525559474",
      title: "The Midnight Library",
      author: "Matt Haig",
      category: "Fiction",
      price: 4000.00,
      costPrice: 3500.00,
      stock: 15,
      minStock: 5,
      maxStock: 50,
      status: "In Stock",
      publisher: "Penguin Books",
      publicationYear: 2020,
      pages: 304,
      lastRestocked: "2024-01-15",
      salesThisMonth: 8,
      totalSales: 45,
      featured: true,
    },
    {
      id: 2,
      isbn: "978-0593135204",
      title: "Project Hail Mary",
      author: "Andy Weir",
      category: "Science Fiction",
      price: 5000.00,
      costPrice: 4500.00,
      stock: 8,
      minStock: 5,
      maxStock: 40,
      status: "In Stock",
      publisher: "Ballantine Books",
      publicationYear: 2021,
      pages: 476,
      lastRestocked: "2024-01-10",
      salesThisMonth: 12,
      totalSales: 67,
      featured: true,
    },
    {
      id: 3,
      isbn: "978-0441172719",
      title: "Dune",
      author: "Frank Herbert",
      category: "Science Fiction",
      price: 3000.00,
      costPrice: 2500.00,
      stock: 3,
      minStock: 5,
      maxStock: 30,
      status: "Low Stock",
      publisher: "Ace Books",
      publicationYear: 1965,
      pages: 412,
      lastRestocked: "2023-12-20",
      salesThisMonth: 5,
      totalSales: 89,
      featured: true,
    },
    {
      id: 4,
      isbn: "978-0547928227",
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      category: "Fantasy",
      price: 3500.00,
      costPrice: 2800.00,
      stock: 0,
      minStock: 5,
      maxStock: 25,
      status: "Out of Stock",
      publisher: "Houghton Mifflin",
      publicationYear: 1937,
      pages: 310,
      lastRestocked: "2023-11-05",
      salesThisMonth: 3,
      totalSales: 56,
      featured: false,
    },
    {
      id: 5,
      isbn: "978-1250217288",
      title: "The Silent Patient",
      author: "Alex Michaelides",
      category: "Mystery",
      price: 3800.00,
      costPrice: 3200.00,
      stock: 12,
      minStock: 5,
      maxStock: 35,
      status: "In Stock",
      publisher: "Celadon Books",
      publicationYear: 2019,
      pages: 336,
      lastRestocked: "2024-01-05",
      salesThisMonth: 7,
      totalSales: 34,
      featured: false,
    },
    {
      id: 6,
      isbn: "978-0735219090",
      title: "Where the Crawdads Sing",
      author: "Delia Owens",
      category: "Fiction",
      price: 3600.00,
      costPrice: 3200.00,
      stock: 20,
      minStock: 5,
      maxStock: 45,
      status: "In Stock",
      publisher: "G.P. Putnam's Sons",
      publicationYear: 2018,
      pages: 384,
      lastRestocked: "2024-01-12",
      salesThisMonth: 15,
      totalSales: 78,
      featured: true,
    },
  ];
};

// Returns seeded order data for the manager views.
export const initialStockOrders = () => {
  return [
    {
      id: "ORD001",
      customer: "John Doe",
      customerEmail: "john@example.com",
      items: 2,
      total: 5000.00 * 2,
      status: "Processing",
      orderDate: "2024-01-20",
      shippingAddress: "123 Main St, Colombo",
      paymentMethod: "Credit Card",
      trackingNumber: "TRK789456123",
      courier: "Aramex",
      estimatedDelivery: "2024-01-27",
    },
    {
      id: "ORD002",
      customer: "Sarah Johnson",
      customerEmail: "sarah@example.com",
      items: 1,
      total: 3500.00 * 1,
      status: "Shipped",
      orderDate: "2024-01-19",
      shippingAddress: "456 Park Ave, Kandy",
      paymentMethod: "PayPal",
      trackingNumber: "TRK321654987",
      courier: "DHL",
      estimatedDelivery: "2024-01-25",
    },
    {
      id: "ORD003",
      customer: "Michael Brown",
      customerEmail: "michael@example.com",
      items: 3,
      total: 3000.00 * 3,
      status: "Delivered",
      orderDate: "2024-01-18",
      shippingAddress: "789 Beach Rd, Galle",
      paymentMethod: "Credit Card",
      trackingNumber: "TRK147258369",
      courier: "FedEx",
      deliveryDate: "2024-01-23",
    },
  ];
};

// Returns seeded publisher data for the manager views.
export const initialPublishers = () => {
  return [
    {
      id: "SUP001",
      name: "Book Distributors Inc.",
      contact: "John Smith",
      email: "john@bookdist.com",
      phone: "+94 11 234 5678",
      address: "123 Business Ave, Colombo 05",
      website: "www.bookdist.com",
      booksSupplied: 45,
      status: "Active",
      rating: 4.5,
      paymentTerms: "30 days",
      leadTime: "5-7 days",
      lastOrder: "2024-01-15",
    },
    {
      id: "SUP002",
      name: "Global Publishers Ltd.",
      contact: "Sarah Johnson",
      email: "sarah@globalpub.com",
      phone: "+94 11 345 6789",
      address: "456 Commerce St, Colombo 03",
      website: "www.globalpub.com",
      booksSupplied: 32,
      status: "Active",
      rating: 4.2,
      paymentTerms: "45 days",
      leadTime: "7-10 days",
      lastOrder: "2024-01-10",
    },
    {
      id: "SUP003",
      name: "Literary Works Co.",
      contact: "Michael Brown",
      email: "michael@literaryworks.com",
      phone: "+94 11 456 7890",
      address: "789 Trade Rd, Colombo 07",
      website: "www.literaryworks.com",
      booksSupplied: 18,
      status: "Inactive",
      rating: 3.8,
      paymentTerms: "15 days",
      leadTime: "10-14 days",
      lastOrder: "2023-12-20",
    },
  ];
};

// Format price
// Formats stock manager prices as LKR.
export const formatPrice = (price) => {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

// Calculate stock alert color
// Returns the alert color for a given stock level.
export const getStockAlertColor = (stock, minStock) => {
  if (stock === 0) return "danger";
  if (stock <= minStock) return "warning";
  return "success";
};
