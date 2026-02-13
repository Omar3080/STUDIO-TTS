import { StatusCodes } from 'http-status-codes';
import { verifyAccessToken } from '../utils/jwt.js';

export const auth = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid token' });
  }
};
