// Redux slice for the shopping cart state.
import { createSlice } from "@reduxjs/toolkit";

// Reads the cart state from local storage.
const readCartFromStorage = () => {
  if (typeof window === "undefined") return [];
  try {
    const stored = window.localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  } catch {
    console.warn("Failed to parse cart from storage");
    return [];
  }
};

// Emits a cart-updated event for other listeners.
const emitCartEvent = () => {
  try {
    const dispatchCartEvent = () => {
      window.dispatchEvent(new CustomEvent("cart-updated"));
    };

    if (typeof queueMicrotask === "function") {
      queueMicrotask(dispatchCartEvent);
      return;
    }

    setTimeout(dispatchCartEvent, 0);
  } catch {
    // no-op if events fail
  }
};

// Saves the cart state and broadcasts the change.
const persistCart = (items) => {
  try {
    window.localStorage.setItem("cart", JSON.stringify(items));
    emitCartEvent();
  } catch {
    console.warn("Failed to persist cart");
  }
};

const initialState = {
  items: readCartFromStorage(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Reloads the cart from local storage.
    syncFromStorage: (state) => {
      state.items = readCartFromStorage();
    },
    // Adds an item or increases its quantity.
    addItem: (state, action) => {
      const incoming = action.payload;
      const existing = state.items.find((i) => i.id === incoming.id);
      const availableStock = incoming.stock ?? existing?.stock;

      if (existing) {
        const nextQuantity = existing.quantity + (incoming.quantity || 1);
        if (availableStock && nextQuantity > availableStock) {
          existing.quantity = availableStock;
        } else {
          existing.quantity = nextQuantity;
        }
      } else {
        state.items.push({ ...incoming, quantity: incoming.quantity || 1 });
      }
      persistCart(state.items);
    },
    // Adjusts an item's quantity by delta.
    updateQuantity: (state, action) => {
      const { id, delta } = action.payload;
      state.items = state.items
        .map((item) => {
          if (item.id !== id) return item;
          const nextQuantity = (item.quantity || 1) + delta;
          if (nextQuantity <= 0) return null;
          if (item.stock && nextQuantity > item.stock) {
            return { ...item, quantity: item.stock };
          }
          return { ...item, quantity: nextQuantity };
        })
        .filter(Boolean);
      persistCart(state.items);
    },
    // Removes a single cart item.
    removeItem: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((item) => item.id !== id);
      persistCart(state.items);
    },
    // Empties the cart.
    clearCart: (state) => {
      state.items = [];
      persistCart(state.items);
    },
    // Replaces the cart with a provided list.
    setCart: (state, action) => {
      state.items = action.payload || [];
      persistCart(state.items);
    },
  },
});

export const {
  syncFromStorage,
  addItem,
  updateQuantity,
  removeItem,
  clearCart,
  setCart,
} = cartSlice.actions;

// Selects the cart item array.
export const selectCartItems = (state) => state.cart.items;
// Selects the total item count across the cart.
export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, item) => sum + (item.quantity || 0), 0);

export default cartSlice.reducer;
