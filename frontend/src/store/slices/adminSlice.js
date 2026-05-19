// Redux slice for admin dashboard data and actions.
import { createSlice } from "@reduxjs/toolkit";
import {
  loadData,
  initialSystemSettings,
  initialStatuses,
} from "../../components/Admin/utils";

// Builds the initial admin state from storage or defaults.
const buildInitialState = () => {
  const fallback = {
    users: [],
    posts: [],
    systemSettings: initialSystemSettings,
    statuses: initialStatuses,
    loading: false,
  };

  if (typeof window === "undefined") return fallback;

  try {
    const { users, posts, settings, statuses } = loadData();
    return {
      users: users || [],
      posts: posts || [],
      systemSettings: settings || initialSystemSettings,
      statuses: Array.isArray(statuses) ? statuses : initialStatuses,
      loading: false,
    };
  } catch (err) {
    console.warn("Failed to load admin state from storage", err);
    return fallback;
  }
};

const adminSlice = createSlice({
  name: "admin",
  initialState: buildInitialState(),
  reducers: {
    // Replaces the admin state in one operation.
    setAll(state, action) {
      const { users, posts, systemSettings, statuses } = action.payload || {};
      if (users) state.users = users;
      if (posts) state.posts = posts;
      if (systemSettings) state.systemSettings = systemSettings;
      if (statuses) state.statuses = statuses;
    },
    // Replaces the admin users list.
    setUsers(state, action) {
      state.users = action.payload || [];
    },
    // Inserts or updates a single admin user.
    upsertUser(state, action) {
      const user = action.payload;
      if (!user) return;
      const idx = state.users.findIndex((u) => u.id === user.id);
      if (idx >= 0) {
        state.users[idx] = user;
      } else {
        state.users.push(user);
      }
    },
    // Removes an admin user by ID.
    removeUser(state, action) {
      const id = action.payload;
      state.users = state.users.filter((u) => u.id !== id);
    },
    // Replaces the admin posts list.
    setPosts(state, action) {
      state.posts = action.payload || [];
    },
    // Inserts or updates a single admin post.
    upsertPost(state, action) {
      const post = action.payload;
      if (!post) return;
      const idx = state.posts.findIndex((p) => p.id === post.id);
      if (idx >= 0) {
        state.posts[idx] = post;
      } else {
        state.posts.push(post);
      }
    },
    // Removes an admin post by ID.
    removePost(state, action) {
      const id = action.payload;
      state.posts = state.posts.filter((p) => p.id !== id);
    },
    // Replaces the admin system settings.
    setSystemSettings(state, action) {
      state.systemSettings = action.payload || initialSystemSettings;
    },
    // Replaces the admin status list.
    setStatuses(state, action) {
      state.statuses = action.payload || initialStatuses;
    },
    // Sets the loading flag.
    setLoading(state, action) {
      state.loading = Boolean(action.payload);
    },
  },
});

export const {
  setAll,
  setUsers,
  upsertUser,
  removeUser,
  setPosts,
  upsertPost,
  removePost,
  setSystemSettings,
  setStatuses,
  setLoading,
} = adminSlice.actions;

// Selects the admin users list.
export const selectAdminUsers = (state) => state.admin.users;
// Selects the admin posts list.
export const selectAdminPosts = (state) => state.admin.posts;
// Selects the admin system settings object.
export const selectAdminSystemSettings = (state) => state.admin.systemSettings;
// Selects the admin status list.
export const selectAdminStatuses = (state) => state.admin.statuses;
// Selects the admin loading flag.
export const selectAdminLoading = (state) => state.admin.loading;

export default adminSlice.reducer;
