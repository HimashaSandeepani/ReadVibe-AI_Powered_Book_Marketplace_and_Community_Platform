// Wishlist helper data and formatting utilities.
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar as faStarSolid,
  faCheckCircle,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";

// Sample books data
export const sampleBooks = [
  {
    id: 1,
    title: "The Midnight Library",
    author: "Matt Haig",
    price: 6000.0,
    category: "Fiction",
    rating: 4.3,
    reviews: 128,
    inStock: true,
    image: "/assets/The_Midnight_Library.jpeg",
  },
  {
    id: 2,
    title: "Project Hail Mary",
    author: "Andy Weir",
    price: 6500.0,
    category: "Science Fiction",
    rating: 4.8,
    reviews: 95,
    inStock: true,
    image: "/assets/project_hail_mary.jpg",
  },
  {
    id: 3,
    title: "Dune",
    author: "Frank Herbert",
    price: 5400.0,
    category: "Science Fiction",
    rating: 4.0,
    reviews: 210,
    inStock: false,
    image: "/assets/dune.jpg",
  },
  {
    id: 4,
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    price: 3500.0,
    category: "Fantasy",
    rating: 4.9,
    reviews: 305,
    inStock: true,
    image: "/assets/the_hobbit.jpg",
  },
  {
    id: 5,
    title: "Atomic Habits",
    author: "James Clear",
    price: 4500.0,
    category: "Self-Help",
    rating: 4.8,
    reviews: 150,
    inStock: true,
    image: "/assets/atomic_habits.jpg",
  },
];

// Priority stars renderer - React component
export const renderPriorityStars = (
  priorityLevel,
  interactive = false,
  onStarClick = null,
) => {
  return (
    <div className="priority-stars">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          className={`priority-star ${i <= priorityLevel ? "active" : ""} ${
            interactive ? "interactive" : ""
          }`}
          onClick={interactive ? () => onStarClick(i) : undefined}
          aria-label={`Set priority to ${i} stars`}
          style={{
            background: "none",
            border: "none",
            padding: "0.3rem",
            fontSize: "1.3rem",
            cursor: interactive ? "pointer" : "default",
            color: i <= priorityLevel ? "#f59e0b" : "#e2e8f0",
          }}
        >
          <FontAwesomeIcon
            icon={i <= priorityLevel ? faStarSolid : faStarRegular}
          />
        </button>
      ))}
    </div>
  );
};

// Categories for dropdown
export const categories = [
  "Fiction",
  "Science Fiction",
  "Fantasy",
  "Mystery",
  "Romance",
  "Non-Fiction",
  "Self-Help",
  "Biography",
];

// Format price for display
export const formatPrice = (price) => {
  return `LKR ${price.toFixed(2)}`;
};

// Apply filter to wishlist
export const applyFilter = (wishlist, filter) => {
  switch (filter) {
    case "available":
      return wishlist.filter((item) => item.inStock);
    case "unavailable":
      return wishlist.filter((item) => !item.inStock);
    case "priority":
      return wishlist.filter((item) => item.priority >= 4);
    default:
      return wishlist;
  }
};

// Sort wishlist
export const sortWishlist = (wishlist, sortType) => {
  const sorted = [...wishlist];

  switch (sortType) {
    case "price-low":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "priority":
      sorted.sort((a, b) => (b.priority || 3) - (a.priority || 3));
      break;
    case "recent":
      sorted.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
      break;
    case "title":
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      break;
    default:
      break;
  }

  return sorted;
};

// Calculate wishlist summary
export const calculateSummary = (wishlist) => {
  const totalItems = wishlist.length;
  const inStock = wishlist.filter((item) => item.inStock).length;
  const outOfStock = wishlist.filter((item) => !item.inStock).length;
  const totalValue = wishlist.reduce((sum, item) => sum + item.price, 0);

  return {
    totalItems,
    inStock,
    outOfStock,
    totalValue,
  };
};

// Get priority label
export const getPriorityLabel = (priority) => {
  switch (priority) {
    case 1:
      return "Low - Maybe later";
    case 2:
      return "Low-Medium";
    case 3:
      return "Medium - Interested";
    case 4:
      return "High - Want soon";
    case 5:
      return "Highest - Must read!";
    default:
      return "Medium - Interested";
  }
};

// Helper function to get stock badge
export const getStockBadge = (inStock) => {
  if (inStock) {
    return {
      bg: "success",
      icon: faCheckCircle,
      text: "In Stock",
    };
  } else {
    return {
      bg: "danger",
      icon: faExclamationTriangle,
      text: "Out of Stock",
    };
  }
};

// Format date for display
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Search books from sample
export const searchBooks = (searchTerm, wishlist) => {
  if (!searchTerm.trim()) return [];

  return sampleBooks
    .filter(
      (book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((book) => !wishlist.some((item) => item.id === book.id));
};
