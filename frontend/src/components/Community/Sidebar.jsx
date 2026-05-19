// Community sidebar for filters and navigation.
import React from "react";

// Community sidebar that shows contributors, tags, and guidelines.
const Sidebar = ({ topContributors, popularTags, handleTagClick }) => {
  return (
    <div className="community-sidebar sidebar-sticky">
      <h5>
        <i className="fas fa-crown me-2"></i>Top Contributors
      </h5>
      <div id="topContributors">
        {topContributors.length > 0 ? (
          topContributors.map((contributor, index) => (
            <div className="contributor-item" key={index}>
              <div className="contributor-avatar">{contributor.avatar}</div>
              <div className="contributor-info">
                <h6 className="mb-0">{contributor.name}</h6>
                <small className="text-muted">{contributor.posts} posts</small>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted small mb-0">No contributors yet.</p>
        )}
      </div>

      <h5 className="mt-4">
        <i className="fas fa-tags me-2"></i>Popular Tags
      </h5>
      <div className="popular-tags mt-2" id="popularTags">
        {popularTags.map((tag, index) => (
          <span
            key={index}
            className="badge bg-light text-dark tag-badge"
            onClick={() => handleTagClick(tag)}
            style={{ cursor: "pointer", margin: "2px" }}
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-4">
        <h5>
          <i className="fas fa-info-circle me-2"></i>Community Guidelines
        </h5>
        <div className="card border-0 bg-light mt-2">
          <div className="card-body p-3">
            <ul className="list-unstyled mb-0 small">
              <li className="mb-2">
                <i className="fas fa-check-circle text-success me-2"></i>
                Be respectful to all members
              </li>
              <li className="mb-2">
                <i className="fas fa-check-circle text-success me-2"></i>
                No spam or self-promotion
              </li>
              <li className="mb-2">
                <i className="fas fa-check-circle text-success me-2"></i>
                Stay on topic - book discussions only
              </li>
              <li>
                <i className="fas fa-check-circle text-success me-2"></i>
                Spoilers must be marked
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
