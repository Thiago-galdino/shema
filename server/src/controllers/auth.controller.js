import * as authService from '../services/auth.service.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
};

export const login = async (req, res) => {
  const { refreshToken, ...data } = await authService.login(req.body);
  res.cookie('shema_refresh', refreshToken, COOKIE_OPTIONS);
  res.json({ success: true, ...data });
};

export const register = async (req, res) => {
  const { refreshToken, ...data } = await authService.register(req.body);
  res.cookie('shema_refresh', refreshToken, COOKIE_OPTIONS);
  res.status(201).json({ success: true, ...data });
};

export const refresh = async (req, res) => {
  const token = req.cookies?.shema_refresh;
  const data = await authService.refresh(token);
  res.json({ success: true, ...data });
};

export const logout = async (req, res) => {
  await authService.logout(req.user._id);
  res.clearCookie('shema_refresh', { httpOnly: true, path: '/' });
  res.json({ success: true, message: 'Logout realizado com sucesso.' });
};

export const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};
