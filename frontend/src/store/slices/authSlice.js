// Redux slice for authentication state and persisted session data.
import { createSlice } from "@reduxjs/toolkit";

// Reads the stored user from local storage.
const getStoredUser = () => {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem("currentUser");
    return stored ? JSON.parse(stored) : null;
  } catch (err) {
    console.warn("Failed to parse stored user", err);
    return null;
  }
};

// Persists the user and emits a storage event.
const saveUser = (user) => {
  try {
    window.localStorage.setItem("currentUser", JSON.stringify(user));
    setTimeout(() => window.dispatchEvent(new Event("storage")), 0);
  } catch (err) {
    console.warn("Failed to persist user", err);
  }
};

// Removes the stored user and emits a storage event.
const clearUser = () => {
  try {
    window.localStorage.removeItem("currentUser");
    setTimeout(() => window.dispatchEvent(new Event("storage")), 0);
  } catch (err) {
    console.warn("Failed to clear user", err);
  }
};

const initialUser = getStoredUser();

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: initialUser,
    isAuthenticated: !!initialUser,
  },
  reducers: {
    // Stores the signed-in user in state.
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      saveUser(action.payload);
    },
    // Clears the signed-in user from state.
    logoutSuccess: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      clearUser();
    },
    // Merges profile updates into the current user.
    updateUserProfile: (state, action) => {
      state.user = { ...(state.user || {}), ...action.payload };
      if (state.user) {
        saveUser(state.user);
      }
    },
  },
});

export const { loginSuccess, logoutSuccess, updateUserProfile } = authSlice.actions;

// Selects the current authenticated user.
export const selectCurrentUser = (state) => state.auth.user;
// Selects whether a user is authenticated.
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export default authSlice.reducer;
