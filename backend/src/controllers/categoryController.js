// Controller layer for category management requests.
import {
  createCategory,
  deleteCategory,
  getCategoryById,
  listCategories,
  updateCategory,
} from '../models/categoryModel.js';

export const getCategories = async (_req, res, next) => {
  try {
    const categories = await listCategories();
    res.json({ categories });
  } catch (err) {
    next(err);
  }
};

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

export const createCategoryHandler = async (req, res, next) => {
  try {
    const { name } = req.body || {};
    const category = await createCategory({ name });
    res.status(201).json({ category });
  } catch (err) {
    next(err);
  }
};

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
