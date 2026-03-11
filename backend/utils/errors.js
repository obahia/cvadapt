/**
 * Error handling middleware and utilities
 */

import Logger from "./logger.js";
const logger = new Logger("ErrorHandler");

export class CVAdaptError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.name = "CVAdaptError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function createErrorResponse(error) {
  const response = {
    ok: false,
    error: error.message,
    timestamp: new Date().toISOString(),
  };

  if (error.details) {
    response.details = error.details;
  }

  if (process.env.NODE_ENV === "development") {
    response.stack = error.stack;
  }

  return response;
}

export function errorHandler(err, req, res, next) {
  // Log error with all details
  logger.error("Unhandled error", {
    name: err.name,
    message: err.message,
    path: req.path,
    method: req.method,
    stack: err.stack,
  });

  if (err instanceof CVAdaptError) {
    return res.status(err.statusCode).json(createErrorResponse(err));
  }

  // JSON parsing error
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json(
      createErrorResponse(new CVAdaptError("JSON inválido no corpo da requisição", 400))
    );
  }

  // Generic error
  res.status(500).json(
    createErrorResponse(
      new CVAdaptError("Erro interno do servidor. Contacte o administrador.", 500)
    )
  );
}

export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export default {
  CVAdaptError,
  createErrorResponse,
  errorHandler,
  asyncHandler,
};
