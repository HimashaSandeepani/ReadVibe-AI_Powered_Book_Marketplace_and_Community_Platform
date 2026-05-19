// Community utility functions for post IDs, validation, and local storage updates.

// Generates the next community post ID from local storage.
export const generatePostId = () => {
  try {
    const posts = JSON.parse(localStorage.getItem("communityPosts")) || [];
    if (posts.length > 0 && posts[0].id) {
      const lastId = parseInt(posts[0].id.substring(1)) || posts.length;
      return `P${String(lastId + 1).padStart(3, "0")}`;
    }
  } catch (error) {
    console.error("Error generating post ID:", error);
  }
  return `P${String((JSON.parse(localStorage.getItem("communityPosts"))?.length || 0) + 1).padStart(3, "0")}`;
};

// Returns a compact avatar label for a user object or string.
export const getUserAvatar = (user) => {
  if (!user) return "US";

  if (typeof user === "object" && user.userDisplay && user.userDisplay.avatar) {
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
// Returns a display name for the current post author.
export const getUserName = (user) => {
  if (!user) return "User";

  if (typeof user === "object" && user.userDisplay && user.userDisplay.name) {
    return user.userDisplay.name;
  }

  if (typeof user === "object" && user.name) {
    return user.name;
  }

  if (typeof user === "string") {
    return user
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  return "User";
};

// Format timestamp for display
// Formats timestamps into relative or fallback labels.
export const formatTimestamp = (timestamp) => {
  if (!timestamp) return "Recently";

  try {
    const postDate = new Date(timestamp);
    const now = new Date();
    const diffMs = now - postDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

    return postDate.toLocaleDateString();
  } catch {
    return "Recently";
  }
};

// Helper function to update post in admin panel storage
// Mirrors a post update into the admin panel cache.
export const updatePostInAdminPanel = (updatedPost) => {
  try {
    const adminPosts = JSON.parse(localStorage.getItem("adminCommunityPosts")) || [];
    const adminPostIndex = adminPosts.findIndex((p) => p.id === updatedPost.id);

    if (adminPostIndex !== -1) {
      const adminPost = { ...updatedPost };
// Shared helper that blocks interactions for unauthenticated users.
      delete adminPost.userDisplay;
      adminPosts[adminPostIndex] = adminPost;
      localStorage.setItem("adminCommunityPosts", JSON.stringify(adminPosts));
    }
  } catch (ERR) {
    console.error("Error updating admin panel:", ERR);
  }
};

// Validation functions
// Blocks post creation when the user is not logged in.
export const canCreatePost = (currentUser) => {
  if (!currentUser) {
    return {
      canProceed: false,
      message: "Please login to create posts",
      redirectTo: "/login"
    };
  }
  return { canProceed: true };
};

// Blocks post interactions when the user is not logged in.
export const canInteract = (currentUser) => {
  if (!currentUser) {
    return {
      canProceed: false,
      message: "Please login to interact with posts",
      redirectTo: "/login"
    };
  }
  return { canProceed: true };
};

// Blocks book requests when the user is not logged in.
export const canRequestBook = (currentUser) => {
  if (!currentUser) {
    return {
      canProceed: false,
      message: "Please login to request books",
      redirectTo: "/login"
    };
  }
  return { canProceed: true };
};