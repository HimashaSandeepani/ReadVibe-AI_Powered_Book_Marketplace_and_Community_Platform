// Community page for discussion posts, book requests, and engagement.
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/pages/Community.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Import components
import Header from "../components/Community/CommunityHeader";
import GuestNotice from "../components/Community/GuestNotice";
import EmptyState from "../components/Community/EmptyState";
import PostCard from "../components/Community/PostCard";
import Sidebar from "../components/Community/Sidebar";
import CreatePostModal from "../components/Community/CreatePostModal";
import RequestBookModal from "../components/Community/RequestBookModal";
import {
  fetchCommunityPostsApi,
  fetchCommunityPostWithCommentsApi,
  createCommunityPostApi,
  toggleCommunityPostLikeApi,
  addCommunityCommentApi,
  createBookRequestApi,
  emitCommunityPostsUpdated,
} from "../utils/communityApi";
import { fetchBooksFromApi } from "../components/StockManager/utils";
import { isPrivilegedUser } from "../utils/auth";

// Builds the default community feed used when no API data is available.
const createDefaultCommunityPosts = () => [
  {
    id: "P001",
    user: "john_doe",
    content:
      "Just finished 'Project Hail Mary' and it's absolutely mind-blowing! The character development is incredible. Highly recommend to all sci-fi lovers!",
    image: "/assets/The_Midnight_Library.jpeg",
    likes: 24,
    comments: 8,
    status: "Active",
    timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
    category: "Book Review",
    commentsList: [
      {
        user: "sarah_j",
        content:
          "I totally agree! The ending had me in tears. One of the best books I've read this year.",
        timestamp: new Date(Date.now() - 3600000)
          .toISOString()
          .replace("T", " ")
          .substring(0, 19),
      },
    ],
    likedBy: [],
    userDisplay: {
      name: "John Doe",
      avatar: "JD",
    },
  },
  {
    id: "P002",
    user: "sarah_j",
    content:
      "Looking for fantasy recommendations similar to Brandon Sanderson's works. Any suggestions? I've already read Wheel of Time and Kingkiller Chronicle.",
    likes: 45,
    comments: 12,
    status: "Active",
    timestamp: new Date(Date.now() - 18000000)
      .toISOString()
      .replace("T", " ")
      .substring(0, 19),
    category: "Recommendation",
    commentsList: [],
    likedBy: [],
    userDisplay: {
      name: "Sarah Johnson",
      avatar: "SJ",
    },
  },
];

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

// Loads stored categories for the community request form.
const getStoredCategories = () => {
  if (typeof window === "undefined") return [];

  try {
    const stored = JSON.parse(window.localStorage.getItem("categories"));
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
};

// Reads the current user for the community page.
const getStoredCurrentUser = () => {
  const storedUser = localStorage.getItem("currentUser");
  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    return null;
  }
};

// Converts a username into a readable display name.
const humanizeUsername = (username) => {
  if (!username) return "User";
  return username
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Normalizes a community post from the API into the UI format.
const mapApiPostToUi = (post) => {
  if (!post) return null;

  const username = post.username || (post.userId ? `user_${post.userId}` : "user");
  const name = post.userFullName || humanizeUsername(username);
  const avatar = name.substring(0, 2).toUpperCase();

  return {
    id: String(post.id),
    user: username,
    title: post.title || "",
    content: post.content,
    category: post.category || "Discussion",
    bookReference: post.bookTitle || null,
    image: "",
    likes: typeof post.likesCount === "number" ? post.likesCount : 0,
    comments: typeof post.commentsCount === "number" ? post.commentsCount : 0,
    status: !post.status || post.status.toLowerCase() === "active" ? "Active" : post.status,
    timestamp: post.createdAt || new Date().toISOString(),
    commentsList: [],
    likedBy: Array.isArray(post.likedByUserIds)
      ? post.likedByUserIds
          .map((id) => Number(id))
          .filter((id) => Number.isInteger(id) && id > 0)
      : [],
    userDisplay: {
      name,
      avatar,
    },
  };
};

// Normalizes a community comment from the API into the UI format.
const mapApiCommentToUi = (comment) => {
  if (!comment) return null;

  const username = comment.username || (comment.userId ? `user_${comment.userId}` : "user");
  const name = comment.userFullName || comment.userDisplay?.name || humanizeUsername(username);
  const avatar = name.substring(0, 2).toUpperCase();

  return {
    id: comment.id,
    user: username,
    content: comment.content,
    timestamp: comment.createdAt || new Date().toISOString(),
    userDisplay: {
      name,
      avatar,
    },
  };
};

// Community page component.
const Community = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => getStoredCurrentUser());
  const [communityPosts, setCommunityPosts] = useState([]);

  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [showRequestBookModal, setShowRequestBookModal] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postCategory, setPostCategory] = useState("Discussion");
  const [bookName, setBookName] = useState("");
  const [requestCategories, setRequestCategories] = useState(DEFAULT_REQUEST_CATEGORIES);
  const postContentRef = useRef(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [expandedComments, setExpandedComments] = useState({});

  // Book request form state
  const [requestForm, setRequestForm] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "",
    reason: "",
  });

  const postCategories = [
    "Discussion",
    "Book Review",
    "Recommendation",
    "Question",
  ];

  const popularTags = [
    ...postCategories,
  ];

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "currentUser") {
        setCurrentUser(getStoredCurrentUser());
      }

      if (event.key === "categories") {
        const storedCategories = getStoredCategories();
        setRequestCategories((current) => {
          const next = new Set([...DEFAULT_REQUEST_CATEGORIES, ...storedCategories, ...current]);
          return [...next].sort((left, right) => left.localeCompare(right));
        });
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

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
    const loadPosts = async () => {
      try {
        const posts = await fetchCommunityPostsApi();
        const mapped = await Promise.all(
          posts.map(async (post) => {
            const basePost = mapApiPostToUi(post);
            if (!basePost) return null;

            try {
              const details = await fetchCommunityPostWithCommentsApi(post.id);
              const comments = Array.isArray(details.comments) ? details.comments : [];

              return {
                ...basePost,
                comments: Number(details.post?.commentsCount) || comments.length || basePost.comments,
                commentsList: comments.map(mapApiCommentToUi),
              };
            } catch {
              return basePost;
            }
          }),
        );
        const nextPosts = mapped.filter((post) => post !== null);
        setCommunityPosts(nextPosts);

        try {
          const adminPosts = nextPosts.map((p) => {
            const { userDisplay, commentsList, likedBy, ...rest } = p;
            return rest;
          });
          localStorage.setItem(
            "adminCommunityPosts",
            JSON.stringify(adminPosts),
          );
        } catch (err) {
          console.error("Error syncing adminCommunityPosts from API:", err);
        }
      } catch (err) {
        console.error("Failed to load community posts from API, using defaults", err);
        setCommunityPosts(createDefaultCommunityPosts());
      }
    };

    const handleCommunityPostsUpdated = () => {
      loadPosts();
    };

    loadPosts();
    window.addEventListener("community-posts-updated", handleCommunityPostsUpdated);

    return () => {
      window.removeEventListener("community-posts-updated", handleCommunityPostsUpdated);
    };
  }, []);

  // Safe function to get user avatar
  const getUserAvatar = (user) => {
    if (!user) return "US";

    if (
      typeof user === "object" &&
      user.userDisplay &&
      user.userDisplay.avatar
    ) {
      return user.userDisplay.avatar;
    }

    if (typeof user === "object" && user.name) {
      return user.name.substring(0, 2).toUpperCase();
    }

    if (typeof user === "string") {
      return user.substring(0, 2).toUpperCase();
    }

    return "US";
  };

  // Safe function to get user name
  const getUserName = (user) => {
    if (!user) return "User";

    if (typeof user === "object" && user.userDisplay && user.userDisplay.name) {
      return user.userDisplay.name;
    }

    if (typeof user === "object" && user.name) {
      return user.name;
    }

    if (typeof user === "string") {
      // Convert username like "john_doe" to "John Doe"
      return user
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }

    return "User";
  };

  const topContributors = useMemo(() => {
    const contributorMap = new Map();

    communityPosts.forEach((post) => {
      const name = getUserName(post);
      const avatar = getUserAvatar(post);
      const key = post.userId || post.user || name;
      const existing = contributorMap.get(key) || {
        name,
        avatar,
        posts: 0,
      };

      contributorMap.set(key, {
        ...existing,
        name,
        avatar,
        posts: existing.posts + 1,
      });
    });

    return Array.from(contributorMap.values())
      .sort((a, b) => b.posts - a.posts || a.name.localeCompare(b.name))
      .slice(0, 3);
  }, [communityPosts]);

  // Enhanced function to check if user can create post
  const canCreatePost = () => {
    if (!currentUser) {
      return {
        canProceed: false,
        message: "Please login to create posts",
        redirectTo: "/login",
      };
    }
    if (isPrivilegedUser()) {
      return {
        canProceed: false,
        message: "Admin and stock manager accounts cannot create community posts",
      };
    }
    return { canProceed: true };
  };

  // Enhanced function to check if user can like or comment
  const canInteract = () => {
    if (!currentUser) {
      return {
        canProceed: false,
        message: "Please login to interact with posts",
        redirectTo: "/login",
      };
    }
    if (isPrivilegedUser()) {
      return {
        canProceed: false,
        message: "Admin and stock manager accounts cannot like, comment, or share posts",
      };
    }
    return { canProceed: true };
  };

  // Enhanced function to check if user can request book
  const canRequestBook = () => {
    if (!currentUser) {
      return {
        canProceed: false,
        message: "Please login to request books",
        redirectTo: "/login",
      };
    }
    if (isPrivilegedUser()) {
      return {
        canProceed: false,
        message: "Admin and stock manager accounts cannot create book requests",
      };
    }
    return { canProceed: true };
  };

  const handleCreatePost = async () => {
    const check = canCreatePost();
    if (!check.canProceed) {
      if (window.confirm(`${check.message}. Do you want to login now?`)) {
        navigate(check.redirectTo);
      }
      return;
    }

    const currentContent = postContentRef.current?.value ?? postContent;
    const trimmedContent = currentContent.trim();

    if (!trimmedContent) {
      alert("Please enter post content");
      return;
    }

    try {
      const createdPost = await createCommunityPostApi({
        userId: currentUser.id,
        title: postTitle.trim(),
        content: trimmedContent,
        category: postCategory,
        bookTitle: bookName || undefined,
      });

      const uiPostFromApi = mapApiPostToUi(createdPost);
      const uiPost = {
        ...uiPostFromApi,
        title: uiPostFromApi.title || postContent,
        bookReference: bookName || uiPostFromApi.bookReference,
      };

      setCommunityPosts((prev) => [uiPost, ...prev]);

      try {
        const adminPosts =
          JSON.parse(localStorage.getItem("adminCommunityPosts")) || [];
        const { userDisplay, commentsList, likedBy, ...adminPost } = uiPost;
        const updatedAdminPosts = [adminPost, ...adminPosts];
        localStorage.setItem(
          "adminCommunityPosts",
          JSON.stringify(updatedAdminPosts),
        );
      } catch (error) {
        console.error("Error updating admin panel posts from created post:", error);
      }

      setPostTitle("");
      setPostContent("");
      setPostCategory("Discussion");
      setBookName("");
      setShowCreatePostModal(false);
      if (postContentRef.current) {
        postContentRef.current.value = "";
      }

      alert(
        "Post created successfully! It will now appear in the Admin Panel for review.",
      );
      emitCommunityPostsUpdated();
    } catch (error) {
      console.error("Failed to create post:", error);
      alert(error.message || "Failed to create post. Please try again.");
    }
  };

  const handleLikePost = async (postId) => {
    const check = canInteract();
    if (!check.canProceed) {
      if (window.confirm(`${check.message}. Do you want to login now?`)) {
        navigate(check.redirectTo);
      }
      return;
    }

    const numericId = Number(postId);
    if (!Number.isFinite(numericId)) {
      console.error("Invalid postId for like:", postId);
      return;
    }

    try {
      const result = await toggleCommunityPostLikeApi({
        userId: currentUser.id,
        postId: numericId,
      });

      setCommunityPosts((prev) =>
        prev.map((post) => {
          if (post.id === postId || Number(post.id) === numericId) {
            const likedBySet = new Set(post.likedBy || []);
            if (result?.liked) {
              likedBySet.add(currentUser.id);
            } else {
              likedBySet.delete(currentUser.id);
            }

            const updatedPost = {
              ...post,
              likes:
                typeof result?.likesCount === "number"
                  ? result.likesCount
                  : post.likes,
              likedBy: Array.from(likedBySet),
            };

            updatePostInAdminPanel(updatedPost);
            return updatedPost;
          }
          return post;
        }),
      );
      emitCommunityPostsUpdated();
    } catch (error) {
      console.error("Failed to toggle like:", error);
      alert(error.message || "Failed to update like. Please try again.");
    }
  };

  // Helper function to update post in admin panel storage
  const updatePostInAdminPanel = (updatedPost) => {
    try {
      const adminPosts =
        JSON.parse(localStorage.getItem("adminCommunityPosts")) || [];
      const adminPostIndex = adminPosts.findIndex(
        (p) => p.id === updatedPost.id,
      );

      if (adminPostIndex !== -1) {
        // Clone the post without community-specific fields
        const adminPost = { ...updatedPost };
        delete adminPost.userDisplay;

        adminPosts[adminPostIndex] = adminPost;
        localStorage.setItem("adminCommunityPosts", JSON.stringify(adminPosts));
      }
    } catch (error) {
      console.error("Error updating admin panel:", error);
    }
  };

  const handleAddComment = async (postId, commentText) => {
    const check = canInteract();
    if (!check.canProceed) {
      if (window.confirm(`${check.message}. Do you want to login now?`)) {
        navigate(check.redirectTo);
      }
      return;
    }

    const comment = commentText || "";
    if (!comment.trim()) return;

    const numericId = Number(postId);
    if (!Number.isFinite(numericId)) {
      console.error("Invalid postId for comment:", postId);
      return;
    }

    try {
      const comments = await addCommunityCommentApi({
        userId: currentUser.id,
        postId: numericId,
        content: comment,
      });

      const mappedComments = comments
        .map(mapApiCommentToUi)
        .filter((c) => c !== null);

      setCommunityPosts((prev) =>
        prev.map((post) => {
          if (post.id === postId || Number(post.id) === numericId) {
            const updatedPost = {
              ...post,
              comments: mappedComments.length,
              commentsList: mappedComments,
            };
            updatePostInAdminPanel(updatedPost);
            return updatedPost;
          }
          return post;
        }),
      );

      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
      emitCommunityPostsUpdated();
    } catch (error) {
      console.error("Failed to add comment:", error);
      alert(error.message || "Failed to add comment. Please try again.");
    }
  };

  // Enhanced modal open handlers with login check
  const handleOpenCreatePostModal = () => {
    const check = canCreatePost();
    if (!check.canProceed) {
      if (window.confirm(`${check.message}. Do you want to login now?`)) {
        navigate(check.redirectTo);
      }
      return;
    }
    setShowCreatePostModal(true);
  };

  const handleOpenRequestBookModal = () => {
    const check = canRequestBook();
    if (!check.canProceed) {
      if (window.confirm(`${check.message}. Do you want to login now?`)) {
        navigate(check.redirectTo);
      }
      return;
    }
    setShowRequestBookModal(true);
  };

  const toggleComments = (postId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleSharePost = (postId) => {
    const post = communityPosts.find((p) => p.id === postId);
    if (!post) return;

    const shareText = `Check out this book discussion on ReadVibe: "${post.content.substring(
      0,
      100,
    )}..."`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      navigator.share({
        title: "ReadVibe Community Post",
        text: shareText,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareText + "\n\n" + shareUrl);
      alert("Post link copied to clipboard!");
    }
  };

  const handleRequestBook = async () => {
    const check = canRequestBook();
    if (!check.canProceed) {
      if (window.confirm(`${check.message}. Do you want to login now?`)) {
        navigate(check.redirectTo);
      }
      return;
    }

    if (!requestForm.title || !requestForm.author || !requestForm.reason) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      await createBookRequestApi({
        userId: currentUser.id,
        bookTitle: requestForm.title,
        author: requestForm.author,
        isbn: requestForm.isbn,
        category: requestForm.category,
        reason: requestForm.reason,
      });

      setRequestForm({
        title: "",
        author: "",
        isbn: "",
        category: "",
        reason: "",
      });
      setShowRequestBookModal(false);

      alert("Book request submitted successfully!");
    } catch (error) {
      console.error("Failed to submit book request:", error);
      alert(error.message || "Failed to submit book request. Please try again.");
    }
  };

  const handleTagClick = (tag) => {
    alert(`Filtering by ${tag}`);
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Recently";

    try {
      const postDate = new Date(timestamp);
      const now = new Date();
      const diffMs = now - postDate;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60)
        return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
      if (diffHours < 24)
        return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
      if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

      return postDate.toLocaleDateString();
    } catch {
      return "Recently";
    }
  };

  return (
    <div className="community-page">
      {/* Community Content */}
      <div className="container mt-4">
        <Header
          currentUser={currentUser}
          handleOpenCreatePostModal={handleOpenCreatePostModal}
          handleOpenRequestBookModal={handleOpenRequestBookModal}
        />

        {/* Guest Restriction - Enhanced */}
        {!currentUser && <GuestNotice />}

        <div className="row">
          <div className="col-lg-8">
            {/* Posts Container */}
            <div id="postsContainer">
              {communityPosts.length === 0 ? (
                <EmptyState
                  currentUser={currentUser}
                  handleOpenCreatePostModal={handleOpenCreatePostModal}
                />
              ) : (
                communityPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    currentUser={currentUser}
                      actionsDisabled={isPrivilegedUser()}
                    onLike={handleLikePost}
                    onToggleComments={toggleComments}
                    onAddComment={handleAddComment}
                    onShare={handleSharePost}
                    expandedComments={expandedComments}
                    commentInputs={commentInputs}
                    setCommentInputs={setCommentInputs}
                    getUserAvatar={getUserAvatar}
                    getUserName={getUserName}
                    formatTimestamp={formatTimestamp}
                  />
                ))
              )}
            </div>
          </div>

          <div className="col-lg-4">
            <Sidebar
              topContributors={topContributors}
              popularTags={popularTags}
              handleTagClick={handleTagClick}
            />
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        showCreatePostModal={showCreatePostModal}
        setShowCreatePostModal={setShowCreatePostModal}
        postContent={postContent}
        setPostContent={setPostContent}
        postContentRef={postContentRef}
        postTitle={postTitle}
        setPostTitle={setPostTitle}
        postCategory={postCategory}
        setPostCategory={setPostCategory}
        postCategories={postCategories}
        popularTags={popularTags}
        bookName={bookName}
        setBookName={setBookName}
        handleCreatePost={handleCreatePost}
      />

      {/* Request Book Modal */}
      <RequestBookModal
        showRequestBookModal={showRequestBookModal}
        setShowRequestBookModal={setShowRequestBookModal}
        requestForm={requestForm}
        setRequestForm={setRequestForm}
        categories={requestCategories}
        handleRequestBook={handleRequestBook}
      />

      {/* Modal backdrop */}
      {(showCreatePostModal || showRequestBookModal) && (
        <div className="modal-backdrop fade show"></div>
      )}
    </div>
  );
};

export default Community;
