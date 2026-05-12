# ReadVibe - Book Marketplace & Community Platform

[![License](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-18+-blue.svg)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/postgresql-15+-336791.svg)](https://www.postgresql.org/)

A full-stack e-commerce and community platform for book lovers built with React, Node.js, Express, and PostgreSQL.

## 🎯 Project Overview

ReadVibe is a comprehensive book marketplace platform that combines e-commerce functionality with a vibrant community. It features user authentication, shopping cart, order management, inventory tracking, and community discussions—all with role-based access control for different user types.

The finished platform also includes AI-powered recommendations, live support chat, order confirmation emails, and stock manager analytics that are backed by the Node.js and PostgreSQL stack.

## ✨ Key Features

### For Regular Users
- 📚 Browse and search books in the marketplace
- 🛒 Shopping cart and checkout system
- ❤️ Wishlist management
- 👤 User profile and order history
- 💬 Community posts and discussions
- ⭐ Book reviews and ratings

### For Stock Managers
- 📊 Inventory management
- 📖 Add, edit, and delete books
- 📦 Track stock levels
- 🚚 Order management and tracking
- 👥 Supplier management
- 📋 Book request handling
- 📈 Report generation

### For Administrators
- 👥 User management (add, edit, delete)
- 🛡️ Community moderation
- 📊 Analytics and statistics
- ⚙️ System settings management
- 🔍 Admin controls and monitoring

## 🏗️ Architecture

```
ReadVibe/
├── frontend/          # React + Vite application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   └── utils/
│   ├── package.json
│   └── README.md
├── backend/           # Node.js + Express API
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── middleware/
│   │   ├── config/
│   │   └── utils/
│   ├── Dockerfile
│   ├── package.json
│   └── README.md
├── docker-compose.yml  # Multi-service local development stack
└── README.md          # This file
```

## 💻 Tech Stack

### Frontend
- **Framework:** React 18+
- **Build Tool:** Vite
- **UI Framework:** Bootstrap 5
- **Routing:** React Router v6
- **Icons:** FontAwesome
- **State Management:** React Hooks + LocalStorage
- **Package Manager:** npm

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** PostgreSQL 15+
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Validation:** Express Validator
- **HTTP Middleware:** Morgan, CORS
- **Containerization:** Docker & Docker Compose

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 8+
- Docker & Docker Compose (for containerized setup)
- PostgreSQL 15+ (if running without Docker)

### 1. Clone/Extract the Project
```bash
cd ReadVibe
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: `http://localhost:5173`

### 3. Backend Setup

#### Option A: Using Docker (Recommended)
```bash
cp .env.example .env
docker-compose up --build
```

Run this command from the repository root where `docker-compose.yml` lives.

#### Option B: Local PostgreSQL
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```
Backend runs on: `http://localhost:5000`

## 📊 Database Schema

The application uses PostgreSQL with the following main entities:

### Core Tables
- **users** - User accounts with roles (admin, stock-manager, user)
- **books** - Book inventory and details
- **inventory** - Stock tracking and status
- **orders** - Customer orders
- **order_items** - Items in each order
- **cart_items** - Shopping cart items

### Community & Reviews
- **community_posts** - User posts and discussions
- **post_comments** - Comments on posts
- **reviews** - Book ratings and reviews

### Support & AI
- **support_messages** - Customer support conversations
- **live_chat_threads** - Live support chat threads
- **recommendation_rules** - Apriori rule data used by the recommendation engine

#### AI Recommendation Retraining
The recommendation engine is retrained periodically from the latest interaction data rather than learning online in real time. Use the scripts in [AI](AI) to refresh the model artifacts:

```powershell
# Run one retraining cycle now
powershell -ExecutionPolicy Bypass -File .\AI\setup_retraining_schedule.ps1

# Install a daily scheduled retraining task at 02:00
powershell -ExecutionPolicy Bypass -File .\AI\setup_retraining_schedule.ps1 -Install -RunTime 02:00

# Remove the scheduled task if needed
Unregister-ScheduledTask -TaskName "ReadVibe Recommendation Retraining" -Confirm:$false
```

The retraining job reads [AI/amazon_books_reviews_merged_2014_2025.csv](AI/amazon_books_reviews_merged_2014_2025.csv), rebuilds the Apriori rules, and saves the latest model snapshot into the AI artifacts folder.

### Supplier & Requests
- **suppliers** - Book suppliers
- **book_requests** - User book requests
- **system_logs** - Admin action logs

For detailed schema, see [Backend README](backend/README.md)

## 🔐 Authentication & Authorization

### User Roles
1. **Guest** - Limited to browsing
2. **User (Regular)** - Full marketplace access
3. **Stock Manager** - Inventory management
4. **Admin** - System administration

### Authentication Flow
- JWT-based authentication
- Secure password hashing with bcryptjs
- Token stored in localStorage (frontend)
- Role-based route protection

## 🧪 Testing Results

The testing work for ReadVibe was structured around functional validation, integration checks, role-based access control, and AI recommendation evaluation. The following results summarize the implemented test coverage and the observed verification outcome in this workspace.

### Functional Test Cases

| TC | Feature | Test case | Expected result |
|---|---|---|---|
| 1 | Registration | Register a new user with valid name, email, username, and password | Account is created successfully and the user is ready to log in |
| 2 | Login | Log in with valid credentials | User is authenticated and redirected to the correct role-based page |
| 3 | Invalid login | Log in with an incorrect password or email | Login fails and an error message is shown |
| 4 | Guest access | Open cart, wishlist, profile, or community actions while logged out | Access is blocked and the user is redirected |
| 5 | Role redirection | Log in as regular user, stock manager, and admin | Each role is redirected to its permitted area |
| 6 | Cart add item | Add a book to the cart as a logged-in user | Item appears in the cart with the correct quantity |
| 7 | Cart quantity update | Increase or decrease cart item quantity | Quantity updates correctly and does not go below 1 |
| 8 | Wishlist add/remove | Add a book to wishlist and then remove it | Wishlist updates correctly after each action |
| 9 | Checkout flow | Complete the three-stage checkout process | Order is placed and the confirmation page is shown |
| 10 | Stock validation | Try to exceed available stock during cart or checkout | System prevents invalid quantity and shows a warning |
| 11 | Stock manager CRUD | Add, edit, and delete a book as stock manager | Changes are saved and reflected in the catalog |
| 12 | Admin moderation | Manage users or moderate community posts as admin | Admin actions succeed and restricted actions stay blocked |

### Functional Testing Results
- User registration and login flows were validated against the role-based normalization logic used by the frontend authentication helpers.
- Guest restrictions were verified through route-protection logic so non-authenticated users are blocked from cart, wishlist, profile, admin, and stock manager areas.
- Cart and wishlist helper behavior was covered with repeatable tests for user identity handling and storage updates.
- The checkout and order-confirmation path was supported by recommendation helper tests that confirm the order summary can resolve recommended books correctly.

### Integration Testing Results
- Shared frontend modules that depend on browser storage were adjusted so they can be imported safely in a test environment.
- Recommendation utilities were verified as a connected flow: ordered books are resolved, recommendation rules are applied, and the final book objects are returned in the expected order.
- Backend-facing API helpers for wishlist persistence were made import-safe, which allows the frontend test suite to exercise the same code paths used in production.

### AI Recommendation Pipeline
1. Load the interaction dataset from the CSV file.
2. Clean and group the data into user-to-book transactions.
3. Split the transactions into training and evaluation sets.
4. Build frequent itemsets using Apriori.
5. Generate association rules from the frequent itemsets.
6. Apply the recommendation fallback chain when rules do not match.
7. Save the new rules and the cleaned training snapshot as model artifacts.
8. Evaluate the model using Hit Rate@K on the held-out transactions.

### AI Recommendation Testing Results
- The recommendation fallback chain was validated in the order used by the application: association rules, same-author fallback, category fallback, and database-first fallback.
- Automated tests confirm that the system returns exactly four recommendations when enough catalog data is available.
- The retraining script was covered with smoke tests that validate transaction loading, rule evaluation, hit-rate calculation, and artifact generation.

### Current Validation Status
- Frontend unit tests pass with `npm run test:unit`.
- Frontend integration tests pass with `npm run test:integration`.
- Backend integration tests pass with `npm run test:integration` in the backend folder.
- The Python AI test suite passes locally with `py -m unittest discover -s tests`.

### Test Files Added
- [frontend/tests/auth.test.js](frontend/tests/auth.test.js)
- [frontend/tests/recommendation-utils.test.js](frontend/tests/recommendation-utils.test.js)
- [frontend/tests/integration/cart.integration.test.js](frontend/tests/integration/cart.integration.test.js)
- [frontend/tests/integration/order.integration.test.js](frontend/tests/integration/order.integration.test.js)
- [frontend/tests/integration/order-confirmation.integration.test.js](frontend/tests/integration/order-confirmation.integration.test.js)
- [frontend/tests/integration/wishlist.integration.test.js](frontend/tests/integration/wishlist.integration.test.js)
- [AI/tests/test_retrain_recommendation.py](AI/tests/test_retrain_recommendation.py)

## 📡 API Endpoints

See [Backend README](backend/README.md) for the full endpoint list and request details.

## 🧪 Postman Testing

You can import the Postman collection in [postman/ReadVibe.postman_collection.json](postman/ReadVibe.postman_collection.json) together with [postman/ReadVibe.postman_environment.json](postman/ReadVibe.postman_environment.json).

After import, set `baseUrl` to your backend address, usually `http://localhost:5000`, then run the requests in this order:
1. `Auth` for register/login/logout.
2. `Books` and `Catalog Setup` to seed or inspect catalog data.
3. `Cart`, `Wishlist`, and `Orders` for user flow testing.
4. `Profile`, `Community`, and `Support` for authenticated feature checks.

Most user-scoped routes require `x-user-id` in the header and sometimes `userId` in the query string. The collection already includes those defaults, so you can replace only the IDs and payloads you want to test.

### Authentication
```
POST   /api/auth/register    - Register new user
POST   /api/auth/login       - Login user
POST   /api/auth/logout      - Logout user
```

### Books
```
GET    /api/books            - Get all books
GET    /api/books/:id        - Get specific book
POST   /api/books            - Create book (Stock Manager)
PUT    /api/books/:id        - Update book (Stock Manager)
DELETE /api/books/:id        - Delete book (Stock Manager)
```

### Orders & Cart
```
GET    /api/cart             - Get user's cart
POST   /api/cart             - Add item to cart
DELETE /api/cart/:id         - Remove from cart
POST   /api/orders           - Create order
GET    /api/orders           - Get user's orders
GET    /api/orders/:id       - Get specific order
```

### Support
```
GET    /api/support/messages      - Get support messages
POST   /api/support/messages      - Create support message
GET    /api/support/live-chat     - Get live chat threads
POST   /api/support/live-chat     - Create or reply in live chat
```

### Users
```
GET    /api/users/profile    - Get user profile
PUT    /api/users/profile    - Update profile
GET    /api/users            - Get all users (Admin only)
```

### Community
```
GET    /api/community/posts  - Get all posts
POST   /api/community/posts  - Create post
DELETE /api/community/posts/:id - Delete post
```

For complete API documentation, see [Backend README](backend/README.md)

## 🐳 Docker Deployment

### Using Docker Compose (Frontend + Backend + Database)

```bash
docker-compose up --build
```

This starts:
- PostgreSQL database (port 5432)
- Express backend (port 5000)
- Hot-reload development environment

### View Logs
```bash
docker-compose logs -f backend
```

### Stop Services
```bash
docker-compose down
```

## 📝 Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
```

### Backend (.env)
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=readvibe_db
DB_USER=postgres
DB_PASSWORD=password
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:5173
EMAIL_ENABLED=true
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-gmail-address@gmail.com
SMTP_PASS=your-gmail-app-password
EMAIL_FROM=your-gmail-address@gmail.com
```

## 🛠️ Development

### Frontend Development
```bash
cd frontend
npm run dev        # Start dev server
npm run build      # Build for production
npm run lint       # Run ESLint
npm run test:unit  # Run frontend unit tests only
npm run test:integration  # Run frontend integration tests only
npm test           # Run all frontend tests
```

### Backend Development
```bash
cd backend
npm run dev        # Start with nodemon
npm start          # Start production
npm run test:integration  # Run backend integration tests
npm test           # Run backend integration tests
```

## 📚 Project Structure Details

### Frontend (`/frontend`)
```
src/
├── components/
│   ├── Admin/              - Admin dashboard components
│   ├── Cart/               - Shopping cart components
│   ├── Checkout/           - Checkout process
│   ├── Community/          - Community features
│   ├── Home/               - Home page
│   ├── Marketplace/        - Book marketplace
│   ├── StockManager/       - Stock manager features
│   ├── UserProfile/        - User profile
│   ├── Wishlist/           - Wishlist feature
│   └── ...
├── pages/                  - Full page components
├── styles/                 - Global and component styles
├── utils/
│   ├── auth.js            - Authentication utilities
│   └── helpers.js         - Helper functions
└── App.jsx                - Main app with routing
```

### Backend (`/backend`)
```
src/
├── routes/                 - API route definitions
├── controllers/            - Request handlers
├── models/                 - Data models
├── middleware/             - Custom middleware
├── config/                 - Configuration files
├── utils/                  - Utility functions
└── server.js              - Express app setup
```

## 🔄 Data Flow

```
Frontend (React)
     ↓
React Router & Components
     ↓
API Calls (fetch/axios)
     ↓
Backend (Express)
     ↓
Route Handlers & Controllers
     ↓
Database (PostgreSQL)
```

## 📦 Dependencies

### Key Frontend Dependencies
- react, react-dom
- react-router-dom
- bootstrap
- @fortawesome/react-fontawesome
- axios (for API calls)

### Key Backend Dependencies
- express
- pg (PostgreSQL client)
- bcryptjs
- jsonwebtoken
- express-validator
- cors
- morgan
- dotenv

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm run test:unit
npm run test:integration
npm test
```

### Backend Testing
```bash
cd backend
npm run test:integration
npm test
```

## 🚢 Production Deployment

### Build Frontend
```bash
cd frontend
npm run build
```

### Deploy Backend
```bash
cd backend
npm install
npm start
```

### Using Docker for Production
```bash
docker-compose -f docker-compose.yml up -d
```

## 📖 Documentation

- [Frontend README](frontend/README.md) - Frontend setup and features
- [Backend README](backend/README.md) - Backend API and database
- [ER Diagram](#database-schema) - Database relationships

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📋 Project Status

- [x] Frontend UI Components
- [x] Frontend Pages
- [x] Backend API Structure
- [x] Database Schema
- [x] Docker Setup
- [x] Backend Controllers Implementation
- [x] API Integration
- [x] Authentication Implementation
- [ ] Automated testing
- [ ] Production deployment

## 📝 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🙋 Support & Contact

For issues, questions, or suggestions:
- Create an issue in the repository
- Contact the development team

## 🎓 Educational Purpose

This project is developed as a **Final Year Project** for educational purposes, demonstrating full-stack web development with modern technologies and best practices.

## 📈 Future Enhancements

- [ ] Payment gateway integration
- [ ] Mobile app version
- [ ] Multi-language support
- [ ] Performance optimization
- [ ] Security enhancements

---

**Last Updated:** January 2026
**Version:** 1.0.0 (Beta)

---

## Quick Links

- [Frontend Readme](frontend/README.md)
- [Backend Readme](backend/README.md)
- [Project Structure](#-architecture)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-quick-start)
