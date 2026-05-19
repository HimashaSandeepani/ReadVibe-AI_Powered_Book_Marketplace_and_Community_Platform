// User profile utility functions for profile data, reviews, book requests, and stats.
import { formatPrice, formatDate, showNotification, getAllBooks } from "../../utils/helpers";
import { getCurrentUser, setCurrentUser } from "../../utils/auth";
import { createBookRequestApi } from "../../utils/communityApi";
import { fetchBookByIdApi } from "../StockManager/utils";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const BOOK_REVIEWS_UPDATED_EVENT = "book-reviews-updated";
const bookReviewsCache = new Map();

const handleApi = async (path, options = {}) => {
  const { headers = {}, ...restOptions } = options;

  const res = await fetch(`${API_BASE}${path}`, {
    ...restOptions,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.error || data?.message || "Request failed";
    throw new Error(message);
  }
  return data;
};

export const books = getAllBooks();

// Builds a compact star representation from a numeric rating.
export const generateStarRating = (rating) => {
  const safeRating = Number(rating) || 0;
  return "*".repeat(Math.max(0, Math.min(5, Math.round(safeRating))));
};

// Normalizes an order shape from API/local storage into the profile view format.
const normalizeOrder = (order) => {
  const items = Array.isArray(order?.items) ? order.items : [];
  const shippingAddress = order?.shippingAddress || {};

  return {
    ...order,
    items,
    totals: {
      subtotal: Number(order?.subtotal) || 0,
      shipping: Number(order?.shippingCost) || 0,
      tax: Number(order?.tax) || 0,
      total: Number(order?.total) || 0,
    },
    orderDate: order?.orderDate || order?.createdAt,
    shipping: {
      ...shippingAddress,
      estimatedDelivery:
        shippingAddress?.estimatedDelivery ||
        order?.estimatedDelivery ||
        order?.createdAt ||
        new Date().toISOString(),
    },
    orderNumber: order?.id,
  };
};

// Normalizes a review object for consistent profile rendering.
const normalizeReview = (review) => ({
  ...review,
  bookId: review?.bookId?.toString?.() ?? String(review?.bookId ?? ""),
  date: review?.date || review?.createdAt,
});

// Converts a review list into the normalized profile format.
const normalizeBookReviewList = (reviews = []) =>
  reviews.map((review) => normalizeReview(review));

// Normalizes activity timestamps for profile activity cards.
const normalizeActivity = (activity) => ({
  ...activity,
  time: activity?.time ? formatDate(activity.time) : "Recently",
});

// Normalizes a book request object for profile display.
const normalizeBookRequest = (request) => ({
  ...request,
  userName: request?.userFullName || request?.username || "User",
  userEmail: request?.userEmail || "",
  dateRequested: request?.createdAt || request?.dateRequested,
  dateUpdated: request?.updatedAt || request?.dateUpdated || request?.createdAt,
  status:
    typeof request?.status === "string"
      ? request.status.charAt(0).toUpperCase() + request.status.slice(1).toLowerCase()
      : request?.status || "Pending",
  adminNotes: request?.adminNotes || request?.stock_managerNotes || "",
});

// Derives a display name for review authors.
const getBookReviewDisplayName = (user) => user?.fullName || user?.name || user?.username || "Reader";

// Notifies listeners that the cached book reviews changed.
const emitBookReviewsUpdated = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(BOOK_REVIEWS_UPDATED_EVENT));
};

// Returns every cached review across all books.
export const getStoredBookReviews = () => {
  return [...bookReviewsCache.values()].flat();
};

// Returns cached reviews for a single book.
export const getBookReviewsForBook = (bookId) => {
  const normalizedBookId = String(bookId ?? "");
  return bookReviewsCache.get(normalizedBookId) || [];
};

// Fetches and caches reviews for a single book.
export const loadBookReviewsForBook = async (bookId) => {
  const normalizedBookId = String(bookId ?? "");
  if (!normalizedBookId) return [];

  const book = await fetchBookByIdApi(normalizedBookId);
  const reviews = normalizeBookReviewList(book?.reviewsList || []);
  bookReviewsCache.set(normalizedBookId, reviews);
  emitBookReviewsUpdated();
  return reviews;
};

// Inserts a new review into the local review cache.
export const updateBookReviewCache = (review, book, user) => {
  if (!review) return;

  try {
    const normalizedReview = {
      id: review.id ?? `review-${Date.now()}`,
      bookId: String(review.bookId ?? book?.id ?? ""),
      bookTitle: book?.title || review.bookTitle || "",
      bookAuthor: book?.author || review.bookAuthor || "",
      bookImage: book?.image || review.bookImage || "",
      rating: review.rating ?? 0,
      title: review.title || "",
      text: review.text || review.comment || "",
      recommend: Boolean(review.recommend),
      date: review.date || review.createdAt || new Date().toISOString(),
      userName: review.userName || getBookReviewDisplayName(user),
    };

    const normalizedBookId = String(normalizedReview.bookId || "");
    const existingReviews = bookReviewsCache.get(normalizedBookId) || [];
    const nextReviews = [
      normalizedReview,
      ...existingReviews.filter((item) => String(item.id) !== String(normalizedReview.id)),
    ];

    bookReviewsCache.set(normalizedBookId, nextReviews);
    emitBookReviewsUpdated();
  } catch (error) {
    console.error("Failed to update book review cache", error);
  }
};

// Normalizes identity values for cross-source user matching.
const normalizeIdentityValue = (value) => {
  if (value === null || value === undefined) return "";
  return String(value).trim().toLowerCase();
};

// Counts community posts associated with the current user.
const getUserCommunityPostCount = (user) => {
  if (!user?.id && !user?.username && !user?.name && !user?.fullName) {
    return 0;
  }

  try {
    const storedPosts = JSON.parse(localStorage.getItem("communityPosts")) || [];
    const adminPosts = JSON.parse(localStorage.getItem("adminCommunityPosts")) || [];
    const posts = Array.isArray(storedPosts) && storedPosts.length > 0 ? storedPosts : adminPosts;

    const userIdentifiers = new Set(
      [
        user.id,
        user.username,
        user.name,
        user.fullName,
        user.userFullName,
      ]
        .filter(Boolean)
        .map(normalizeIdentityValue),
    );

    return posts.filter((post) => {
      const postIdentifiers = [
        post?.userId,
        post?.username,
        post?.user,
        post?.userFullName,
        post?.userDisplay?.name,
        post?.userDisplay?.avatar,
      ]
        .filter(Boolean)
        .map(normalizeIdentityValue);

      return postIdentifiers.some((identifier) => userIdentifiers.has(identifier));
    }).length;
  } catch {
    return 0;
  }
};

// Loads all profile-related data for the current user.
export const loadUserData = async (user) => {
  if (!user?.id) {
    return {
      orders: [],
      reviews: [],
      bookRequests: [],
      userStats: {
        booksRead: 0,
        reviewsWritten: 0,
        wishlistCount: 0,
        communityPosts: 0,
        myBookRequests: 0,
      },
      recentActivity: [],
    };
  }

  const data = await handleApi(`/api/profile?userId=${encodeURIComponent(user.id)}`, {
    headers: { "x-user-id": user.id },
  });

  return {
    orders: (data.orders || []).map(normalizeOrder),
    reviews: (data.reviews || []).map(normalizeReview),
    bookRequests: (data.bookRequests || []).map(normalizeBookRequest),
    recentActivity: (data.recentActivity || []).map(normalizeActivity),
    userStats: {
      ...(data.userStats || {
        booksRead: 0,
        reviewsWritten: 0,
        wishlistCount: 0,
        communityPosts: 0,
        myBookRequests: 0,
      }),
      communityPosts: getUserCommunityPostCount(user),
    },
  };
};

// Persists profile edits through the backend and updates the current user.
export const updateUserProfile = async (user, updatedData) => {
  const data = await handleApi("/api/profile", {
    method: "PUT",
    body: JSON.stringify({
      userId: user.id,
      fullName: updatedData.name,
      email: updatedData.email,
      username: updatedData.username,
    }),
    headers: { "x-user-id": user.id },
  });

  setCurrentUser(data.user);
  return data.user;
};

// Submits a book request from the profile screen.
export const submitBookRequest = async (user, requestData) =>
  createBookRequestApi({
    userId: user.id,
    bookTitle: requestData.title,
    author: requestData.author,
    isbn: requestData.isbn,
    category: requestData.category,
    reason: requestData.reason,
  });

  // Submits a review for a book and updates the local review cache.
export const submitReview = async (user, book, reviewData, orderId = null) => {
  const data = await handleApi("/api/profile/reviews", {
    method: "POST",
    body: JSON.stringify({
      userId: user.id,
      bookId: reviewData.bookId ?? book.id,
      rating: reviewData.rating,
      title: reviewData.title || "",
      text: reviewData.text.trim(),
      recommend: reviewData.recommend,
      orderId,
    }),
    headers: { "x-user-id": user.id },
  });

  const savedReview = normalizeReview(data.review);
  updateBookReviewCache(
    {
      ...savedReview,
      title: reviewData.title || savedReview.title,
      text: reviewData.text || savedReview.text,
      recommend: reviewData.recommend,
      rating: reviewData.rating ?? savedReview.rating,
      userName: getBookReviewDisplayName(user),
      bookId: savedReview.bookId || book?.id,
      bookTitle: book?.title,
      bookAuthor: book?.author,
      bookImage: book?.image,
    },
    book,
    user,
  );

  return savedReview;
};

// Deletes a review and removes it from the local review cache.
export const deleteReview = async (reviewId, userId) => {
  await handleApi(`/api/profile/reviews/${reviewId}?userId=${encodeURIComponent(userId)}`, {
    method: "DELETE",
    headers: { "x-user-id": userId },
  });
  for (const [bookId, reviews] of bookReviewsCache.entries()) {
    const nextReviews = reviews.filter((review) => String(review.id) !== String(reviewId));
    if (nextReviews.length !== reviews.length) {
      bookReviewsCache.set(bookId, nextReviews);
    }
  }
  emitBookReviewsUpdated();
};

// Returns order items that the user has not reviewed yet.
export const findUnreviewedItems = (order, userReviews) => {
  const items = Array.isArray(order?.items) ? order.items : [];
  return items.filter((item) => {
    const itemBookId = String(item.bookId ?? item.id ?? "");
    return !userReviews.some((review) => String(review.bookId) === itemBookId);
  });
};

export { formatPrice, formatDate, showNotification, getCurrentUser };
