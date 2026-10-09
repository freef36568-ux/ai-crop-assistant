export function errorHandler(err, req, res, next) {
  console.error('API Error Handler:', err.message || err);

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    status: 'error',
    error: err.message || 'An unexpected server error occurred.',
    timestamp: new Date().toISOString(),
  });
}
