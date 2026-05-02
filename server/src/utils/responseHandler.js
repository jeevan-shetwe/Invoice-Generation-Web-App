export const sendSuccess = (res, data, statusCode = 200, message = 'Success') => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

export const sendError = (res, error, statusCode = 500, details = null) => {
  return res.status(statusCode).json({
    success: false,
    error,
    details
  });
};
