// Price formatting utilities
export const formatPrice = (price, showCurrency = true) => {
  if (showCurrency) {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  } else {
    return new Intl.NumberFormat("en-LK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  }
};

// For backward compatibility
export const formatPriceLKR = (price) => formatPrice(price, true);

// Calculate cart totals
export const calculateTotals = (cart, books) => {
  const subtotal = cart.reduce((sum, item) => {
    const book = books.find((b) => b.id === item.id);
    const price = Number(book?.price ?? item.price ?? 0);
    return sum + price * item.quantity;
  }, 0);

  const shipping = subtotal > 0 ? 500.0 : 0; // LKR 500.00 for shipping
  const tax = subtotal * 0.05; // 5% VAT in Sri Lanka (standard rate)
  const total = subtotal + shipping + tax;

  return {
    subtotal,
    shipping,
    tax,
    total,
    itemCount: cart.reduce((sum, item) => sum + item.quantity, 0),
  };
};

// Update cart in localStorage and global state
export const updateCartStorage = (newCart, setCart, updateCartCount) => {
  setCart(newCart);
  localStorage.setItem("cart", JSON.stringify(newCart));
  if (updateCartCount) {
    updateCartCount(newCart);
  }
};

// Update quantity in cart
export const updateQuantity = (cart, bookId, change, setCart, updateCartCount) => {
  const newCart = cart
    .map((item) => {
      if (item.id === bookId) {
        const newQuantity = item.quantity + change;
        if (newQuantity <= 0) {
          return null;
        }
        return { ...item, quantity: newQuantity };
      }
      return item;
    })
    .filter(Boolean);

  updateCartStorage(newCart, setCart, updateCartCount);
  return newCart;
};

// Remove item from cart
export const removeFromCart = (cart, bookId, setCart, updateCartCount) => {
  const newCart = cart.filter((item) => item.id !== bookId);
  updateCartStorage(newCart, setCart, updateCartCount);
  return newCart;
};

// Clear entire cart
export const clearCart = (setCart, updateCartCount) => {
  const newCart = [];
  updateCartStorage(newCart, setCart, updateCartCount);
  return newCart;
};

// Update global cart count (if using context)
export const updateCartCount = (cart) => {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  // If you're using React Context or Redux, update it here
  // Example: setGlobalCartCount(totalItems);

  // Dispatch custom event for other components to listen to
  window.dispatchEvent(new CustomEvent('cart-updated', { detail: { count: totalItems } }));
};

import createBookCoverPlaceholder from "../../utils/imagePlaceholders";

// Check if all items are in stock
export const checkStockAvailability = (cart, books) => {
  return cart.filter((item) => {
    const book = books.find((b) => b.id === item.id);
    const inStock = book?.inStock ?? (book?.stock ?? item.stock ?? 0) > 0;
    return !inStock;
  });
};

// Prepare cart data for checkout
export const prepareCheckoutData = (cart, books) => {
  const totals = calculateTotals(cart, books);

  const cartItems = cart.map((item) => {
    const book = books.find((b) => b.id === item.id);
    return {
      ...item,
      title: book?.title || item.title || "Unknown Book",
      author: book?.author || item.author || "Unknown Author",
      price: book?.price ?? item.price ?? 0,
      image: book?.image || item.image || createBookCoverPlaceholder(),
    };
  });

  return {
    cartItems,
    totals,
  };
};