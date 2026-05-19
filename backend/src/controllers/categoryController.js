// Controller layer for category management requests.
import {
  createCategory,
  deleteCategory,
  getCategoryById,
  listCategories,
  updateCategory,
} from '../models/categoryModel.js';

// Returns all categories for filters and admin views.
export const getCategories = async (_req, res, next) => {
  try {
    const categories = await listCategories();
    res.json({ categories });
  } catch (err) {
    next(err);
  }
};

// Returns one category by id or a 404 response.
export const getCategory = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const category = await getCategoryById(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ category });
  } catch (err) {
    next(err);
  }
};

// Creates a new category record.
export const createCategoryHandler = async (req, res, next) => {
  try {
    const { name } = req.body || {};
    const category = await createCategory({ name });
    res.status(201).json({ category });
  } catch (err) {
    next(err);
  }
};

// Updates an existing category after verifying it exists.
export const updateCategoryHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const existing = await getCategoryById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Category not found' });
    }
    const category = await updateCategory(id, req.body || {});
    res.json({ category });
  } catch (err) {
    next(err);
  }
};

// Deletes a category after verifying it exists.
export const deleteCategoryHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const existing = await getCategoryById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Category not found' });
    }
    await deleteCategory(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
