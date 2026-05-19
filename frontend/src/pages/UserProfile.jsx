// User profile page for activity, reviews, support, and account settings.
import { useState, useEffect, useMemo } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

// Import Components
import LoadingSpinner from "../components/common/LoadingSpinner";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import ReadingStatsCard from "../components/UserProfile/ReadingStatsCard";
import DashboardOverview from "../components/UserProfile/DashboardOverview";
import RecentActivity from "../components/UserProfile/RecentActivity";
import QuickActions from "../components/UserProfile/QuickActions";
import OrderHistory from "../components/UserProfile/OrderHistory";
import MyReviews from "../components/UserProfile/MyReviews";
import BookRequests from "../components/UserProfile/BookRequests";
import EditProfileModal from "../components/UserProfile/EditProfileModal";
import RequestBookModal from "../components/UserProfile/RequestBookModal";
import AddReviewModal from "../components/UserProfile/AddReviewModal";
import SupportMessagesSection from "../components/UserProfile/SupportMessagesSection";
import LiveChatSection from "../components/UserProfile/LiveChatSection";

// Import Utilities
import {
  getCurrentUser,
  loadUserData,
  updateUserProfile,
  submitBookRequest,
  submitReview,
  deleteReview,
  findUnreviewedItems,
  books,
  showNotification,
} from "../components/UserProfile/utils";
import { fetchBooksFromApi } from "../components/StockManager/utils";
import {
  getSupportMessagesForUser,
  getSupportMessagesUpdatedEventName,
  SUPPORT_MESSAGES_CACHE_KEY,
  loadSupportMessages,
} from "../utils/supportMessages";
import {
  getLiveChatThreadsForUser,
  getLiveChatUpdatedEventName,
  loadLiveChatThreads,
  resolveLiveChatThread,
  sendLiveChatMessage,
} from "../utils/liveChat";

import "../styles/pages/UserProfile.css";

const EMPTY_USER_STATS = {
  booksRead: 0,
  reviewsWritten: 0,
  wishlistCount: 0,
  communityPosts: 0,
  myBookRequests: 0,
};

const EMPTY_USER_DATA = {
  orders: [],
  reviews: [],
  bookRequests: [],
  userStats: EMPTY_USER_STATS,
  recentActivity: [],
};

const DEFAULT_REQUEST_CATEGORIES = [
  "Fiction",
  "Science Fiction",
  "Fantasy",
  "Mystery",
  "Romance",
  "Non-Fiction",
  "Biography",
  "Self-Help",
  "Other",
];

// Loads the stored category list for profile request forms.
const getStoredCategories = () => {
  if (typeof window === "undefined") return [];

  try {
    const stored = JSON.parse(window.localStorage.getItem("categories"));
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
};

// User profile page component.
const UserProfile = () => {
  const seededUser = typeof window === "undefined" ? null : getCurrentUser();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState(seededUser);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [activeSection, setActiveSection] = useState(
    searchParams.get("section") || "overview",
  );
  const [loading, setLoading] = useState(true);

  // User data
  const [userStats, setUserStats] = useState({ ...EMPTY_USER_STATS });
  const [recentActivity, setRecentActivity] = useState([]);
  const [orders, setOrders] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [bookRequests, setBookRequests] = useState([]);
  const [supportMessages, setSupportMessages] = useState([]);
  const [liveChatThreads, setLiveChatThreads] = useState([]);
  const [requestCategories, setRequestCategories] = useState(DEFAULT_REQUEST_CATEGORIES);

  // Modal data
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [reviewQueue, setReviewQueue] = useState([]);
  const [reviewBatchTotal, setReviewBatchTotal] = useState(0);

  const navigate = useNavigate();

  // Loads profile data for the signed-in user.
  const initializeUserData = async (currentUser) => {
    if (!currentUser) return;

    setLoading(true);
    const {
      orders: userOrders,
      reviews: userReviews,
      bookRequests: userRequests,
      userStats: stats,
      recentActivity: activity,
    } = await loadUserData(currentUser);

    setOrders(userOrders);
    setMyReviews(userReviews);
    setBookRequests(userRequests);
    setUserStats(stats);
    setRecentActivity(activity);
    setLoading(false);
  };

  // Refreshes support messages for the current user.
  const refreshSupportMessages = async (currentUser) => {
    if (!currentUser) {
      setSupportMessages([]);
      return;
    }

    const messages = await loadSupportMessages(currentUser.id);
    setSupportMessages(messages.length ? messages : getSupportMessagesForUser(currentUser.id));
  };

  // Refreshes live chat threads for the current user.
  const refreshLiveChatThreads = async (currentUser) => {
    if (!currentUser) {
      setLiveChatThreads([]);
      return;
    }

    const threads = await loadLiveChatThreads(currentUser.id);
    setLiveChatThreads(threads.length ? threads : getLiveChatThreadsForUser(currentUser.id));
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    void initializeUserData(user);
    void refreshSupportMessages(user);
    void refreshLiveChatThreads(user);

    const handleStorageChange = (event) => {
      if (event.key === "currentUser") {
        const updatedUser = getCurrentUser();
        setUser(updatedUser);
        if (updatedUser) {
          void initializeUserData(updatedUser);
        }
      }
    };

    const handleRefresh = () => {
      const currentUser = getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        void initializeUserData(currentUser);
        void refreshSupportMessages(currentUser);
        void refreshLiveChatThreads(currentUser);
      }
    };

    const handleSupportMessagesStorage = (event) => {
      if (event.key === SUPPORT_MESSAGES_CACHE_KEY) {
        const currentUser = getCurrentUser();
        if (currentUser) {
          void refreshSupportMessages(currentUser);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleRefresh);
    window.addEventListener("wishlist-updated", handleRefresh);
    window.addEventListener("cart-updated", handleRefresh);
    window.addEventListener("book-requests-updated", handleRefresh);
    window.addEventListener(getSupportMessagesUpdatedEventName(), handleRefresh);
    window.addEventListener(getLiveChatUpdatedEventName(), handleRefresh);
    window.addEventListener("storage", handleSupportMessagesStorage);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleRefresh);
      window.removeEventListener("wishlist-updated", handleRefresh);
      window.removeEventListener("cart-updated", handleRefresh);
      window.removeEventListener("book-requests-updated", handleRefresh);
      window.removeEventListener(getSupportMessagesUpdatedEventName(), handleRefresh);
      window.removeEventListener(getLiveChatUpdatedEventName(), handleRefresh);
      window.removeEventListener("storage", handleSupportMessagesStorage);
    };
  }, [user, navigate]);

  useEffect(() => {
    const loadRequestCategories = async () => {
      try {
        const apiBooks = await fetchBooksFromApi();
        const apiCategories = apiBooks
          .map((book) => book.category)
          .filter(Boolean)
          .map((category) => String(category).trim());

        const storedCategories = getStoredCategories();
        const next = new Set([
          ...DEFAULT_REQUEST_CATEGORIES,
          ...storedCategories,
          ...apiCategories,
        ]);

        setRequestCategories([...next].sort((left, right) => left.localeCompare(right)));
      } catch (error) {
        console.error("Failed to load request categories", error);
      }
    };

    void loadRequestCategories();
  }, []);

  useEffect(() => {
    const section = searchParams.get("section");
    if (section) {
      setActiveSection(section);
    }
  }, [searchParams]);

  const handleUpdateProfile = async (updatedData) => {
    const updatedUser = await updateUserProfile(user, updatedData);
    setUser(updatedUser);
    setShowEditModal(false);
    await initializeUserData(updatedUser);
    showNotification("Profile updated successfully!", "success");
  };

  const handleSubmitBookRequest = async (requestData) => {
    const createdRequest = await submitBookRequest(user, requestData);

    if (createdRequest) {
      const normalizedRequest = {
        ...createdRequest,
        userName: createdRequest.userFullName || createdRequest.username || user.name || "User",
        userEmail: createdRequest.userEmail || user.email || "",
        dateRequested: createdRequest.createdAt || new Date().toISOString(),
        dateUpdated: createdRequest.updatedAt || createdRequest.createdAt || new Date().toISOString(),
        status:
          typeof createdRequest.status === "string"
            ? createdRequest.status.charAt(0).toUpperCase() + createdRequest.status.slice(1).toLowerCase()
            : "Pending",
      };

      setBookRequests((prev) => [normalizedRequest, ...prev]);
      setUserStats((prev) => ({
        ...prev,
        myBookRequests: (prev.myBookRequests || 0) + 1,
      }));
      setRecentActivity((prev) => [
        {
          type: "book-request",
          text: `You added a book request for "${normalizedRequest.bookTitle || requestData.title}"`,
          time: normalizedRequest.dateRequested,
          icon: "book",
        },
        ...prev,
      ]);
    }

    await initializeUserData(user);
    setShowRequestModal(false);
    showNotification("Book request submitted successfully!", "success");
  };

  const handleReviewOrderItems = (orderId) => {
    const order = orders.find((o) => String(o.id) === String(orderId));
    if (!order) return;

    const unreviewedItems = findUnreviewedItems(order, myReviews);
    const uniqueUnreviewedItems = [...new Map(
      unreviewedItems.map((item) => [String(item.bookId ?? item.id), item]),
    ).values()];

    if (uniqueUnreviewedItems.length === 0) {
      showNotification("All items in this order have been reviewed", "info");
      return;
    }

    const firstUnreviewedItem = uniqueUnreviewedItems[0];
    const bookId = firstUnreviewedItem?.bookId ?? firstUnreviewedItem?.id;
    const bookToReview = books.find((b) => String(b.id) === String(bookId)) || {
      id: bookId,
      title: firstUnreviewedItem?.title || "Book",
      author: firstUnreviewedItem?.author || "",
      image: firstUnreviewedItem?.image || "",
    };

    setReviewQueue(uniqueUnreviewedItems);
    setReviewBatchTotal(uniqueUnreviewedItems.length);
    setSelectedBook(bookToReview);
    setSelectedOrderId(orderId);
    setShowReviewModal(true);
  };

  const handleSubmitReview = async (reviewData) => {
    if (reviewData.rating === 0) {
      showNotification("Please select a rating", "warning");
      return;
    }

    if (!reviewData.text.trim()) {
      showNotification("Please write your review", "warning");
      return;
    }
    if (!selectedBook) {
      showNotification("Please select a book to review", "warning");
      return;
    }

    // Ensure the review payload includes the book id required by submitReview
    const reviewPayload = { ...reviewData, bookId: selectedBook.id };

    await submitReview(
      user,
      selectedBook,
      reviewPayload,
      selectedOrderId,
    );

    await initializeUserData(user);

    const remainingQueue = reviewQueue.slice(1);
    if (remainingQueue.length > 0) {
      const nextItem = remainingQueue[0];
      const nextBookId = nextItem?.bookId ?? nextItem?.id;
      const nextBook = books.find((b) => String(b.id) === String(nextBookId)) || {
        id: nextBookId,
        title: nextItem?.title || "Book",
        author: nextItem?.author || "",
        image: nextItem?.image || "",
      };

      setReviewQueue(remainingQueue);
      setSelectedBook(nextBook);
      setSelectedOrderId(selectedOrderId);
      setShowReviewModal(true);
      showNotification(`Review submitted for ${selectedBook.title}. Continue with the next item.`, "success");
      return;
    }

    setShowReviewModal(false);
    setSelectedBook(null);
    setSelectedOrderId(null);
    setReviewQueue([]);
    setReviewBatchTotal(0);

    showNotification("Review submitted successfully!", "success");
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      await deleteReview(reviewId, user.id);
      await initializeUserData(user);

      showNotification("Review deleted successfully!", "success");
    }
  };

  const handleViewOrderDetails = (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    // Navigate to order confirmation page and open tracking details immediately
    navigate(`/order-confirmation?orderId=${orderId}&view=tracking`);
  };

  const handleStartLiveChat = async () => {
    if (!user) return;

    const latestOrder = orders[0];
    if (!latestOrder) {
      showNotification("Place an order first to start a live chat thread.", "info");
      return;
    }

    await resolveLiveChatThread({
      order: {
        id: latestOrder.id,
        orderNumber: latestOrder.orderNumber || latestOrder.id,
      },
      user,
    });

    await refreshLiveChatThreads(user);
    setActiveSection("live-chat");
  };

  const handleEditReview = (review) => {
    const itemLabel = review?.bookTitle || review?.title || "this review";
    showNotification(`Edit feature for ${itemLabel} coming soon!`, "info");
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <>
            <DashboardOverview
              userStats={userStats}
              onNavigate={(destination) => {
                if (destination.startsWith("/")) {
                  navigate(destination);
                } else {
                  setActiveSection(destination);
                }
              }}
            />
            <RecentActivity
              activities={recentActivity}
              onRefresh={() => initializeUserData(user)}
            />
            <QuickActions
              onViewOrders={() => setActiveSection("orders")}
              onViewReviews={() => setActiveSection("reviews")}
              onRequestBook={() => setShowRequestModal(true)}
              onViewMessages={() => setActiveSection("messages")}
              onViewLiveChat={() => setActiveSection("live-chat")}
            />
          </>
        );

      case "orders":
        return (
          <OrderHistory
            orders={orders}
            onBack={() => setActiveSection("overview")}
            onReviewOrder={handleReviewOrderItems}
            onViewDetails={handleViewOrderDetails}
          />
        );

      case "reviews":
        return (
          <MyReviews
            reviews={myReviews}
            onBack={() => setActiveSection("overview")}
            onEditReview={handleEditReview}
            onDeleteReview={handleDeleteReview}
          />
        );

      case "requests":
        return (
          <BookRequests
            requests={bookRequests}
            onBack={() => setActiveSection("overview")}
            onNewRequest={() => setShowRequestModal(true)}
          />
        );

      case "messages":
        return (
          <SupportMessagesSection
            messages={supportMessages}
            onBack={() => setActiveSection("overview")}
          />
        );

      case "live-chat":
        return (
          <LiveChatSection
            threads={liveChatThreads}
            onBack={() => setActiveSection("overview")}
            onStartChat={handleStartLiveChat}
            onSendMessage={(thread, message) => {
              const order = {
                id: thread.orderId,
                orderNumber: thread.orderNumber,
              };
              return sendLiveChatMessage({
                order,
                user,
                senderRole: "user",
                senderName: user.name || user.fullName || user.username || "User",
                message,
              });
            }}
          />
        );

      default:
        return null;
    }
  };

  if (!user || loading) {
    return (
      <div className="user-profile-page">
        <LoadingSpinner message="Loading profile..." />
      </div>
    );
  }

  return (
    <div className="user-profile-page">
      {/* User Profile Content */}
      <Container className="mt-4">
        <h2 className="mb-4">
          <FontAwesomeIcon icon={faUser} className="me-2" />
          My Profile
        </h2>

        <Row>
          <Col lg={4}>
            <UserInfoCard
              user={user}
              activeSection={activeSection}
              onEditProfile={() => setShowEditModal(true)}
              onChangeSection={setActiveSection}
            />
            <ReadingStatsCard userStats={userStats} />
          </Col>

          <Col lg={8}>{renderSectionContent()}</Col>
        </Row>
      </Container>

      {/* Modals */}
      <EditProfileModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        user={user}
        onSave={handleUpdateProfile}
      />

      <RequestBookModal
        show={showRequestModal}
        onHide={() => setShowRequestModal(false)}
        onSubmit={handleSubmitBookRequest}
        categories={requestCategories}
      />

      <AddReviewModal
        show={showReviewModal}
        onHide={() => setShowReviewModal(false)}
        book={selectedBook}
        onSubmit={handleSubmitReview}
        reviewIndex={reviewBatchTotal - reviewQueue.length + 1}
        reviewCount={reviewBatchTotal}
      />
    </div>
  );
};

export default UserProfile;
