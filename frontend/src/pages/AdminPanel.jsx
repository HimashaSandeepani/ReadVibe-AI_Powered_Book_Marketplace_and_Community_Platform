import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/pages/AdminPanel.css";
import AdminHeader from "../components/common/AdminHeader";
import AdminFooter from "../components/common/AdminFooter";

// Import Admin Components
import AdminSidebar from "../components/Admin/AdminSidebar";
import DashboardTab from "../components/Admin/DashboardTab";
import UsersTab from "../components/Admin/UsersTab";
import PostsTab from "../components/Admin/PostsTab";
import HomeCommunityPostsTab from "../components/Admin/HomeCommunityPostsTab";
import AnalyticsTab from "../components/Admin/AnalyticsTab";
import SystemTab from "../components/Admin/SystemTab";
import StatusTab from "../components/Admin/StatusTab";
import UserTable from "../components/Admin/UserTable";
import PostsTable from "../components/Admin/PostsTable";
import LiveChatTab from "../components/Admin/LiveChatTab";
import AddUserModal from "../components/Admin/AddUserModal";
import EditUserModal from "../components/Admin/EditUserModal";
import PostModal from "../components/Admin/PostModal";
import { fetchCommunityPostsApi } from "../utils/communityApi";

// Import Utilities
import {
  loadData,
  saveData,
  validateNewUser,
  validateEditUser,
  showNotification,
  fetchUsersFromApi,
  createAdminUserApi,
  updateAdminUserApi,
  deleteAdminUserApi,
} from "../components/Admin/utils";
import {
  getLiveChatThreads,
  getLiveChatUpdatedEventName,
  fetchLiveChatThreadsSummary,
  sendLiveChatMessage,
} from "../utils/liveChat";

const DEFAULT_SYSTEM_SETTINGS = {
  platformName: "ReadVibe",
  maintenanceMode: "Disabled",
  emailNotifications: true,
};

const getStoredUser = () => {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(window.localStorage.getItem("currentUser"));
  } catch (error) {
    console.error("Failed to parse currentUser from storage", error);
    return null;
  }
};

const formatAdminPostTimestamp = (value) => {
  if (!value) return "Recently";

  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleString();
  } catch {
    return String(value);
  }
};

const normalizeCommunityPost = (post) => {
  if (!post) return null;

  const postedBy =
    post.userFullName || post.username || (typeof post.user === "string" ? post.user : "User");

  return {
    ...post,
    user: postedBy,
    postedBy,
    title: post.title || "",
    likes: Number(post.likesCount ?? post.likes ?? 0),
    comments: Number(post.commentsCount ?? post.comments ?? 0),
    timestamp: post.createdAt || post.timestamp || new Date().toISOString(),
    postedOn: formatAdminPostTimestamp(post.createdAt || post.timestamp),
    status: post.status || "Active",
  };
};

const getInitialAdminData = () => {
  if (typeof window === "undefined") {
    return {
      users: [],
      posts: [],
      settings: DEFAULT_SYSTEM_SETTINGS,
    };
  }

  const {
    users = [],
    posts = [],
    settings = DEFAULT_SYSTEM_SETTINGS,
  } = loadData();
  return {
    users,
    posts,
    settings: { ...DEFAULT_SYSTEM_SETTINGS, ...settings },
  };
};

const AdminPanel = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract tab from query parameters
  const queryParams = new URLSearchParams(location.search);
  const tabFromQuery = queryParams.get("tab");
  const activeTab = tabFromQuery || "dashboard";

  const storedUser = getStoredUser();
  const initialAdminData = useMemo(() => getInitialAdminData(), []);

  // State
  const [currentUser, setCurrentUser] = useState(storedUser);
  const [activeUserSubTab, setActiveUserSubTab] = useState("all");

  // Data state
  const [users, setUsers] = useState(() => [...initialAdminData.users]);
  const [posts, setPosts] = useState(() => [...initialAdminData.posts]);
  const [systemSettings, setSystemSettings] = useState(() => ({
    ...DEFAULT_SYSTEM_SETTINGS,
    ...initialAdminData.settings,
  }));
  const [statuses, setStatuses] = useState(() => {
    const { statuses: loadedStatuses = [] } = loadData();
    return [...loadedStatuses];
  });
  const [liveChatThreads, setLiveChatThreads] = useState([]);
  const [liveChatTotalCount, setLiveChatTotalCount] = useState(0);
  const [liveChatUnreadCount, setLiveChatUnreadCount] = useState(0);

  // Modal states
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (currentUser.role !== "admin") {
      alert("Access denied. Admin privileges required.");
      navigate("/");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const pullUsers = async () => {
      if (!currentUser || currentUser.role !== "admin") return;
      try {
        const apiUsers = await fetchUsersFromApi();
        const normalized = apiUsers.map((user) => ({
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          status: (user.status || "active").toLowerCase(),
          joinDate: user.createdAt ? user.createdAt.split("T")[0] : "",
        }));
        setUsers(normalized);
      } catch (error) {
        console.error("Failed to load users from API", error);
      }
    };

    pullUsers();
  }, [currentUser]);

  useEffect(() => {
    const loadCommunityPosts = async () => {
      try {
        const apiPosts = await fetchCommunityPostsApi();
        setPosts(
          Array.isArray(apiPosts)
            ? apiPosts.map(normalizeCommunityPost).filter(Boolean)
            : [],
        );
      } catch (error) {
        console.error("Failed to load community posts from API", error);
      }
    };

    const handleCommunityPostsUpdated = () => {
      void loadCommunityPosts();
    };

    void loadCommunityPosts();

    window.addEventListener("community-posts-updated", handleCommunityPostsUpdated);
    return () => {
      window.removeEventListener("community-posts-updated", handleCommunityPostsUpdated);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const handleStorageChange = (event) => {
      if (event.key === "currentUser") {
        setCurrentUser(getStoredUser());
        return;
      }

      if (
        event.key === "adminUsers" ||
        event.key === "adminCommunityPosts" ||
        event.key === "systemSettings" ||
        event.key === "adminStatuses"
      ) {
        const {
          users: storedUsers,
          posts: storedPosts,
          settings: storedSettings,
          statuses: storedStatuses,
        } = loadData();
        setUsers([...storedUsers]);
        setPosts([...storedPosts]);
        setSystemSettings({ ...DEFAULT_SYSTEM_SETTINGS, ...storedSettings });
        setStatuses(Array.isArray(storedStatuses) ? [...storedStatuses] : []);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const handleLiveChatUpdate = () => {
      void fetchLiveChatThreadsSummary().then(({ threads, totalCount, unreadCount }) => {
        setLiveChatThreads(threads);
        setLiveChatTotalCount(totalCount);
        setLiveChatUnreadCount(unreadCount);
      });
    };

    window.addEventListener(getLiveChatUpdatedEventName(), handleLiveChatUpdate);
    void fetchLiveChatThreadsSummary().then(({ threads, totalCount, unreadCount }) => {
      setLiveChatThreads(threads);
      setLiveChatTotalCount(totalCount);
      setLiveChatUnreadCount(unreadCount);
    });
    return () => {
      window.removeEventListener(getLiveChatUpdatedEventName(), handleLiveChatUpdate);
    };
  }, []);

  const handleTabChange = (tab) => {
    navigate(`${location.pathname}?tab=${tab}`);
    if (tab === "users") {
      setActiveUserSubTab("all");
    }
  };

  const resolvedLiveChatTotalCount = Math.max(
    Number(liveChatTotalCount) || 0,
    Array.isArray(liveChatThreads) ? liveChatThreads.length : 0,
    Array.isArray(getLiveChatThreads()) ? getLiveChatThreads().length : 0,
  );

  const handleAddUserSubmit = (formData) => {
    const errors = validateNewUser(formData, users);
    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }
    const create = async () => {
      try {
        const newUser = await createAdminUserApi({
          username: formData.username,
          email: formData.email,
          role: formData.role,
          status: "active",
          password: formData.password,
          fullName: formData.username,
        });

        const userRecord = {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
          status: (newUser.status || "active").toLowerCase(),
          joinDate: newUser.createdAt ? newUser.createdAt.split("T")[0] : new Date().toISOString().split("T")[0],
        };

        const updatedUsers = [...users, userRecord];
        setUsers(updatedUsers);
        saveData(updatedUsers, null, null);
        setShowAddUserModal(false);
        showNotification("User added successfully");
      } catch (error) {
        alert(error.message || "Failed to add user");
      }
    };

    create();
  };

  const handleEditUser = (userId) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setEditingUser(user);
      setShowEditUserModal(true);
    }
  };

  const handleUpdateUserSubmit = (formData) => {
    if (!editingUser) return;

    const errors = validateEditUser(formData, editingUser, users);
    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }

    const update = async () => {
      try {
        const updated = await updateAdminUserApi(editingUser.id, {
          username: formData.username,
          email: formData.email,
          role: formData.role,
          status: formData.status,
        });

        const updatedUsers = users.map((user) => {
          if (user.id === editingUser.id) {
            return {
              ...user,
              username: updated.username,
              email: updated.email,
              role: updated.role,
              status: (updated.status || formData.status).toLowerCase(),
            };
          }
          return user;
        });

        setUsers(updatedUsers);
        saveData(updatedUsers, null, null);

        setShowEditUserModal(false);
        setEditingUser(null);
        showNotification("User updated successfully");
      } catch (error) {
        alert(error.message || "Failed to update user");
      }
    };

    update();
  };

  const handleDeleteUser = (userId) => {
    const userToDelete = users.find((user) => user.id === userId);
    if (userToDelete?.role === "admin") {
      alert("Admin account cannot be deleted. Only one admin account must remain in the system.");
      return;
    }

    if (
      window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone.",
      )
    ) {
      const remove = async () => {
        try {
          await deleteAdminUserApi(userId);
          const updatedUsers = users.filter((user) => user.id !== userId);
          setUsers(updatedUsers);
          saveData(updatedUsers, null, null);
          showNotification("User deleted successfully");
        } catch (error) {
          alert(error.message || "Failed to delete user");
        }
      };

      remove();
    }
  };

  const handleViewPost = (postId) => {
    const post = posts.find((p) => p.id === postId);
    if (post) {
      setSelectedPost(post);
      setShowPostModal(true);
    }
  };

  const handleDeletePost = (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      const updatedPosts = posts.filter((post) => post.id !== postId);
      setPosts(updatedPosts);
      saveData(null, updatedPosts, null);

      // Also delete from community storage
      const communityStoragePosts =
        JSON.parse(localStorage.getItem("communityPosts")) || [];
      const updatedCommunityPosts = communityStoragePosts.filter(
        (post) => post.id !== postId,
      );
      localStorage.setItem(
        "communityPosts",
        JSON.stringify(updatedCommunityPosts),
      );

      showNotification("Post deleted successfully");
    }
  };

  const handleSystemSettingsChange = (key, value) => {
    setSystemSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    saveData(null, null, systemSettings);
    showNotification("System settings saved successfully");
  };

  const handleSaveStatus = (name, existingId = null) => {
    const trimmed = (name || "").trim();
    if (!trimmed) return;

    setStatuses((prev) => {
      let next;
      if (existingId) {
        next = prev.map((s) =>
          s.id === existingId ? { ...s, status: trimmed } : s,
        );
      } else {
        const maxId =
          prev.length > 0 ? Math.max(...prev.map((s) => s.id || 0)) : 0;
        next = [...prev, { id: maxId + 1, status: trimmed, isActive: true }];
      }

      saveData(null, null, null, next);
      return next;
    });
  };

  const handleDeleteStatus = (id) => {
    setStatuses((prev) => {
      const next = prev.filter((s) => s.id !== id);
      saveData(null, null, null, next);
      return next;
    });
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardTab users={users} posts={posts} />;
      case "users":
        return (
          <>
            <UsersTab
              users={users}
              activeUserSubTab={activeUserSubTab}
              onSetActiveUserSubTab={setActiveUserSubTab}
              onShowAddUserModal={() => setShowAddUserModal(true)}
              onEditUser={handleEditUser}
              onDeleteUser={handleDeleteUser}
            />
            <UserTable
              users={users}
              onEditUser={handleEditUser}
              onDeleteUser={handleDeleteUser}
              activeUserSubTab={activeUserSubTab}
            />
          </>
        );
      case "posts":
        return (
          <>
            <PostsTab />
            <PostsTable
              posts={posts}
              onViewPost={handleViewPost}
              onDeletePost={handleDeletePost}
            />
          </>
        );
      case "home-community-posts":
        return <HomeCommunityPostsTab />;
      case "analytics":
        return <AnalyticsTab users={users} posts={posts} />;
      case "status":
        return (
          <StatusTab
            statuses={statuses}
            onSaveStatus={handleSaveStatus}
            onDeleteStatus={handleDeleteStatus}
          />
        );
      case "system":
        return (
          <SystemTab
            systemSettings={systemSettings}
            onSystemSettingsChange={handleSystemSettingsChange}
            onSaveSettings={handleSaveSettings}
          />
        );
      case "live-chat":
        return (
          <LiveChatTab
            threads={liveChatThreads}
            onSendMessage={(thread, message, currentUser) => {
              const threadOrder = {
                id: thread.orderId,
                orderNumber: thread.orderNumber,
              };
              sendLiveChatMessage({
                order: threadOrder,
                user: {
                  id: thread.userId,
                  name: thread.userName,
                  email: thread.userEmail,
                },
                senderRole: "admin",
                senderName: currentUser?.name || currentUser?.fullName || currentUser?.username || "Admin",
                message,
              });
            }}
          />
        );
      default:
        return (
          <DashboardTab
            users={users}
            posts={posts}
            liveChatCount={resolvedLiveChatTotalCount}
            liveChatThreads={liveChatThreads}
          />
        );
    }
  };

  if (!currentUser) {
    return (
      <div className="admin-panel">
        <AdminHeader />
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading admin panel...</span>
          </div>
          <p className="mt-3">Loading admin panel...</p>
        </div>
        <AdminFooter />
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <AdminHeader />

      <div className="container-fluid mt-4">
        <div className="row">
          {/* Sidebar */}
          <div className="col-lg-2">
            <AdminSidebar
              activeTab={activeTab}
              onTabChange={handleTabChange}
              liveChatCount={liveChatUnreadCount}
            />
          </div>

          {/* Main Content */}
          <div className="col-lg-10">
            <div className="tab-content">{renderActiveTab()}</div>
          </div>
        </div>
      </div>

      <AdminFooter />

      {/* Modals */}
      <AddUserModal
        show={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        onSubmit={handleAddUserSubmit}
      />

      <EditUserModal
        show={showEditUserModal}
        onClose={() => {
          setShowEditUserModal(false);
          setEditingUser(null);
        }}
        user={editingUser}
        onSubmit={handleUpdateUserSubmit}
      />

      <PostModal
        show={showPostModal}
        onClose={() => {
          setShowPostModal(false);
          setSelectedPost(null);
        }}
        post={selectedPost}
        onDeletePost={handleDeletePost}
      />
    </div>
  );
};

export default AdminPanel;
