const errorHandler = (err, req, res, next) => {
  // Log the error for the developer
  console.error(err.stack);

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Mongoose Bad ObjectId Error (CastError)
  if (err.name === 'CastError') {
    message = `Resource not found. Invalid: ${err.path}`;
    statusCode = 404;
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    statusCode = 400;
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors).map(val => val.message).join(', ');
    statusCode = 400;
  }
  
  res.status(statusCode).json({
    success: false,
    message: message,
    // Provide stack trace only in development mode
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export default errorHandler;