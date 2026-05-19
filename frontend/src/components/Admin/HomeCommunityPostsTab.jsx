// Admin tab for home community post moderation.
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faComments, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { fetchCommunityPostsApi } from "../../utils/communityApi";
import { showNotification } from "./utils";
import {
  getHomeFeaturedCommunityPostIds,
  saveHomeFeaturedCommunityPostIds,
} from "../../utils/homeFeaturedCommunityPosts";

// Admin tab for selecting posts featured on the home page.
const HomeCommunityPostsTab = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPostIds, setSelectedPostIds] = useState(() => getHomeFeaturedCommunityPostIds());

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const apiPosts = await fetchCommunityPostsApi();
        setPosts(apiPosts);
      } catch (error) {
        console.error("Failed to load community posts for home selection", error);
        setPosts([]);
      }
    };

    const syncSelection = () => {
      setSelectedPostIds(getHomeFeaturedCommunityPostIds());
    };

    loadPosts();
    syncSelection();

    window.addEventListener("storage", syncSelection);
    return () => window.removeEventListener("storage", syncSelection);
  }, []);

  const selectedPosts = posts.filter((post) =>
    selectedPostIds.includes(String(post.id)),
  );

  // Toggles a community post in the home page feature list.
  const handleTogglePost = (postId) => {
    const normalizedId = String(postId);

    setSelectedPostIds((current) => {
      const isSelected = current.includes(normalizedId);
      const next = isSelected
        ? current.filter((id) => id !== normalizedId)
        : current.length >= 2
          ? current
          : [...current, normalizedId];

      if (!isSelected && current.length >= 2) {
        showNotification("You can only feature 2 community posts on the home page.", "warning");
        return current;
      }

      saveHomeFeaturedCommunityPostIds(next);
      showNotification(
        isSelected ? "Community post removed from home feature list." : "Community post featured on home page.",
        "success",
      );
      return next;
    });
  };

  return (
    <>
      <h2 className="mb-4">
        <FontAwesomeIcon icon={faComments} className="me-2 text-primary" />
        Home Page Community Posts
      </h2>

      <Card className="admin-dashboard-card mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <h4 className="mb-1">Select 2 Community Posts</h4>
              <p className="text-muted mb-0">
                Choose two community posts to show on the home page. If fewer than two are selected, the latest posts will be used as fallback.
              </p>
            </div>
            <span className="badge bg-primary fs-6">{selectedPostIds.length}/2 selected</span>
          </div>

          {selectedPosts.length > 0 && (
            <div className="mb-3">
              <h6 className="mb-2">Currently Featured</h6>
              <div className="d-flex flex-wrap gap-2">
                {selectedPosts.map((post) => (
                  <span key={post.id} className="badge bg-info text-dark">
                    {post.userFullName || post.username || "User"}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="alert alert-info mb-0">
            <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
            The home page community section will show exactly 2 posts.
          </div>
        </Card.Body>
      </Card>

      <div className="admin-dashboard-card">
        <h5 className="mb-4">Available Community Posts</h5>

        {posts.length === 0 ? (
          <p className="text-muted mb-0">No community posts available.</p>
        ) : (
          <Row className="g-3">
            {posts.map((post) => {
              const isSelected = selectedPostIds.includes(String(post.id));
              const author = post.userFullName || post.username || "User";

              return (
                <Col md={6} key={post.id}>
                  <div className={`border rounded p-3 h-100 ${isSelected ? "border-primary bg-light" : ""}`}>
                    <Form.Check
                      type="checkbox"
                      id={`home-post-${post.id}`}
                      className="mb-2"
                      label={author}
                      checked={isSelected}
                      onChange={() => handleTogglePost(post.id)}
                    />
                    <div className="small text-muted mb-2">
                      {post.createdAt ? new Date(post.createdAt).toLocaleString() : "Recently"}
                    </div>
                    <p className="mb-0 text-truncate" title={post.content}>
                      {post.content}
                    </p>
                    {isSelected && (
                      <div className="mt-2 text-primary small fw-medium">
                        <FontAwesomeIcon icon={faCheck} className="me-1" />
                        Featured on home page
                      </div>
                    )}
                  </div>
                </Col>
              );
            })}
          </Row>
        )}
      </div>
    </>
  );
};

export default HomeCommunityPostsTab;