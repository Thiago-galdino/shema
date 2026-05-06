import * as authService from '../services/auth.service.js';

export const login = async (req, res) => {
  const data = await authService.login(req.body);
  res.json({ success: true, ...data });
};

export const register = async (req, res) => {
  const data = await authService.register(req.body);
  res.status(201).json({ success: true, ...data });
};

export const refresh = async (req, res) => {
  const { refreshToken } = req.body;
  const data = await authService.refresh(refreshToken);
  res.json({ success: true, ...data });
};

export const logout = async (req, res) => {
  await authService.logout(req.user._id);
  res.json({ success: true, message: 'Logout realizado com sucesso.' });
};

export const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};
