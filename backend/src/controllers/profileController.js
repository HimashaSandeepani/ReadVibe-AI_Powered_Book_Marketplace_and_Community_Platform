// Controller layer for user profile and activity requests.
import { getUserById, updateUser } from '../models/userModel.js';
import { getOrdersForUser } from '../models/orderModel.js';
import { getWishlistForUser } from '../models/wishlistModel.js';
import { listBookRequests, listPosts } from '../models/communityModel.js';
import { createReview, deleteReviewById, listReviewsForUser } from '../models/reviewModel.js';

const ensureUserId = (req) => {
  const raw = req.headers['x-user-id'] || req.query.userId || req.body.userId;
  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    const err = new Error('userId is required');
    err.status = 400;
    throw err;
  }
  return parsed;
};

const buildRecentActivity = (orders, reviews, requests) => {
  const activities = [];

  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  sortedOrders.slice(0, 2).forEach((order) => {
    activities.push({
      type: 'purchase',
      text: `You purchased ${order.items?.length || 0} book(s)`,
      time: order.createdAt,
      icon: 'shoppingBag',
    });
  });

  const sortedReviews = [...reviews].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  sortedReviews.slice(0, 1).forEach((review) => {
    activities.push({
      type: 'review',
      text: `You reviewed "${review.bookTitle}"`,
      time: review.date,
      icon: 'star',
    });
  });

  const sortedRequests = [...requests].sort(
    (a, b) => new Date(b.createdAt || b.updatedAt) - new Date(a.createdAt || a.updatedAt)
  );
  sortedRequests.slice(0, 1).forEach((request) => {
    activities.push({
      type: 'book-request',
      text: `You added a book request for "${request.bookTitle}"`,
      time: request.createdAt || request.updatedAt,
      icon: 'book',
    });
  });

  activities.sort((a, b) => new Date(b.time) - new Date(a.time));
  return activities;
};

export const getProfileSummary = async (req, res, next) => {
  try {
    const userId = ensureUserId(req);

    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const [orders, wishlistItems, allRequests, reviews, allPosts] = await Promise.all([
      getOrdersForUser(userId),
      getWishlistForUser(userId),
      listBookRequests(),
      listReviewsForUser(userId),
      listPosts(),
    ]);

    const userRequests = allRequests.filter((r) => Number(r.userId) === userId);
    const userPosts = allPosts.filter((post) => post.userId === userId);

    const booksRead = orders.reduce(
      (total, order) =>
        total + (order.items || []).reduce((sum, item) => sum + (item.quantity || 0), 0),
      0
    );

    const stats = {
      booksRead,
      reviewsWritten: reviews.length,
      wishlistCount: wishlistItems.length,
      communityPosts: userPosts.length,
      myBookRequests: userRequests.length,
    };

    const recentActivity = buildRecentActivity(orders, reviews, userRequests);

    res.json({
      user,
      orders,
      reviews,
      bookRequests: userRequests,
      userStats: stats,
      recentActivity,
    });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const userId = ensureUserId(req);
    const updates = req.body || {};

    const existing = await getUserById(userId);
    if (!existing) {
      return res.status(404).json({ error: 'User not found' });
    }

    const mappedUpdates = {
      fullName: updates.fullName,
      email: updates.email,
      username: updates.username,
      password: updates.password,
      termsAccepted: updates.termsAccepted,
      aiEmailOptIn: updates.aiEmailOptIn,
    };

    const user = await updateUser(userId, mappedUpdates);
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

export const getMyReviews = async (req, res, next) => {
  try {
    const userId = ensureUserId(req);
    const reviews = await listReviewsForUser(userId);
    res.json({ reviews });
  } catch (err) {
    next(err);
  }
};

export const createMyReview = async (req, res, next) => {
  try {
    const userId = ensureUserId(req);
    const { bookId, rating, title, text, recommend, orderId } = req.body || {};

    const review = await createReview({
      userId,
      bookId: Number(bookId),
      rating: Number(rating),
      title,
      text,
      recommend,
      orderId: orderId ? Number(orderId) : null,
    });

    res.status(201).json({ review });
  } catch (err) {
    next(err);
  }
};

export const deleteMyReview = async (req, res, next) => {
  try {
    const userId = ensureUserId(req);
    const reviewId = Number(req.params.id);
    await deleteReviewById(userId, reviewId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
