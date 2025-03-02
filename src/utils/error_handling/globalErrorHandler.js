const globalErrorHandler = (err, req, res, next) => {
  const status = err.cause || 500;
  return res
    .status(status)
    .json({ status: false, message: err.message, stack: err.stack });
};

export default globalErrorHandler;
