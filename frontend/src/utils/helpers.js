import { addWishlistItemApi } from "./wishlistApi.js";

const normalizeUser = (user) => {
  if (!user || typeof user !== "object") return null;

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

// Return inventory books from localStorage
export const getAllBooks = () => {
  try {
    const stored = JSON.parse(localStorage.getItem("stockBooks")) || [];
    const mapped = stored.map((book) => ({
      ...book,
      inStock: book.stock > 0,
      image:
        book.image ||
        (Array.isArray(book.images) && book.images.length
          ? book.images[0]
          : "/assets/default_book.jpg"),
      rating: book.rating ?? null,
      reviews: book.reviews ?? null,
      price: Number(book.price) || 0,
    }));

    return mapped;
  } catch (error) {
    console.error("Error reading stockBooks:", error);
  }

  return [];
};

// Cart functions
export const getCart = () => {
  return JSON.parse(localStorage.getItem('cart')) || []
}

export const updateCart = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart))
}

export const addToCart = (bookId, quantity = 1) => {
  const cart = getCart()
  const book = getAllBooks().find(b => b.id === bookId)

  if (!book) return

  const existingItem = cart.find(item => item.id === bookId)

  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    cart.push({
      id: book.id,
      title: book.title,
      author: book.author,
      price: book.price,
      image: book.image,
      quantity: quantity
    })
  }

  updateCart(cart)
}

export const removeFromCart = (bookId) => {
  const cart = getCart().filter(item => item.id !== bookId)
  updateCart(cart)
}

export const updateQuantity = (bookId, change) => {
  const cart = getCart()
  const item = cart.find(item => item.id === bookId)

  if (item) {
    item.quantity += change
    if (item.quantity <= 0) {
      removeFromCart(bookId)
    } else {
      updateCart(cart)
    }
  }
}



// Search books
export const searchBooks = (query, booksArray = getAllBooks()) => {
  const q = (query || "").toLowerCase();
  return booksArray.filter(
    (book) =>
      book.title.toLowerCase().includes(q) ||
      book.author.toLowerCase().includes(q),
  );
};

// Add or sync wishlist entry via backend API
export const addToWishlist = async (bookId, userId) => {
  const normalizedUserId = Number(userId);
  const normalizedBookId = Number(bookId);

  if (!normalizedUserId || !normalizedBookId) {
    throw new Error("userId and bookId are required");
  }

  return addWishlistItemApi({
    userId: normalizedUserId,
    bookId: normalizedBookId,
    priority: 3,
    notes: "",
  });
};





// Add these to your existing helpers.js

// Filter books function
export const filterBooks = (filters, booksArray) => {
  let filtered = [...booksArray];
  const minRating = Number(filters.minRating) || 0;
  const minReviews = Number(filters.minReviews) || 0;

  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(book => book.category === filters.category);
  }

  if (filters.minPrice) {
    filtered = filtered.filter(book => book.price >= filters.minPrice);
  }

  if (filters.maxPrice) {
    filtered = filtered.filter(book => book.price <= filters.maxPrice);
  }

  if (minRating > 0) {
    filtered = filtered.filter((book) => Number(book.rating) >= minRating);
  }

  if (minReviews > 0) {
    filtered = filtered.filter((book) => Number(book.reviews) >= minReviews);
  }

  if (filters.inStock) {
    filtered = filtered.filter(book => book.inStock);
  }

  return filtered;
};

// Enhanced showNotification function
export const showNotification = (message, type = 'info') => {
  const typeMap = {
    success: { icon: 'check-circle', label: 'Success' },
    warning: { icon: 'exclamation-triangle', label: 'Warning' },
    danger: { icon: 'times-circle', label: 'Error' },
    info: { icon: 'info-circle', label: 'Info' },
  };

  const meta = typeMap[type] || typeMap.info;

  // Ensure a single toast container exists
  let container = document.querySelector('.rv-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'rv-toast-container';
    document.body.appendChild(container);
  }

  const notification = document.createElement('div');
  notification.className = `rv-toast rv-toast-${type}`;
  notification.innerHTML = `
    <div class="rv-toast__icon">
      <i class="fas fa-${meta.icon}" aria-hidden="true"></i>
    </div>
    <div class="rv-toast__content">
      <div class="rv-toast__title">${meta.label}</div>
      <div class="rv-toast__message">${message}</div>
    </div>
    <button class="rv-toast__close" aria-label="Dismiss notification">x</button>
  `;

  // Close on click of the dismiss button
  notification.querySelector('.rv-toast__close').addEventListener('click', () => {
    notification.classList.add('rv-toast--hide');
    setTimeout(() => notification.remove(), 250);
  });

  container.appendChild(notification);

  // Auto-remove after 3 seconds
  setTimeout(() => {
    notification.classList.add('rv-toast--hide');
    setTimeout(() => notification.remove(), 250);
  }, 3000);
};


// Price formatting cart, delivery
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
};




// Star rating generator
export const generateStarRating = (rating) => {
  const stars = Math.round(rating);
  return '★'.repeat(stars) + '☆'.repeat(5 - stars);
};

// Truncate text
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Format date
// export const formatDate = (dateString) => {
//   const options = { year: 'numeric', month: 'long', day: 'numeric' };
//   return new Date(dateString).toLocaleDateString(undefined, options);
// };

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};




// userprofile
// utils/helpers.js


export const getBookById = (bookId) => {
  const books = JSON.parse(localStorage.getItem('books')) || [];
  return books.find(book => book.id.toString() === bookId.toString());
};

export const updateBookRating = (bookId, rating) => {
  const books = JSON.parse(localStorage.getItem('books')) || [];
  const bookIndex = books.findIndex(book => book.id.toString() === bookId.toString());
  if (bookIndex !== -1) {
    // Update rating logic
    books[bookIndex].rating = rating;
    localStorage.setItem('books', JSON.stringify(books));
  }
};



//wishlist
export const getWishlistCount = () => {
  const user = normalizeUser(JSON.parse(localStorage.getItem('currentUser')));
  if (!user) return 0;

  const wishlist = JSON.parse(localStorage.getItem(`wishlist_${user.id}`)) || [];
  return wishlist.length;
};



// Authentication utilities
export const getCurrentUser = () => {
  return normalizeUser(JSON.parse(localStorage.getItem('currentUser')))
}

export const setCurrentUser = (user) => {
  localStorage.setItem('currentUser', JSON.stringify(normalizeUser(user)))
}

export const logout = () => {
  localStorage.removeItem('currentUser')
}

export const isAuthenticated = () => {
  return !!localStorage.getItem('currentUser')
}

export const getUserWishlist = () => {
  const user = getCurrentUser()
  if (!user) return []

  return JSON.parse(localStorage.getItem(`wishlist_${user.id}`)) || []
}

export const updateWishlistCount = () => {
  // This function can be called to update wishlist count in real-time
  const user = getCurrentUser()
  if (!user) return 0

  const wishlist = JSON.parse(localStorage.getItem(`wishlist_${user.id}`)) || []
  return wishlist.length
}




//order confirmation
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// export const formatPrice = (price) => {
//   return new Intl.NumberFormat('en-US', {
//     style: 'currency',
//     currency: 'USD'
//   }).format(price);
// };
