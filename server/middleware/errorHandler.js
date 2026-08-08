/**
 * Central Error Handler Middleware
 * Securely handles errors without exposing internal stack traces.
 */

function errorHandler(err, req, res, next) {
  console.error("❌ Server Error:", err.stack || err.message);

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  
  let userMessage = "Something went wrong. Please try again.";
  if (err.message && !err.message.includes('SQL') && !err.message.includes('syntax')) {
    userMessage = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message: userMessage,
    ...(process.env.NODE_ENV === 'development' && { errorDetails: err.message })
  });
}

module.exports = errorHandler;
