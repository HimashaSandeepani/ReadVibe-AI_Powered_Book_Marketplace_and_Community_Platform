// Express app initialization and middleware wiring for the API server.
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

export const createApp = ({
  authRouter,
  booksRouter,
  usersRouter,
  cartRouter,
  ordersRouter,
  communityRouter,
  wishlistRouter,
  profileRouter,
  publishersRouter,
  categoriesRouter,
  authorsRouter,
  supportRouter,
  emailRouter,
} = {}) => {
  const app = express();

  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  }));
  app.use(morgan('combined'));
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  if (authRouter) app.use('/api/auth', authRouter);
  if (booksRouter) app.use('/api/books', booksRouter);
  if (usersRouter) app.use('/api/users', usersRouter);
  if (cartRouter) app.use('/api/cart', cartRouter);
  if (ordersRouter) app.use('/api/orders', ordersRouter);
  if (communityRouter) app.use('/api/community', communityRouter);
  if (wishlistRouter) app.use('/api/wishlist', wishlistRouter);
  if (profileRouter) app.use('/api/profile', profileRouter);
  if (publishersRouter) app.use('/api/publishers', publishersRouter);
  if (categoriesRouter) app.use('/api/categories', categoriesRouter);
  if (authorsRouter) app.use('/api/authors', authorsRouter);
  if (supportRouter) app.use('/api/support', supportRouter);
  if (emailRouter) app.use('/api', emailRouter);

  app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running', timestamp: new Date() });
  });

  app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
      error: err.message || 'Internal Server Error',
      status: err.status || 500,
    });
  });

  return app;
};

export default createApp();