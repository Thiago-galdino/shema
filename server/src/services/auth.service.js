import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateAccessToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

const generateRefreshToken = (id) =>
  jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN });

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email, isActive: true }).select('+password +refreshToken');
  if (!user || !(await user.comparePassword(password))) {
    const err = new Error('Email ou senha incorretos.'); err.statusCode = 401; throw err;
  }
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return { user: user.toJSON(), accessToken, refreshToken };
};

export const refresh = async (token) => {
  if (!token) { const err = new Error('Token não fornecido.'); err.statusCode = 401; throw err; }
  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  const user = await User.findById(decoded.id).select('+refreshToken');
  if (!user || user.refreshToken !== token) {
    const err = new Error('Refresh token inválido.'); err.statusCode = 401; throw err;
  }
  const accessToken = generateAccessToken(user._id);
  return { accessToken };
};

export const logout = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
};

export const register = async (data) => {
  const exists = await User.findOne({ email: data.email });
  if (exists) { const err = new Error('Email já cadastrado.'); err.statusCode = 400; throw err; }
  const user = await User.create(data);
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return { user: user.toJSON(), accessToken, refreshToken };
};
