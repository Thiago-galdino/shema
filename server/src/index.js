import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import swaggerUi from 'swagger-ui-express';
import connectDB from './config/db.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { swaggerSpec } from './config/swagger.js';

import authRoutes from './routes/auth.routes.js';
import memberRoutes from './routes/member.routes.js';
import cellRoutes from './routes/cell.routes.js';
import eventRoutes from './routes/event.routes.js';
import postRoutes from './routes/post.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Conectar ao MongoDB
connectDB();

// Middlewares globais
const allowedOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`Origem não permitida pelo CORS: ${origin}`));
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// Servir arquivos de upload
app.use('/uploads', express.static(path.join(__dirname, '..', '..', 'uploads')));

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/cells', cellRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Shema API está rodando! 🚀', timestamp: new Date() });
});

// Swagger UI (apenas fora de produção)
if (process.env.NODE_ENV !== 'production') {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// Handler global de erros (deve ser o último)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📡 API disponível em http://localhost:${PORT}/api`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health\n`);
});
