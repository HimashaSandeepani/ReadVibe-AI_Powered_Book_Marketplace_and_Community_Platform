// Order confirmation page with delivery summary and follow-up actions.
import { useEffect, useState, useMemo } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { getCurrentUser } from "../utils/auth";
import { showNotification } from "../utils/helpers";
import { addItem } from "../store/slices/cartSlice";
import { getOrderApi, getOrdersApi } from "../utils/orderApi";
import { getOrderPaymentConfirmationKey } from "../components/Checkout/utils";
import { createSupportMessage } from "../utils/supportMessages";
import { fetchBooksFromApi } from "../components/StockManager/utils";
import { addCartItemApi } from "../utils/cartApi";
import { BOOK_RECOMMENDATION_RULES } from "../data/recommendationRules";

// Import Components
import ProgressSteps from "../components/common/ProgressSteps";
import ConfirmationHeader from "../components/OrderConfirmation/ConfirmationHeader";
import OrderInfoSection from "../components/OrderConfirmation/OrderInfoSection";
import ShippingInfoSection from "../components/OrderConfirmation/ShippingInfoSection";
import OrderItemsSection from "../components/OrderConfirmation/OrderItemsSection";
import OrderActions from "../components/OrderConfirmation/OrderActions";
import OrderSummaryCard from "../components/OrderConfirmation/OrderSummaryCard";
import DeliveryTimeline from "../components/OrderConfirmation/DeliveryTimeline";
import SupportOptions from "../components/OrderConfirmation/SupportOptions";
import RecommendedBooks from "../components/OrderConfirmation/RecommendedBooks";
import TrackOrderModal from "../components/OrderConfirmation/TrackOrderModal";
import ContactSupportModal from "../components/OrderConfirmation/ContactSupportModal";

// Import Utilities
import {
  getOrderedDatasetBookIds,
  getRecommendedBookIds,
  getRecommendedBooksByIds,
  calculateEstimatedDates,
  downloadInvoice,
  getTrackingUpdates,
  shippingMethods,
} from "../components/OrderConfirmation/utils";

import "../styles/pages/OrderConfirmation.css";

const OrderConfirmation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState([]);

  // Modal states
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  const currentUser = useMemo(() => getCurrentUser(), []);
  const orderId = searchParams.get("orderId");

  const recommendationRules = BOOK_RECOMMENDATION_RULES;

  const getStoredPaymentConfirmation = (targetOrderId) => {
    try {
      const key = getOrderPaymentConfirmationKey(targetOrderId);
      const stored = JSON.parse(
        localStorage.getItem(key) || sessionStorage.getItem(key) || "null",
      );

      if (!stored) return null;
      if (targetOrderId && String(stored.orderId) !== String(targetOrderId)) {
        return null;
      }

      return stored;
    } catch {
      return null;
    }
  };

  const buildOrderState = (fetchedOrder, fallbackOrderId) => {
    const paymentConfirmation =
      getStoredPaymentConfirmation(fetchedOrder?.id || fallbackOrderId) || {};

    return {
      id: fetchedOrder.id,
      orderNumber: fetchedOrder.orderNumber || fetchedOrder.id,
      orderDate:
        fetchedOrder.orderDate ||
        fetchedOrder.createdAt ||
        fetchedOrder.updatedAt ||
        paymentConfirmation.timestamp ||
        new Date().toISOString(),
      createdAt: fetchedOrder.createdAt,
      updatedAt: fetchedOrder.updatedAt,
      payment: {
        method:
          fetchedOrder.payment?.method ||
          fetchedOrder.paymentMethod ||
          paymentConfirmation.method ||
          "Credit Card",
        transactionId:
          fetchedOrder.payment?.transactionId ||
          fetchedOrder.transactionId ||
          paymentConfirmation.transactionId ||
          null,
      },
      items:
        fetchedOrder.items?.map((item) => ({
          id: item.bookId,
          title: item.title || item.bookTitle || item.bookName || item.productName || "Book",
          author: item.author || item.bookAuthor || item.productAuthor || "",
          quantity: item.quantity,
          price: item.unitPrice,
          image: item.image,
        })) || [],
      shipping: fetchedOrder.shippingAddress || {},
      trackingUpdates: fetchedOrder.trackingUpdates || [],
      totals: {
        subtotal: fetchedOrder.subtotal,
        shipping: fetchedOrder.shippingCost,
        tax: fetchedOrder.tax,
        total: fetchedOrder.total,
      },
    };
  };

  useEffect(() => {
    const loadOrder = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        if (orderId) {
          const fetched = await getOrderApi(currentUser.id, orderId);
          if (fetched) {
            setOrder(buildOrderState(fetched, orderId));
          }
        } else {
          const orders = await getOrdersApi(currentUser.id);
          const first = orders[0];
          if (first) {
            setOrder(buildOrderState(first, first.id));
          }
        }
      } catch (err) {
        console.error("Failed to load order", err);
        showNotification(err.message || "Failed to load order", "danger");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [currentUser, orderId]);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const apiBooks = await fetchBooksFromApi();
        setBooks(Array.isArray(apiBooks) ? apiBooks : []);
      } catch (error) {
        console.error("Failed to load books for recommendations", error);
        setBooks([]);
      }
    };

    loadBooks();
  }, []);

  useEffect(() => {
    if (order && searchParams.get("view") === "tracking") {
      setShowTrackModal(true);
    }
  }, [order, searchParams]);

  const trackingUpdates =
    order?.trackingUpdates?.length > 0
      ? order.trackingUpdates
      : getTrackingUpdates(order?.id);

  const recommendedBooks = useMemo(() => {
    if (!order) return [];
    const selectedBookIds = getOrderedDatasetBookIds(order, books);
    const recommendedBookIds = getRecommendedBookIds(selectedBookIds, recommendationRules, books, 4);
    return getRecommendedBooksByIds(recommendedBookIds, books);
  }, [order, books, recommendationRules]);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  // Handle adding book to cart
  const handleAddToCart = (bookId, quantity = 1) => {
    const user = getCurrentUser();
    if (!user) {
      showNotification("Please login to add items to cart", "warning");
      navigate("/login");
      return;
    }

    const book = books.find((b) => b.id === bookId);
    if (!book) return;

    const addBookToCart = async () => {
      try {
        const items = await addCartItemApi(user.id, book.id, quantity);
        const normalizedItems = Array.isArray(items)
          ? items.map((item) => ({
              id: item.bookId,
              quantity: item.quantity,
              title: item.title,
              price: item.price,
              image: item.image,
              stock: item.stock,
            }))
          : [];

        if (normalizedItems.length > 0) {
          dispatch({ type: "cart/setCart", payload: normalizedItems });
        } else {
          dispatch(
            addItem({
              id: book.id,
              title: book.title,
              author: book.author,
              price: book.price,
              image: book.image,
              quantity,
              stock: book.stock,
            }),
          );
        }

        showNotification("Book added to cart!", "success");
      } catch (error) {
        showNotification(error.message || "Failed to add book to cart.", "danger");
      }
    };

    addBookToCart();
  };

  // Handle invoice download
  const handleDownloadInvoice = () => {
    const user = getCurrentUser();
    if (!user || !order) return;

    const success = downloadInvoice(order, user, trackingUpdates);
    if (success) {
      alert("Invoice downloaded successfully!");
    } else {
      alert("Failed to download invoice. Please try again.");
    }
  };

  // Handle support request
  const handleSupportRequest = async (message) => {
    const user = getCurrentUser();
    if (!user || !order) return;

    try {
      await createSupportMessage({ order, user, message });
      showNotification("Your support request has been sent.", "success");
      setShowSupportModal(false);
    } catch (error) {
      showNotification(error.message || "Failed to send your support request.", "danger");
    }
  };

  if (loading) {
    return (
      <div className="order-confirmation-page">
        <Container className="mt-5">
          <div className="form-container text-center py-5">
            <FontAwesomeIcon icon={faBookOpen} size="3x" className="mb-3 text-muted" />
            <h4>Loading order...</h4>
          </div>
        </Container>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-confirmation-page">
        <Container className="mt-5">
          <div className="form-container">
            <div className="confirmation-empty text-center py-5">
              <FontAwesomeIcon
                icon={faBookOpen}
                size="3x"
                className="mb-3 text-muted"
              />
              <h4>No Order Found</h4>
              <p className="text-muted">
                We couldn't find your order confirmation.
              </p>
              <div className="mt-3">
                <Link to="/marketplace" className="btn btn-primary me-2">
                  <FontAwesomeIcon icon="store" className="me-2" />
                  Continue Shopping
                </Link>
                <Link to="/user-profile" className="btn btn-outline-primary">
                  View Order History
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  const shippingMethod = order.shipping?.shippingMethod || "standard";
  const methodDetails = shippingMethods[shippingMethod];
  const { shipDate, deliveryDate, processingDays } =
    calculateEstimatedDates(shippingMethod);

  return (
    <div className="order-confirmation-page">
      {/* Confirmation Content */}
      <Container className="mt-4">
        <Row className="justify-content-center">
          <Col lg={10}>
            <div className="form-container">
              {/* Progress Steps */}
              <ProgressSteps currentStep={3} />

              {/* Confirmation Header */}
              <ConfirmationHeader
                methodDetails={methodDetails}
                onTrackOrder={() => setShowTrackModal(true)}
                onContinueShopping={() => navigate("/marketplace")}
              />

              <Row>
                <Col lg={8}>
                  {/* Order Details Card */}
                  <Card className="order-details-card mb-4">
                    <Card.Body>
                      <h5 className="mb-4">
                        <FontAwesomeIcon icon="book" className="me-2" />
                        Order Details
                      </h5>

                      <OrderInfoSection order={order} />

                      <ShippingInfoSection
                        order={order}
                        methodDetails={methodDetails}
                      />

                      <OrderItemsSection items={order.items} />
                    </Card.Body>
                  </Card>

                  {/* Order Actions */}
                  <OrderActions
                    onContinueShopping={() => navigate("/marketplace")}
                    onViewOrderHistory={() => navigate("/user-profile")}
                    onDownloadInvoice={handleDownloadInvoice}
                  />
                </Col>

                <Col lg={4}>
                  {/* Order Summary */}
                  <OrderSummaryCard
                    order={order}
                    methodDetails={methodDetails}
                  />

                  {/* Delivery Timeline */}
                  <DeliveryTimeline
                    shipDate={shipDate}
                    deliveryDate={deliveryDate}
                    processingDays={processingDays}
                    trackingUpdates={trackingUpdates}
                    currentStatus={order?.status}
                  />

                  {/* Support Options */}
                  <SupportOptions
                    onViewOrderStatus={() => setShowTrackModal(true)}
                    onContactSupport={() => setShowSupportModal(true)}
                  />
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Recommended Books */}
      <RecommendedBooks
        books={recommendedBooks}
        onAddToCart={handleAddToCart}
      />

      {/* Modals */}
      <TrackOrderModal
        show={showTrackModal}
        onHide={() => setShowTrackModal(false)}
        order={order}
        methodDetails={methodDetails}
        trackingUpdates={trackingUpdates}
        deliveryDate={deliveryDate}
        processingDays={processingDays}
      />

      <ContactSupportModal
        show={showSupportModal}
        onHide={() => setShowSupportModal(false)}
        order={order}
        onSubmit={handleSupportRequest}
      />

    </div>
  );
};

export default OrderConfirmation;
