// Community post card with interaction controls.
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp,
  faComment,
  faShareSquare,
  faBook,
} from "@fortawesome/free-solid-svg-icons";

// Community post card component with like, comment, and share interactions.
const PostCard = ({
  post,
  currentUser,
  actionsDisabled = false,
  onLike,
  onToggleComments,
  onAddComment,
  onShare,
  expandedComments,
  commentInputs,
  setCommentInputs,
  getUserAvatar,
  getUserName,
  formatTimestamp,
}) => {
  const [commentInput, setCommentInput] = useState(
    commentInputs[post.id] || "",
  );

  useEffect(() => {
    setCommentInput(commentInputs[post.id] || "");
  }, [commentInputs, post.id]);

  // Keeps the local comment input and shared comment state in sync.
  const handleCommentChange = (value) => {
    setCommentInput(value);
    setCommentInputs((prev) => ({ ...prev, [post.id]: value }));
  };

  return (
    <div className="community-card" key={post.id} data-post-id={post.id}>
      <div className="d-flex align-items-center mb-3">
        <div className="user-avatar">{getUserAvatar(post)}</div>
        <div>
          <h6 className="mb-0">
            {getUserName(post)}
            {post.category && (
              <span
                className="badge bg-secondary ms-2"
                style={{ fontSize: "0.7rem" }}
              >
                {post.category}
              </span>
            )}
          </h6>
          <small className="text-muted post-meta">
            {formatTimestamp(post.timestamp)}
          </small>
        </div>
      </div>
      {post.title && <h6 className="mb-2 fw-semibold">{post.title}</h6>}
      <p>{post.content}</p>
      {post.bookReference && (
        <div className="book-reference">
          <FontAwesomeIcon icon={faBook} className="me-2" />
          <small>Referenced book: {post.bookReference}</small>
        </div>
      )}
      <div className="d-flex">
        <button
          className={`btn btn-sm btn-outline-secondary me-2 like-btn ${
            currentUser && post.likedBy && post.likedBy.includes(currentUser.id)
              ? "active"
              : ""
          }`}
          onClick={() => onLike(post.id)}
          disabled={!currentUser || actionsDisabled}
          title={actionsDisabled ? "Not available for admin or stock manager accounts" : !currentUser ? "Login to like posts" : ""}
        >
          <FontAwesomeIcon icon={faThumbsUp} /> <span>{post.likes || 0}</span>
        </button>
        <button
          className="btn btn-sm btn-outline-secondary me-2 comment-btn"
          onClick={() => onToggleComments(post.id)}
          title={actionsDisabled ? "Not available for admin or stock manager accounts" : expandedComments[post.id] ? "Hide comments" : "Show comments"}
          disabled={actionsDisabled}
        >
          <FontAwesomeIcon icon={faComment} /> <span>{post.comments || 0}</span>
        </button>
        <button
          className="btn btn-sm btn-outline-secondary share-btn"
          onClick={() => onShare(post.id)}
          disabled={actionsDisabled}
        >
          <FontAwesomeIcon icon={faShareSquare} /> Share
        </button>
      </div>

      {expandedComments[post.id] && (
        <div className="mt-3">
          <div className="comments-section mb-3" id={`commentsList${post.id}`}>
            <h6 className="mb-2">
              <FontAwesomeIcon icon={faComment} className="me-2" />
              Comments ({post.comments || 0})
            </h6>

            {!post.commentsList || post.commentsList.length === 0 ? (
              <div className="text-center py-3">
                <p className="text-muted mb-0">
                  No comments yet. {currentUser ? "Be the first to comment!" : "Login to be the first to comment!"}
                </p>
              </div>
            ) : (
              post.commentsList.map((comment, index) => (
                <div className="comment-item" key={index}>
                  <div className="d-flex">
                    <div className="comment-avatar">{getUserAvatar(comment)}</div>
                    <div>
                      <h6 className="mb-0" style={{ fontSize: "0.95rem" }}>
                        {getUserName(comment)}
                      </h6>
                      <small className="text-muted">{formatTimestamp(comment.timestamp)}</small>
                      <p className="mb-0 mt-1">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="comment-input-group input-group">
            <input
              type="text"
              className="form-control comment-input"
              placeholder={
                !currentUser ? "Login to add a comment..." : "Add a comment..."
              }
              value={commentInput}
              onChange={(e) => handleCommentChange(e.target.value)}
              disabled={!currentUser || actionsDisabled}
              onKeyPress={(e) =>
                e.key === "Enter" && onAddComment(post.id, commentInput)
              }
            />
            <button
              className="btn btn-outline-primary"
              onClick={() => onAddComment(post.id, commentInput)}
              disabled={!currentUser || actionsDisabled}
              title={actionsDisabled ? "Not available for admin or stock manager accounts" : !currentUser ? "Login to comment" : ""}
            >
              Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
