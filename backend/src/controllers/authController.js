import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma.js';
import { signAccessToken, signRefreshToken } from '../utils/jwt.js';

export const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await prisma.user.findFirst({ where: { username, deletedAt: null } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const payload = { userId: user.id, username: user.username };
  res.json({ accessToken: signAccessToken(payload), refreshToken: signRefreshToken(payload), user: payload });
};

export const refresh = async (req, res) => res.json({ message: 'Use login for demo mode' });
export const logout = async (req, res) => res.json({ success: true });
