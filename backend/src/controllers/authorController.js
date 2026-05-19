// Controller layer for author-related requests.
import {
  createAuthor,
  deleteAuthor,
  getAuthorById,
  listAuthors,
  updateAuthor,
} from '../models/authorModel.js';

export const getAuthors = async (_req, res, next) => {
  try {
    const authors = await listAuthors();
    res.json({ authors });
  } catch (err) {
    next(err);
  }
};

export const getAuthor = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const author = await getAuthorById(id);
    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }
    res.json({ author });
  } catch (err) {
    next(err);
  }
};

export const createAuthorHandler = async (req, res, next) => {
  try {
    const { name } = req.body || {};
    const author = await createAuthor({ name });
    res.status(201).json({ author });
  } catch (err) {
    next(err);
  }
};

export const updateAuthorHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const existing = await getAuthorById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Author not found' });
    }
    const author = await updateAuthor(id, req.body || {});
    res.json({ author });
  } catch (err) {
    next(err);
  }
};

export const deleteAuthorHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const existing = await getAuthorById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Author not found' });
    }
    await deleteAuthor(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
