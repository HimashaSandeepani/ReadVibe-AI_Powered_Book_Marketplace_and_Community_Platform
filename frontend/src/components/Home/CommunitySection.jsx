// Home page section that previews community activity and posts.
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComments,
  faClock,
  faHeart,
  faComment,
  faShareAlt,
  faPaperPlane,
  faUsers,
  faInbox,
} from "@fortawesome/free-solid-svg-icons";
import {
  fetchCommunityPostsApi,
  fetchCommunityPostWithCommentsApi,
  toggleCommunityPostLikeApi,
  addCommunityCommentApi,
  emitCommunityPostsUpdated,
} from "../../utils/communityApi";
import { getCurrentUser } from "../../utils/auth";
import {
  getHomeFeaturedCommunityPostIds,
  resolveHomeFeaturedCommunityPosts,
} from "../../utils/homeFeaturedCommunityPosts";
import { isPrivilegedUser } from "../../utils/auth";

// Home page section that previews community activity and posts.
const CommunitySection = ({ currentUser }) => {
  const [communityPosts, setCommunityPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentInputs, setCommentInputs] = useState({});
  const [expandedComments, setExpandedComments] = useState({});

  const resolveCurrentUser = () => currentUser || getCurrentUser();
  const actionsDisabled = isPrivilegedUser();

  // Normalizes comment records into the home preview shape.
  const mapCommentToUi = (comment) => ({
    user: comment.userFullName || comment.username || comment.user || "User",
    comment: comment.content,
    timestamp: comment.createdAt || comment.timestamp || null,
  });

  // Formats timestamps for the preview cards.
  const formatCommentTimestamp = (timestamp) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleString();
  };

  // Loads the featured community posts shown on the home page.
  const loadPosts = async () => {
    setLoading(true);
    try {
      const posts = await fetchCommunityPostsApi();
      const selectedIds = getHomeFeaturedCommunityPostIds();
      const previewSelection = resolveHomeFeaturedCommunityPosts(posts, selectedIds);

      const previewPosts = await Promise.all(
        previewSelection.map(async (post) => {
          const details = await fetchCommunityPostWithCommentsApi(post.id);
          const comments = Array.isArray(details.comments) ? details.comments : [];
          const name = post.userFullName || post.username || "User";
          const initials = name
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase() || "U")
            .join("");

          return {
            id: String(post.id),
            user: name,
            initials: initials || "US",
            time: post.createdAt ? new Date(post.createdAt).toLocaleString() : "Recently",
            content: post.content,
            category: post.category || "Discussion",
            likes: Number(post.likesCount) || 0,
            comments: Number(post.commentsCount) || comments.length || 0,
            commentsList: comments.map(mapCommentToUi),
          };
        }),
      );

      setCommunityPosts(previewPosts);
    } catch (error) {
      console.error("Failed to load community posts for home preview", error);
      setCommunityPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPosts();

    // Refreshes the preview when community posts change elsewhere.
    const handleCommunityPostsUpdated = () => {
      void loadPosts();
    };

    window.addEventListener("community-posts-updated", handleCommunityPostsUpdated);
    return () => {
      window.removeEventListener("community-posts-updated", handleCommunityPostsUpdated);
    };
  }, []);

  // Toggles a community post like for the current user.
  const handleLike = async (postId) => {
    const user = resolveCurrentUser();
    if (!user) {
      alert("Please login to like posts");
      return;
    }

    if (actionsDisabled) {
      alert("Admin and stock manager accounts cannot like posts.");
      return;
    }

    try {
      const result = await toggleCommunityPostLikeApi({
        userId: user.id,
        postId: Number(postId),
      });

      setCommunityPosts((prev) =>
        prev.map((post) =>
          String(post.id) === String(postId)
            ? {
                ...post,
                likes: typeof result?.likesCount === "number" ? result.likesCount : post.likes,
              }
            : post,
        ),
      );

      emitCommunityPostsUpdated();
    } catch (error) {
      console.error("Failed to toggle home community like", error);
      alert(error.message || "Failed to like post");
    }
  };

  // Adds a comment to the selected community post.
  const handleAddComment = async (postId) => {
    const user = resolveCurrentUser();
    if (!user) {
      alert("Please login to comment on posts");
      return;
    }

    if (actionsDisabled) {
      alert("Admin and stock manager accounts cannot comment on posts.");
      return;
    }

    const commentText = (commentInputs[postId] || "").trim();
    if (!commentText) return;

    try {
      await addCommunityCommentApi({
        userId: user.id,
        postId: Number(postId),
        content: commentText,
      });

      setCommunityPosts((prev) =>
        prev.map((post) =>
          String(post.id) === String(postId)
            ? {
                ...post,
                comments: post.comments + 1,
                commentsList: [
                  ...post.commentsList,
                  {
                    user: user.fullName || user.userFullName || user.username || "You",
                    comment: commentText,
                    timestamp: new Date().toISOString(),
                  },
                ],
              }
            : post,
        ),
      );

      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
      emitCommunityPostsUpdated();
    } catch (error) {
      console.error("Failed to add home community comment", error);
      alert(error.message || "Failed to add comment");
    }
  };

  // Shares a community post using the native share API or clipboard.
  const handleShare = async (post) => {
    if (actionsDisabled) {
      alert("Admin and stock manager accounts cannot share posts.");
      return;
    }

    const shareText = `Check out this book discussion on ReadVibe: "${post.content.substring(0, 100)}..."`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      await navigator.share({
        title: "ReadVibe Community Post",
        text: shareText,
        url: shareUrl,
      });
      return;
    }

    await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
    alert("Post link copied to clipboard!");
  };

  // Expands or collapses the comment list for a post.
  const toggleComments = (postId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const renderCommunityPost = (post) => (
    <div className="community-card">
      <div className="d-flex align-items-center mb-3">
        <div className="user-avatar">{post.initials}</div>
        <div>
          <h6 className="mb-0">{post.user}</h6>
          <small className="text-muted">
            <FontAwesomeIcon icon={faClock} className="me-1" />
            {post.time}
          </small>
        </div>
      </div>

      <p>{post.content}</p>

      <div className="d-flex flex-wrap gap-2">
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={() => handleLike(post.id)}
          disabled={!resolveCurrentUser() || actionsDisabled}
          title={actionsDisabled ? "Not available for admin or stock manager accounts" : !resolveCurrentUser() ? "Login to like" : "Like this post"}
        >
          <FontAwesomeIcon icon={faHeart} className="me-1" />
          {post.likes}
        </Button>
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={() => toggleComments(post.id)}
          disabled={actionsDisabled}
          title={actionsDisabled ? "Not available for admin or stock manager accounts" : expandedComments[post.id] ? "Hide comments" : "Show comments"}
        >
          <FontAwesomeIcon icon={faComment} className="me-1" />
          {post.comments}
        </Button>
        <Button variant="outline-secondary" size="sm" onClick={() => handleShare(post)} title={actionsDisabled ? "Not available for admin or stock manager accounts" : "Share this post"} disabled={actionsDisabled}>
          <FontAwesomeIcon icon={faShareAlt} className="me-1" />
          Share
        </Button>
      </div>

      {expandedComments[post.id] && (
        <div className="comments-section mt-3">
          <h6 className="mb-2">
            <FontAwesomeIcon icon={faComment} className="me-2" />
            Comments ({post.comments})
          </h6>
          <div className="comment-list">
            {post.commentsList.length > 0 ? (
              post.commentsList.map((comment, index) => (
                <div key={index} className="comment-item mb-2">
                  <small className="text-muted">{comment.user}</small>
                  <p className="mb-1">{comment.comment}</p>
                  {comment.timestamp && (
                    <small className="text-muted d-block">
                      {formatCommentTimestamp(comment.timestamp)}
                    </small>
                  )}
                </div>
              ))
            ) : (
              <p className="text-muted small mb-0">No comments yet.</p>
            )}
          </div>

          {resolveCurrentUser() && (
            <div className="add-comment mt-3">
              <Form.Group>
                <Form.Control
                  id={`home-comment-${post.id}`}
                  type="text"
                  placeholder="Add a comment..."
                  value={commentInputs[post.id] || ""}
                  onChange={(e) =>
                    setCommentInputs((prev) => ({
                      ...prev,
                      [post.id]: e.target.value,
                    }))
                  }
                  size="sm"
                  disabled={actionsDisabled}
                />
                <Button
                  variant="primary"
                  size="sm"
                  className="mt-2"
                  onClick={() => handleAddComment(post.id)}
                  disabled={actionsDisabled || !(commentInputs[post.id] || "").trim()}
                >
                  <FontAwesomeIcon icon={faPaperPlane} className="me-2" />
                  Post Comment
                </Button>
              </Form.Group>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <Container className="my-5">
      <h2 className="section-title">
        <FontAwesomeIcon icon={faComments} className="me-2" />
        From Our Community
        <div className="section-title-line"></div>
      </h2>

      {loading ? (
        <Row>
          <Col xs={12} className="text-center py-5">
            <p className="text-muted mb-0">Loading community posts...</p>
          </Col>
        </Row>
      ) : communityPosts.length > 0 ? (
        <Row>
          {communityPosts.map((post) => (
            <Col md={6} key={post.id} className="mb-4">
              {renderCommunityPost(post)}
            </Col>
          ))}
        </Row>
      ) : (
        <Row>
          <Col xs={12}>
            <div className="community-card text-center py-5">
              <FontAwesomeIcon icon={faInbox} className="fa-3x text-muted mb-3" />
              <h5 className="mb-2">No community posts yet</h5>
              <p className="text-muted mb-0">Be the first to start a discussion in the community.</p>
            </div>
          </Col>
        </Row>
      )}

      <div className="text-center mt-4">
        <Link to="/community" className="btn btn-outline-primary join-conversation-btn">
          <FontAwesomeIcon icon={faUsers} className="me-2" />
          Join the Conversation
        </Link>
      </div>
    </Container>
  );
};

export default CommunitySection;
