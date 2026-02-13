import { StatusCodes } from 'http-status-codes';

export const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(err.status || StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message || 'Server error' });
};
