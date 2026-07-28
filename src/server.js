import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import { authRouter } from './routers/auth.js';
import { usersRouter } from './routers/users.js';
import { storiesRouter } from './routers/stories.js';
import { categoriesRouter } from './routers/categories.js';

import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import mongoose from 'mongoose';

const swaggerDocument = YAML.load('./src/docs/openapi.yaml');

function resolveAllowedOrigins() {
  const raw = process.env.ALLOWED_ORIGINS || '';
  const origins = raw
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

  if (origins.length > 0) {
    return origins;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('Missing required environment variable: ALLOWED_ORIGINS must be set in production');
  }

  return ['http://localhost:3000'];
}

export function createServer() {
  const app = express();

  const allowedOrigins = resolveAllowedOrigins();

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error('Not allowed by CORS'));
      },
      credentials: true,
    }),
  );
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(cookieParser());

  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.get('/ready', (req, res) => {
    const isConnected = mongoose.connection.readyState === 1;

    if (isConnected) {
      res.status(200).json({ status: 'ready', database: 'connected' });
      return;
    }

    res.status(503).json({ status: 'not_ready', database: 'disconnected' });
  });

  app.use('/api/auth', authRouter);
  app.use('/api/users', usersRouter);
  app.use('/api/stories', storiesRouter);
  app.use('/api/categories', categoriesRouter);

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.use(notFoundHandler);

  app.use(errorHandler);

  return app;
}
