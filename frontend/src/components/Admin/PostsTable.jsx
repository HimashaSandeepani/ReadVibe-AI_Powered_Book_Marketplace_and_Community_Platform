// Table of community posts in the admin panel.
import React from "react";
import { getStatusBadgeClass } from "./utils";

// Formats post timestamps for table display.
const formatTimestamp = (value) => {
  if (!value) return "Recently";

  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleString();
  } catch {
    return String(value);
  }
};

// Admin posts table component.
const PostsTable = ({ posts, onViewPost, onDeletePost }) => {
  return (
    <div className="admin-dashboard-card">
      <div className="table-responsive">
        <table className="table table-hover admin-table">
          <thead>
            <tr>
              <th>Post ID</th>
              <th>Posted By</th>
              <th>Title</th>
              <th>Content Preview</th>
              <th>Category</th>
              <th>Likes</th>
              <th>Comments</th>
              <th>Status</th>
              <th>Posted On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>{post.id}</td>
                <td>
                  {post.postedBy || post.user || "Unknown"}
                </td>
                <td>{post.title || "-"}</td>
                <td>
                  <div className="post-preview">
                    {post.content.substring(0, 100)}...
                  </div>
                </td>
                <td>
                  <span className="badge bg-secondary">{post.category}</span>
                </td>
                <td>{post.likes}</td>
                <td>{post.comments}</td>
                <td>
                  <span className={getStatusBadgeClass(post.status)}>
                    {post.status}
                  </span>
                </td>
                <td>{post.postedOn || formatTimestamp(post.timestamp)}</td>
                <td>
                  <div className="admin-action-buttons">
                    <button
                      className="btn btn-sm btn-outline-primary me-1"
                      onClick={() => onViewPost(post.id)}
                    >
                      <i className="fas fa-eye"></i> View
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onDeletePost(post.id)}
                    >
                      <i className="fas fa-trash"></i> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PostsTable;
