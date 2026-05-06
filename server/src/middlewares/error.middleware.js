export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Erro interno do servidor.';

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    statusCode = 404;
    message = 'Recurso não encontrado.';
  }
  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `O campo '${field}' já está em uso.`;
  }
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  }
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token inválido.';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expirado.';
  }

  console.error(`[ERROR] ${statusCode} - ${message}`);
  res.status(statusCode).json({ success: false, message });
};
