export const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";

  if (err.code === 11000) {
    statusCode = 409;
    const fields = Object.keys(err.keyPattern || err.keyValue || {});
    message = `${fields.join(", ") || "Resource"} already exists`;
  }

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((fieldError) => fieldError.message)
      .join(", ");
  }

  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}`;
  }

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV === "production" ? {} : { stack: err.stack }),
  });
};
