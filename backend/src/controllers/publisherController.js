// Controller layer for publisher-related requests.
import {
  createPublisher,
  deletePublisher,
  getPublisherById,
  listPublishers,
  updatePublisher,
} from '../models/publisherModel.js';

// Returns the full publisher list for admin views.
export const getPublishers = async (_req, res, next) => {
  try {
    const publishers = await listPublishers();
    res.json({ publishers });
  } catch (err) {
    next(err);
  }
};

// Returns one publisher by id or a 404 response.
export const getPublisher = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const publisher = await getPublisherById(id);
    if (!publisher) {
      return res.status(404).json({ error: 'Publisher not found' });
    }
    res.json({ publisher });
  } catch (err) {
    next(err);
  }
};

// Creates a new publisher record from the request body.
export const createPublisherHandler = async (req, res, next) => {
  try {
    const { name, email, phone, address } = req.body || {};
    const publisher = await createPublisher({ name, email, phone, address });
    res.status(201).json({ publisher });
  } catch (err) {
    next(err);
  }
};

// Updates an existing publisher after confirming it exists.
export const updatePublisherHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const existing = await getPublisherById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Publisher not found' });
    }
    const publisher = await updatePublisher(id, req.body || {});
    res.json({ publisher });
  } catch (err) {
    next(err);
  }
};

// Deletes a publisher after confirming it exists.
export const deletePublisherHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const existing = await getPublisherById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Publisher not found' });
    }
    await deletePublisher(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
