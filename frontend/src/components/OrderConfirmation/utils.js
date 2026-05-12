// Format price helper
import { formatPrice, formatDate } from "../../utils/helpers.js";
import { getCurrentUser } from "../../utils/auth.js";
import { getOrderPaymentConfirmationKey } from "../Checkout/utils.js";

const normalizeRecommendationId = (value) => {
  if (value === null || value === undefined) return "";
  return String(value).trim();
};

const getBookRecommendationId = (book) =>
  normalizeRecommendationId(
    book?.datasetBookId ?? book?.dataset_book_id ?? book?.id,
  );

const buildRecommendationLookup = (books = []) => {
  const lookup = new Map();

  (Array.isArray(books) ? books : []).forEach((book) => {
    if (!book) return;

    const datasetId = getBookRecommendationId(book);
    if (datasetId) {
      lookup.set(datasetId, book);
    }

    const numericId = normalizeRecommendationId(book.id);
    if (numericId) {
      lookup.set(numericId, book);
    }
  });

  return lookup;
};

const resolveDatasetBookIds = (bookIds = [], books = []) => {
  const lookup = buildRecommendationLookup(books);
  const resolved = [];

  (Array.isArray(bookIds) ? bookIds : []).forEach((bookId) => {
    const key = normalizeRecommendationId(bookId);
    if (!key) return;

    const matchedBook = lookup.get(key);
    const datasetId = getBookRecommendationId(matchedBook) || key;

    if (datasetId && !resolved.includes(datasetId)) {
      resolved.push(datasetId);
    }
  });

  return resolved;
};

const normalizeRules = (rules = []) => {
  return (Array.isArray(rules) ? rules : [])
    .map((rule) => ({
      antecedent: Array.isArray(rule?.antecedent)
        ? rule.antecedent.map(normalizeRecommendationId).filter(Boolean)
        : [],
      consequent: Array.isArray(rule?.consequent)
        ? rule.consequent.map(normalizeRecommendationId).filter(Boolean)
        : [],
      confidence: Number(rule?.confidence) || 0,
      lift: Number(rule?.lift) || 0,
      support: Number(rule?.support) || 0,
    }))
    .filter((rule) => rule.antecedent.length > 0 && rule.consequent.length > 0);
};

const uniquePush = (list, value) => {
  if (!value || list.includes(value)) return;
  list.push(value);
};

const getBookByRecommendationId = (books, bookId) => {
  const lookup = buildRecommendationLookup(books);
  return lookup.get(normalizeRecommendationId(bookId)) || null;
};

const shuffleBooks = (books = []) => {
  const shuffled = [...books];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
};

const getStoredPaymentConfirmation = (orderId) => {
  try {
    const key = getOrderPaymentConfirmationKey(orderId);
    const stored = JSON.parse(
      localStorage.getItem(key) || sessionStorage.getItem(key) || "null",
    );

    if (!stored) return null;
    if (orderId && String(stored.orderId) !== String(orderId)) {
      return null;
    }

    return stored;
  } catch {
    return null;
  }
};

export const getOrderDisplayDate = (order) =>
  order?.orderDate ||
  order?.createdAt ||
  order?.updatedAt ||
  getStoredPaymentConfirmation(order?.id)?.timestamp ||
  null;

export const getOrderPaymentInfo = (order) => {
  const storedPayment = getStoredPaymentConfirmation(order?.id) || {};

  return {
    method:
      order?.payment?.method ||
      order?.paymentMethod ||
      storedPayment.method ||
      "Credit Card",
    transactionId:
      order?.payment?.transactionId ||
      order?.transactionId ||
      storedPayment.transactionId ||
      "TXN_000000000",
  };
};

// Shipping methods configuration
export const shippingMethods = {
  standard: {
    id: "standard",
    title: "Standard Shipping",
    description: "Economical shipping for standard delivery. Tracking available.",
    days: "5-7 business days",
    processingDays: 2,
    shippingDays: 5,
    icon: "truck",
    price: 500.0,
  },
  express: {
    id: "express",
    title: "Express Shipping",
    description: "Priority shipping with expedited delivery. Includes tracking and insurance.",
    days: "2-3 business days",
    processingDays: 1,
    shippingDays: 2,
    icon: "shippingFast",
    price: 1200.0,
  },
  overnight: {
    id: "overnight",
    title: "Overnight Shipping",
    description: "Guaranteed overnight delivery. Includes premium tracking and full insurance.",
    days: "Next business day",
    processingDays: 0,
    shippingDays: 1,
    icon: "rocket",
    price: 2500.0,
  },
};

// Get order by ID
export const getOrderById = (orderId) => {
  const orders = JSON.parse(localStorage.getItem("userOrders")) || [];
  return orders.find((order) => order.id === orderId);
};

// Get latest user order
export const getLatestUserOrder = () => {
  const user = getCurrentUser();
  if (!user) return null;

  const orders = JSON.parse(localStorage.getItem("userOrders")) || [];
  const userOrders = orders.filter((order) => order.userId === user.id);

  if (userOrders.length === 0) return null;
  return userOrders[userOrders.length - 1];
};

// Get tracking updates
export const getTrackingUpdates = (orderId) => {
  const allUpdates = JSON.parse(localStorage.getItem("orderTrackingUpdates")) || [];
  return allUpdates.filter((update) => update.orderId === orderId);
};

// Get ordered categories
export const getOrderedCategories = (order, books) => {
  if (!order || !order.items || !books) return [];

  const categories = [];
  order.items.forEach((item) => {
    const bookId = item.id ?? item.bookId;
    const book = books.find((b) => b.id === bookId);
    if (book && book.category && !categories.includes(book.category)) {
      categories.push(book.category);
    }
  });

  return categories;
};

export const getOrderedDatasetBookIds = (order, books) => {
  if (!order || !order.items || !books) return [];

  const selectedIds = [];
  order.items.forEach((item) => {
    const candidateIds = [
      item.datasetBookId,
      item.dataset_book_id,
      item.bookDatasetId,
      item.book_id,
      item.bookId,
      item.id,
    ];

    candidateIds.forEach((candidateId) => {
      const resolved = normalizeRecommendationId(candidateId);
      if (!resolved) return;

      const matchedBook = getBookByRecommendationId(books, resolved);
      if (matchedBook) {
        const datasetId = getBookRecommendationId(matchedBook);
        uniquePush(selectedIds, datasetId);
      }
    });
  });

  return selectedIds;
};

export const getRecommendedBookIds = (selectedBookIds, rules, books, limit = 4) => {
  const availableBooks = Array.isArray(books) ? books : [];
  const selectedIds = resolveDatasetBookIds(selectedBookIds, availableBooks);
  const selectedIdSet = new Set(selectedIds);
  const lookup = buildRecommendationLookup(availableBooks);
  const recommendedIds = [];

  const addIfValid = (bookId) => {
    const normalizedId = normalizeRecommendationId(bookId);
    if (!normalizedId || selectedIdSet.has(normalizedId) || recommendedIds.includes(normalizedId)) {
      return;
    }

    if (!lookup.has(normalizedId)) return;
    recommendedIds.push(normalizedId);
  };

  const matchedRules = normalizeRules(rules)
    .filter((rule) => rule.antecedent.every((id) => selectedIdSet.has(id)))
    .sort((left, right) =>
      (right.confidence - left.confidence)
      || (right.lift - left.lift)
      || (right.support - left.support),
    );

  matchedRules.forEach((rule) => {
    rule.consequent.forEach(addIfValid);
  });

  if (recommendedIds.length < limit) {
    const selectedBooks = selectedIds
      .map((id) => lookup.get(id))
      .filter(Boolean);
    const selectedAuthors = [...new Set(selectedBooks.map((book) => book.author).filter(Boolean))];

    availableBooks.forEach((book) => {
      const datasetId = getBookRecommendationId(book);
      if (
        datasetId &&
        !selectedIdSet.has(datasetId) &&
        !recommendedIds.includes(datasetId) &&
        selectedAuthors.includes(book.author)
      ) {
        recommendedIds.push(datasetId);
      }
    });
  }

  if (recommendedIds.length < limit) {
    const selectedBooks = selectedIds
      .map((id) => lookup.get(id))
      .filter(Boolean);
    const selectedCategories = [...new Set(selectedBooks.map((book) => book.category).filter(Boolean))];
    const categoryCandidates = shuffleBooks(
      availableBooks.filter((book) => {
        const datasetId = getBookRecommendationId(book);
        return (
          datasetId &&
          !selectedIdSet.has(datasetId) &&
          !recommendedIds.includes(datasetId) &&
          selectedCategories.includes(book.category)
        );
      }),
    );

    categoryCandidates.forEach((book) => {
      if (recommendedIds.length < limit) {
        addIfValid(getBookRecommendationId(book));
      }
    });
  }

  if (recommendedIds.length < limit) {
    availableBooks.forEach((book) => {
      if (recommendedIds.length < limit) {
        addIfValid(getBookRecommendationId(book));
      }
    });
  }

  return recommendedIds.slice(0, limit);
};

export const getRecommendedBooksByIds = (bookIds, books) => {
  const lookup = buildRecommendationLookup(books);
  return (Array.isArray(bookIds) ? bookIds : [])
    .map((bookId) => lookup.get(normalizeRecommendationId(bookId)))
    .filter(Boolean);
};

// Get recommended books
export const getRecommendedBooks = (categories, books, limit = 4) => {
  if (!categories || categories.length === 0 || !books) {
    return books.slice(0, limit);
  }

  const recommended = [];

  categories.forEach((category) => {
    const categoryBooks = books.filter(
      (book) =>
        book.category === category &&
        !recommended.some((rec) => rec.id === book.id)
    );

    recommended.push(...categoryBooks.slice(0, 2));

    if (recommended.length >= limit) {
      return recommended.slice(0, limit);
    }
  });

  if (recommended.length < limit) {
    const remaining = limit - recommended.length;
    const popularBooks = books
      .filter((book) => !recommended.some((rec) => rec.id === book.id))
      .slice(0, remaining);
    recommended.push(...popularBooks);
  }

  return recommended.slice(0, limit);
};

// Calculate estimated dates
export const calculateEstimatedDates = (shippingMethodKey) => {
  const now = new Date();
  const method = shippingMethods[shippingMethodKey] || shippingMethods.standard;

  const processingDays = method.processingDays || 2;
  const shippingDays = method.shippingDays || 7;

  const shipDate = new Date(now);
  shipDate.setDate(now.getDate() + processingDays);

  const deliveryDate = new Date(now);
  deliveryDate.setDate(now.getDate() + processingDays + shippingDays);

  return {
    shipDate: shipDate.toLocaleDateString(),
    deliveryDate: deliveryDate.toLocaleDateString(),
    processingDays,
    shippingDays,
  };
};

// Generate invoice content
export const generateInvoiceContent = (order, user, trackingUpdates = []) => {
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const method = shippingMethods[order.shipping?.shippingMethod] || shippingMethods.standard;

  let invoiceText = "============================================\n";
  invoiceText += "              READVIBE INVOICE\n";
  invoiceText += "============================================\n\n";

  invoiceText += `Invoice No: ${order.orderNumber || order.id}\n`;
  invoiceText += `Date: ${date}\n`;
  invoiceText += `Customer: ${user.name}\n`;
  invoiceText += `Email: ${user.email}\n\n`;

  if (order.shipping) {
    invoiceText += "Shipping Address:\n";
    invoiceText += `${order.shipping.firstName} ${order.shipping.lastName}\n`;
    invoiceText += `${order.shipping.address}\n`;
    invoiceText += `${order.shipping.city}, ${order.shipping.state} ${order.shipping.zipCode}\n`;
    invoiceText += `${order.shipping.country}\n\n`;
  }

  invoiceText += "============================================\n";
  invoiceText += "Order Items\n";
  invoiceText += "============================================\n\n";

  order.items?.forEach((item, index) => {
    invoiceText += `${index + 1}. ${item.title}\n`;
    invoiceText += `   by ${item.author}\n`;
    invoiceText += `   Qty: ${item.quantity} x ${formatPrice(item.price)}\n`;
    invoiceText += `   Total: ${formatPrice(item.price * item.quantity)}\n\n`;
  });

  invoiceText += "============================================\n";
  invoiceText += "Order Summary\n";
  invoiceText += "============================================\n\n";

  if (order.totals) {
    invoiceText += `Subtotal: ${formatPrice(order.totals.subtotal)}\n`;
    invoiceText += `Shipping: ${formatPrice(order.totals.shipping)}\n`;
    invoiceText += `Tax (5%): ${formatPrice(order.totals.tax)}\n`;
    invoiceText += `Total: ${formatPrice(order.totals.total)}\n\n`;
  }

  invoiceText += "Payment Information:\n";
  const paymentInfo = getOrderPaymentInfo(order);
  invoiceText += `Method: ${paymentInfo.method}\n`;
  invoiceText += `Transaction ID: ${paymentInfo.transactionId}\n\n`;

  invoiceText += "Shipping Information:\n";
  invoiceText += `Method: ${method.title}\n`;
  invoiceText += `Delivery Time: ${method.days}\n`;
  invoiceText += `Cost: ${formatPrice(order.totals?.shipping || 0)}\n\n`;

  if (trackingUpdates.length > 0) {
    invoiceText += "Tracking Information:\n";
    trackingUpdates.forEach((update) => {
      invoiceText += `${formatDate(update.timestamp)} - ${update.status}\n`;
      if (update.note) invoiceText += `  Note: ${update.note}\n`;
    });
    invoiceText += "\n";
  }

  invoiceText += "============================================\n";
  invoiceText += "Thank you for shopping with ReadVibe!\n";
  invoiceText += "============================================\n\n";

  invoiceText += "Customer Support:\n";
  invoiceText += "Email: support@readvibe.com\n";
  invoiceText += "Phone: +94 11 234 5678\n";
  invoiceText += "Hours: Mon-Fri 9:00 AM - 6:00 PM\n";

  return invoiceText;
};

// Download invoice
export const downloadInvoice = (order, user, trackingUpdates = []) => {
  if (!user || !order) return false;

  try {
    const invoiceContent = generateInvoiceContent(order, user, trackingUpdates);
    const blob = new Blob([invoiceContent], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Invoice_${order.orderNumber || order.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error("Error downloading invoice:", error);
    return false;
  }
};

// Add support request
export const addSupportRequest = (order, user, message) => {
  const supportRequests = JSON.parse(localStorage.getItem("supportRequests")) || [];

  const newRequest = {
    id: Date.now(),
    orderId: order.id,
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    message: message.trim(),
    status: "pending",
    timestamp: new Date().toISOString(),
    responses: [],
  };

  supportRequests.push(newRequest);
  localStorage.setItem("supportRequests", JSON.stringify(supportRequests));
  return newRequest;
};

export { formatPrice, formatDate };