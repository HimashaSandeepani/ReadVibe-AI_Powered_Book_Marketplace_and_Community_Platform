# ReadVibe Backend

Node.js + Express.js backend with PostgreSQL database for the ReadVibe project.

## Setup

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 15+ (if running without Docker)

### Installation

1. **Copy environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Update `.env` with your settings:**
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=readvibe_db
   DB_USER=postgres
   DB_PASSWORD=password
   JWT_SECRET=your_secret_key
   FRONTEND_URL=http://localhost:5173
   EMAIL_ENABLED=true
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-gmail-address@gmail.com
   SMTP_PASS=your-gmail-app-password
   EMAIL_FROM=your-gmail-address@gmail.com
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

### Running with Docker

1. **Build and start containers from the repository root:**
   ```bash
   cd ..
   docker-compose up --build
   ```

2. **Access the API:**
   - Backend: http://localhost:5000
   - PostgreSQL: localhost:5432

### Running Locally

1. **Start PostgreSQL** (ensure it's running)

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Start production server:**
   ```bash
   npm start
   ```

## Project Structure

```
backend/
├── src/
│   ├── config/        # Database configuration
│   ├── controllers/   # Route controllers
│   ├── middleware/    # Custom middleware
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   ├── utils/         # Utility functions
│   └── server.js      # Main server file
├── .env.example       # Environment variables template
├── Dockerfile         # Docker image configuration
└── package.json       # Project dependencies
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login user
- POST `/api/auth/logout` - Logout user

### Books
- GET `/api/books` - Get all books
- GET `/api/books/:id` - Get book by ID
- POST `/api/books` - Create book (Stock Manager)
- PUT `/api/books/:id` - Update book (Stock Manager)
- DELETE `/api/books/:id` - Delete book (Stock Manager)

### Users
- GET `/api/users` - Get all users (Admin)
- GET `/api/users/:id` - Get user by id
- POST `/api/users` - Create user
- PUT `/api/users/:id` - Update user
- DELETE `/api/users/:id` - Delete user
- GET `/api/users/roles` - List roles
- GET `/api/users/statuses` - List statuses
- POST `/api/users/statuses` - Create status
- PUT `/api/users/statuses/:id` - Update status
- DELETE `/api/users/statuses/:id` - Delete status

### Cart
- GET `/api/cart` - Get cart for current user
- POST `/api/cart` - Add to cart
- PUT `/api/cart/:bookId` - Update cart item quantity
- DELETE `/api/cart/:bookId` - Remove from cart
- DELETE `/api/cart` - Clear cart

### Orders
- GET `/api/orders` - Get orders for current user
- GET `/api/orders/all` - Get all orders for stock manager and admin dashboards
- POST `/api/orders` - Create order
- GET `/api/orders/:id` - Get order by ID
- PUT `/api/orders/:id/status` - Update order status
- PUT `/api/orders/:id/tracking` - Update order tracking information

### Wishlist
- GET `/api/wishlist` - Get wishlist for current user
- POST `/api/wishlist` - Add wishlist item
- PUT `/api/wishlist/:bookId` - Update wishlist item
- DELETE `/api/wishlist/:bookId` - Remove wishlist item
- DELETE `/api/wishlist` - Clear wishlist

### Profile
- GET `/api/profile` - Get current user profile summary
- PUT `/api/profile` - Update current user profile
- GET `/api/profile/reviews` - List current user reviews
- POST `/api/profile/reviews` - Create current user review
- DELETE `/api/profile/reviews/:id` - Delete current user review

### Community
- GET `/api/community/posts` - Get all posts
- POST `/api/community/posts` - Create post
- GET `/api/community/posts/:id` - Get single post with comments
- POST `/api/community/posts/:id/comments` - Add comment to a post
- POST `/api/community/posts/:id/like` - Toggle like for a post
- GET `/api/community/requests` - List book requests
- POST `/api/community/requests` - Create a book request
- PUT `/api/community/requests/:id/status` - Update a book request status
- DELETE `/api/community/posts/:id` - Delete post

### Support
- GET `/api/support/messages` - Get support messages
- POST `/api/support/messages` - Create a support message
- POST `/api/support/messages/:id/replies` - Reply to a support message
- GET `/api/support/live-chat/threads` - Get live chat threads
- POST `/api/support/live-chat/threads/resolve` - Resolve a live chat thread
- GET `/api/support/live-chat/threads/:orderId/:userId` - Get a live chat thread
- POST `/api/support/live-chat/messages` - Send a live chat message

### Publishers
- GET `/api/publishers` - List publishers
- GET `/api/publishers/:id` - Get publisher by id
- POST `/api/publishers` - Create publisher
- PUT `/api/publishers/:id` - Update publisher
- DELETE `/api/publishers/:id` - Delete publisher

### Categories
- GET `/api/categories` - List categories
- GET `/api/categories/:id` - Get category by id
- POST `/api/categories` - Create category
- PUT `/api/categories/:id` - Update category
- DELETE `/api/categories/:id` - Delete category

### Authors
- GET `/api/authors` - List authors
- GET `/api/authors/:id` - Get author by id
- POST `/api/authors` - Create author
- PUT `/api/authors/:id` - Update author
- DELETE `/api/authors/:id` - Delete author

## Development

### Running Tests
```bash
npm run test:integration
npm test
```

The backend test command currently runs the integration suite. `npm run test:integration` and `npm test` are equivalent.

### Docker Commands

**View logs:**
```bash
docker-compose logs -f backend
```

**Stop containers:**
```bash
docker-compose down
```

**Remove all data:**
```bash
docker-compose down -v
```

## Technologies

- **Framework:** Express.js
- **Database:** PostgreSQL
- **Authentication:** JWT
- **Email:** Nodemailer with Gmail SMTP support
- **Containerization:** Docker
- **Package Manager:** npm
