import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({ success: false, message: 'Não autorizado. Token não fornecido.' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password -refreshToken');
    if (!req.user || !req.user.isActive) {
      return res.status(401).json({ success: false, message: 'Usuário não encontrado ou inativo.' });
    }
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token inválido ou expirado.' });
  }
};
