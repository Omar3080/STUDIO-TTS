import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';
import { signAccessToken, signRefreshToken } from '../utils/tokens.js';

export async function login(req, res) {
  const { username, password } = req.body;
  const user = await prisma.user.findFirst({ where: { username, deletedAt: null }, include: { userRoles: { include: { role: true } } } });
  if (!user) return res.status(401).json({ message: 'بيانات الدخول غير صحيحة' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'بيانات الدخول غير صحيحة' });
  const roles = user.userRoles.map(x => x.role.name);
  const payload = { sub: user.id, username: user.username, roles };
  return res.json({ accessToken: signAccessToken(payload), refreshToken: signRefreshToken(payload), user: { id: user.id, fullName: user.fullName, roles } });
}

export async function refresh(req, res) {
  try {
    const decoded = jwt.verify(req.body.refreshToken, process.env.JWT_REFRESH_SECRET);
    return res.json({ accessToken: signAccessToken({ sub: decoded.sub, username: decoded.username, roles: decoded.roles }) });
  } catch {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
}

export function logout(_req, res) {
  return res.json({ message: 'Logged out' });
}
