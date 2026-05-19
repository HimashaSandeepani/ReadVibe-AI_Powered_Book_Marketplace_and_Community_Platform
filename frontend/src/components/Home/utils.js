// Home page utility functions for featured books, community actions, and cart shortcuts.
import { addItem, setCart } from "../../store/slices/cartSlice";
import { showNotification, formatPrice, generateStarRating, addToWishlist } from "../../utils/helpers";

// Resolves a home page book image from the title.
export const getBookImage = (bookTitle) => {
  const imageMap = {
    "The Midnight Library": "/assets/The_Midnight_Library.jpeg",
    "Project Hail Mary": "/assets/project_hail_mary.jpg",
    "Dune": "/assets/dune.jpg",
    "The Hobbit": "/assets/the_hobbit.jpg",
    "The Silent Patient": "/assets/silent_patient.jpg",
    "Where the Crawdads Sing": "/assets/crawdads_sing.jpg",
    "Atomic Habits": "/assets/atomic_habits.jpg",
    "The Alchemist": "/assets/alchemist.jpg",
  };

  return imageMap[bookTitle] || "/assets/default_book.jpg";
};


// Loads stock books from local storage for the home page.
export const loadStockBooks = () => {
  try {
    const storedBooks = JSON.parse(localStorage.getItem("stockBooks")) || [];
    return storedBooks;
  } catch (error) {
    console.error("Error loading stock books:", error);
    return [];
  }
};

// Formats featured books for the home page hero sections.
export const formatFeaturedBooks = (stockBooks, getBookImage) => {
  // Get featured books from stock
  let featured = stockBooks.filter(book => book.featured === true);

  // If not enough featured books, get top selling books
  if (featured.length < 4) {
    featured = [...stockBooks]
      .sort((a, b) => b.salesThisMonth - a.salesThisMonth)
      .slice(0, 4);
  }

  // Format books for home page display
  return featured.map(book => ({
    id: book.id,
    title: book.title,
    author: book.author,
    category: book.category,
    price: book.price,
    image: getBookImage(book.title),
    rating: Math.min(5, 4 + (book.salesThisMonth / 20)),
    reviews: book.totalSales || Math.floor(Math.random() * 50) + 10,
    inStock: book.stock > 0,
    stock: book.stock,
    status: book.status,
    description: book.description || "No description available.",
    publisher: book.publisher,
    publishedDate: book.publicationYear?.toString(),
    isbn: book.isbn,
    language: book.language,
    pages: book.pages,
    salesThisMonth: book.salesThisMonth,
    reviewHighlights: [
      {
        user: "Verified Reader",
        rating: 5,
        comment: `Sold ${book.salesThisMonth} copies this month! Highly recommended.`
      },
      {
        user: "Book Lover",
        rating: 4,
        comment: "Great addition to my collection!"
      }
    ]
  }));
};

// Toggles like state for a community post.
export const handleCommunityPostLike = (communityPosts, setCommunityPosts, postId, isLoggedIn, navigate) => {
  if (!isLoggedIn()) {
    alert("Please login to like posts");
    navigate("/login");
    return communityPosts;
  }

  return communityPosts.map((post) =>
    post.id === postId
      ? {
        ...post,
        likedByUser: !post.likedByUser,
        likes: post.likedByUser ? post.likes - 1 : post.likes + 1,
      }
      : post
  );
};

// Adds a comment to a community post.
export const handleCommunityPostComment = (communityPosts, setCommunityPosts, postId, commentText, currentUser) => {
  if (!commentText.trim()) return communityPosts;

  const newComment = {
    user: currentUser?.username || "You",
    comment: commentText,
  };

  return communityPosts.map((post) =>
    post.id === postId
      ? {
        ...post,
        comments: post.comments + 1,
        commentsList: [...post.commentsList, newComment],
      }
      : post
  );
};

// Shares a community post through native share or clipboard fallback.
export const handleCommunityPostShare = (post, isLoggedIn, navigate) => {
  if (!isLoggedIn()) {
    alert("Please login to share posts");
    navigate("/login");
    return;
  }

  const shareText = `${post.user}: ${post.content}\n\nCheck out this discussion on ReadVibe!`;

  if (navigator.share) {
    navigator.share({
      title: `ReadVibe Community Post`,
      text: shareText,
      url: window.location.href,
    }).catch((error) => console.log("Error sharing:", error));
  } else {
    navigator.clipboard.writeText(shareText)
      .then(() => alert("Post link copied to clipboard!"))
      .catch(() => {
        const textArea = document.createElement("textarea");
        textArea.value = shareText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        alert("Post content copied!");
      });
  }
};

// Adds a book to the cart from the home page.
export const handleAddToCart = ({
  bookId,
  featuredBooks,
  stockBooks,
  isLoggedIn,
  navigate,
  dispatch,
}) => {
  if (!isLoggedIn()) {
    showNotification("Please login to add items to cart", "warning");
    navigate("/login");
    return false;
  }

  const book =
    featuredBooks.find((b) => b.id === bookId) ||
    stockBooks.find((b) => b.id === bookId);

  if (!book) {
    showNotification("Book not found in inventory", "danger");
    return false;
  }

  if (book.stock === 0 || !book.inStock) {
    showNotification("This book is currently out of stock", "warning");
    return false;
  }

  if (!dispatch) {
    console.warn("handleAddToCart called without dispatch");
    return false;
  }

  dispatch(
    addItem({
      id: book.id,
      title: book.title,
      author: book.author,
      price: book.price,
      image: book.image,
      quantity: 1,
      stock: book.stock,
    })
  );

  showNotification("Book added to cart!", "success");
  return true;
};

// Replaces the cart with a single item and sends the user to delivery details.
export const directBuyNow = ({
  bookId,
  featuredBooks,
  stockBooks,
  isLoggedIn,
  navigate,
  dispatch,
}) => {
  if (!isLoggedIn()) {
    showNotification("Please login to buy books", "warning");
    navigate("/login");
    return false;
  }

  const book =
    featuredBooks.find((b) => b.id === bookId) ||
    stockBooks.find((b) => b.id === bookId);

  if (!book) {
    showNotification("Book not found in inventory", "danger");
    return false;
  }

  if (book.stock === 0 || !book.inStock) {
    showNotification("This book is currently out of stock", "warning");
    return false;
  }

  if (!dispatch) {
    console.warn("directBuyNow called without dispatch");
    return false;
  }

  dispatch(
    setCart([
      {
        id: book.id,
        title: book.title,
        author: book.author,
        price: book.price,
        image: book.image,
        quantity: 1,
        stock: book.stock,
      },
    ])
  );

  showNotification("Ready to checkout", "success");
  navigate("/delivery-details");
  return true;
};

// Returns the stock badge metadata for a book.
export const getStockBadge = (book) => {
  if (book.stock > 10) {
    return { variant: "success", text: "In Stock" };
  } else if (book.stock > 0) {
    return { variant: "warning", text: "Low Stock" };
  } else {
    return { variant: "danger", text: "Out of Stock" };
  }
};

// Re-export common helpers for consumers
export { formatPrice, generateStarRating, addToWishlist };