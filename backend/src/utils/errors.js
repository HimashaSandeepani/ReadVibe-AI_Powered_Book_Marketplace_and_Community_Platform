// Shared application error types and HTTP error helpers.
// Base error type that carries an HTTP status code.
export class AppError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
  }
}

// Represents a request validation failure.
export class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
  }
}

// Represents a missing resource.
export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

// Represents an unauthenticated request.
export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized access') {
    super(message, 401);
  }
}

// Represents a request that lacks required permissions.
export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden access') {
    super(message, 403);
  }
}
