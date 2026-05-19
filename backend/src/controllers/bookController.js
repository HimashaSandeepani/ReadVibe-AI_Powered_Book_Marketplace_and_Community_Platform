// Controller layer for book catalog requests.
import {
  createBook,
  deleteBook,
  getBookById,
  listBooks,
  updateBook,
} from '../models/bookModel.js';
import { listReviewsForBook } from '../models/reviewModel.js';

export const getBooks = async (_req, res, next) => {
  try {
    const books = await listBooks();
    res.json({ books });
  } catch (err) {
    next(err);
  }
};

export const getBook = async (req, res, next) => {
  try {
    const book = await getBookById(Number(req.params.id));
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    const reviews = await listReviewsForBook(book.id);
    res.json({ book: { ...book, reviewsList: reviews, reviews: reviews.length } });
  } catch (err) {
    next(err);
  }
};

export const createBookHandler = async (req, res, next) => {
  try {
    const book = await createBook({
      datasetBookId: req.body.datasetBookId,
      isbn: req.body.isbn,
      title: req.body.title,
      author: req.body.author,
      category: req.body.category,
      price: req.body.price,
      costPrice: req.body.costPrice,
      stock: req.body.stock ?? 0,
      minStock: req.body.minStock ?? 0,
      maxStock: req.body.maxStock ?? 0,
      status: req.body.status,
      description: req.body.description,
      publisher: req.body.publisher,
      publicationYear: req.body.publicationYear,
      pages: req.body.pages,
      language: req.body.language,
      weight: req.body.weight,
      dimensions: req.body.dimensions,
      image: req.body.image,
      images: req.body.images,
      featured: req.body.featured,
      salesThisMonth: req.body.salesThisMonth,
      totalSales: req.body.totalSales,
    });
    res.status(201).json({ book });
  } catch (err) {
    next(err);
  }
};

export const updateBookHandler = async (req, res, next) => {
  const id = Number(req.params.id);
  try {
    const existing = await getBookById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const book = await updateBook(id, {
      datasetBookId: req.body.datasetBookId,
      isbn: req.body.isbn,
      title: req.body.title,
      author: req.body.author,
      category: req.body.category,
      price: req.body.price,
      costPrice: req.body.costPrice,
      stock: req.body.stock,
      minStock: req.body.minStock,
      maxStock: req.body.maxStock,
      status: req.body.status,
      description: req.body.description,
      publisher: req.body.publisher,
      publicationYear: req.body.publicationYear,
      pages: req.body.pages,
      language: req.body.language,
      weight: req.body.weight,
      dimensions: req.body.dimensions,
      image: req.body.image,
      images: req.body.images,
      featured: req.body.featured,
      salesThisMonth: req.body.salesThisMonth,
      totalSales: req.body.totalSales,
    });
    res.json({ book });
  } catch (err) {
    next(err);
  }
};

export const deleteBookHandler = async (req, res, next) => {
  const id = Number(req.params.id);
  try {
    const existing = await getBookById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Book not found' });
    }

    await deleteBook(id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
