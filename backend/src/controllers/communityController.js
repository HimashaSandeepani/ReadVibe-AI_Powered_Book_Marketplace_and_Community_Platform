// Controller layer for community post requests.
import {
  listPosts,
  getPostById,
  createPost,
  deletePost,
  listCommentsForPost,
  createComment,
  toggleLike,
  listBookRequests,
  createBookRequest,
  updateBookRequestStatus,
} from '../models/communityModel.js';

// Extracts the current user id from the request and validates it.
const ensureUserId = (req) => {
  const raw = req.headers['x-user-id'] || req.query.userId || req.body.userId;
  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error('userId is required');
  }
  return parsed;
};

// Returns all community posts.
export const getCommunityPosts = async (_req, res, next) => {
  try {
    const posts = await listPosts();
    res.json({ posts });
  } catch (err) {
    next(err);
  }
};

// Returns one post together with its comments.
export const getCommunityPost = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const post = await getPostById(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    const comments = await listCommentsForPost(id);
    res.json({ post, comments });
  } catch (err) {
    next(err);
  }
};

// Creates a new community post for the signed-in user.
export const createCommunityPost = async (req, res, next) => {
  try {
    const userId = ensureUserId(req);
    const { title, category, content, bookId, bookTitle } = req.body;
    const parsedBookId = Number(bookId);

    const post = await createPost({
      userId,
      title: typeof title === 'string' && title.trim() ? title.trim() : null,
      category: category || null,
      content,
      bookId: Number.isInteger(parsedBookId) && parsedBookId > 0 ? parsedBookId : null,
      bookTitle: typeof bookTitle === 'string' && bookTitle.trim() ? bookTitle.trim() : null,
    });
    res.status(201).json({ post });
  } catch (err) {
    next(err);
  }
};

// Deletes a community post by id.
export const deleteCommunityPost = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await deletePost(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// Adds a comment to a community post.
export const addCommentToPost = async (req, res, next) => {
  try {
    const userId = ensureUserId(req);
    const postId = Number(req.params.id);
    const { content } = req.body;

    const comments = await createComment({ postId, userId, content });
    res.status(201).json({ comments });
  } catch (err) {
    next(err);
  }
};

// Toggles the current user's like state for a post.
export const togglePostLike = async (req, res, next) => {
  try {
    const userId = ensureUserId(req);
    const postId = Number(req.params.id);
    const result = await toggleLike({ postId, userId });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// Returns all submitted book requests.
export const getBookRequests = async (_req, res, next) => {
  try {
    const requests = await listBookRequests();
    res.json({ requests });
  } catch (err) {
    next(err);
  }
};

// Creates a new book request from the current user.
export const createBookRequestHandler = async (req, res, next) => {
  try {
    const userId = ensureUserId(req);
    const { bookTitle, author, isbn, category, reason } = req.body;

    const request = await createBookRequest({
      userId,
      bookTitle,
      author,
      isbn,
      category,
      reason,
    });

    res.status(201).json({ request });
  } catch (err) {
    next(err);
  }
};

// Updates the status of an existing book request.
export const updateBookRequestStatusHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    const request = await updateBookRequestStatus(id, status);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    res.json({ request });
  } catch (err) {
    next(err);
  }
};
