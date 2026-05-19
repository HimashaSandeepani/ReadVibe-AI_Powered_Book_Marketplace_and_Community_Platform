// User management utility functions for authentication, role checks, cart handling, and checkout data. 
// Normalizes a user object and resolves legacy ID fields.
const normalizeUser = (user) => {
  if (!user || typeof user !== "object") {
    return null;
  }

  const resolvedId =
    user.id ??
    user.userId ??
    user.user_id ??
    user.userID ??
    null;

  return {
    ...user,
    id: resolvedId !== null && resolvedId !== undefined ? Number(resolvedId) : null,
  };
};

// Stores the current user and emits a storage event for other tabs.
export const setCurrentUser = (user) => {
  localStorage.setItem('currentUser', JSON.stringify(normalizeUser(user)));
  // Trigger storage event for other tabs
  setTimeout(() => window.dispatchEvent(new Event('storage')), 0);
};

// Reads the current user from local storage.
export const getCurrentUser = () => {
  const user = localStorage.getItem('currentUser');
  return user ? normalizeUser(JSON.parse(user)) : null;
};

// Removes the current user from local storage.
export const logout = () => {
  localStorage.removeItem('currentUser');
};

// Checks whether a user is signed in.
export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};

// Checks whether the current user is an admin.
export const isAdmin = () => {
  const user = getCurrentUser();
  return user && user.role === 'admin';
};

// Checks whether the current user is a stock manager.
export const isStockManager = () => {
  const user = getCurrentUser();
  return user && user.role === 'stock';
};

// Checks whether the current user is a regular customer.
export const isRegularUser = () => {
  const user = getCurrentUser();
  return user && user.role === 'user';
};

// Checks whether the current user can access privileged areas.
export const isPrivilegedUser = () => {
  const user = getCurrentUser();
  return user && (user.role === 'admin' || user.role === 'stock');
};



// Returns the current user's role.
export const getUserRole = () => {
  const user = getCurrentUser();
  return user ? user.role : null;
};
// cart 

// ... existing code ...

// Cart functions
// Returns the cart from local storage.
export const getCart = () => {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
};

// Persists the cart to local storage.
export const updateCart = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

// Adds an item to the cart or increments its quantity.
export const addToCart = (bookId, quantity = 1) => {
  const cart = getCart();
  const existingItem = cart.find(item => item.id === bookId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      id: bookId,
      quantity: quantity,
      addedAt: new Date().toISOString()
    });
  }

  updateCart(cart);
  return cart;
};

// Removes an item from the cart.
export const removeFromCart = (bookId) => {
  const cart = getCart();
  const newCart = cart.filter(item => item.id !== bookId);
  updateCart(newCart);
  return newCart;
};

// Adjusts a cart item's quantity.
export const updateCartQuantity = (bookId, change) => {
  const cart = getCart();
  const newCart = cart.map(item => {
    if (item.id === bookId) {
      const newQuantity = item.quantity + change;
      if (newQuantity <= 0) {
        return null; // Will be filtered out
      }
      return { ...item, quantity: newQuantity };
    }
    return item;
  }).filter(Boolean);

  updateCart(newCart);
  return newCart;
};

// Clears the cart.
export const clearCart = () => {
  updateCart([]);
  return [];
};

// Returns the total cart item count.
export const getCartCount = () => {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + item.quantity, 0);
};



// checkout


// Checkout functions
// Reads delivery data from session storage.
export const getDeliveryData = () => {
  const data = sessionStorage.getItem('deliveryData');
  return data ? JSON.parse(data) : null;
};

// Saves delivery data to session storage.
export const saveDeliveryData = (data) => {
  sessionStorage.setItem('deliveryData', JSON.stringify(data));
};

// Clears delivery data from session storage.
export const clearDeliveryData = () => {
  sessionStorage.removeItem('deliveryData');
};

// Reads the stored order summary from session storage.
export const getOrderSummary = () => {
  const summary = sessionStorage.getItem('orderSummary');
  return summary ? JSON.parse(summary) : null;
};

// Saves a completed order to local storage.
export const saveOrder = (order) => {
  const orders = JSON.parse(localStorage.getItem('userOrders') || '[]');
  orders.push(order);
  localStorage.setItem('userOrders', JSON.stringify(orders));
  return order;
};

// Returns all stored user orders.
export const getUserOrders = () => {
  const orders = localStorage.getItem('userOrders');
  return orders ? JSON.parse(orders) : [];
};

// Returns a stored order by ID.
export const getOrderById = (orderId) => {
  const orders = getUserOrders();
  return orders.find(order => order.id === orderId);
};
