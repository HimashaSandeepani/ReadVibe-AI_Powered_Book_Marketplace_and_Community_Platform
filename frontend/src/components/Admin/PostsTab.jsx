// Admin tab for community posts.
import React from "react";

// Admin community posts tab component.
const PostsTab = () => {
  return (
    <>
      <h2 className="mb-4">Community Posts Management</h2>

      <div className="alert alert-info mb-4">
        <i className="fas fa-info-circle me-2"></i>
        Here you can view all community posts. You can view post details or
        remove inappropriate posts.
      </div>
    </>
  );
};

export default PostsTab;
