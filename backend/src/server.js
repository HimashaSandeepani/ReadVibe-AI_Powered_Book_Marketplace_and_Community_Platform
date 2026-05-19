// Server entry point that composes the app and starts listening.
import { createApp } from './app.js';
import { createAuthRouter } from './routes/auth.js';
import booksRoutes from './routes/books.js';
import usersRoutes from './routes/users.js';
import { createCartRouter } from './routes/cart.js';
import { createOrdersRouter } from './routes/orders.js';
import communityRoutes from './routes/community.js';
import { createWishlistRouter } from './routes/wishlist.js';
import profileRoutes from './routes/profile.js';
import publishersRoutes from './routes/publishers.js';
import categoriesRoutes from './routes/categories.js';
import authorsRoutes from './routes/authors.js';
import supportRoutes from './routes/support.js';
import emailRoutes from './routes/emailRoutes.js';
import * as userModel from './models/userModel.js';
import * as cartController from './controllers/cartController.js';
import * as orderController from './controllers/orderController.js';
import * as wishlistController from './controllers/wishlistController.js';

const app = createApp({
  authRouter: createAuthRouter(userModel),
  booksRouter: booksRoutes,
  usersRouter: usersRoutes,
  cartRouter: createCartRouter(cartController),
  ordersRouter: createOrdersRouter(orderController),
  communityRouter: communityRoutes,
  wishlistRouter: createWishlistRouter(wishlistController),
  profileRouter: profileRoutes,
  publishersRouter: publishersRoutes,
  categoriesRouter: categoriesRoutes,
  authorsRouter: authorsRoutes,
  supportRouter: supportRoutes,
  emailRouter: emailRoutes,
});
const PORT = process.env.PORT || 5000;

// Starts the HTTP server and logs the runtime environment.
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
