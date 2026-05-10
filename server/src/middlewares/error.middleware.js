export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Erro interno do servidor.';

  if (err.name === 'CastError') {
    statusCode = 404;
    message = 'Recurso não encontrado.';
  }
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `O campo '${field}' já está em uso.`;
  }
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  }
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token inválido.';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expirado.';
  }

  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack || err);
  } else {
    console.error(`[ERROR] ${new Date().toISOString()} ${req.method} ${req.originalUrl} - ${statusCode}: ${message}`);
  }

  res.status(statusCode).json({ success: false, message });
};
