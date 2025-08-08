import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import apiRoutes from './api';
import { errorHandler } from './common/middlewares/errorHandler';
import { AppError } from './common/middlewares/AppError';
import { requestId } from './common/middlewares/requestId';
import { buildCors } from './common/middlewares/cors';
import { generalLimiter, speedLimiter } from './common/middlewares/rateLimit';
import { httpLogger } from './common/middlewares/httpLogger';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './docs/swagger';
import { prisma } from '@/infra/db/prisma';
import { httpRequestDuration, metricsMiddleware } from '@/common/monitoring/metrics';

const app = express();

app.disable('x-powered-by');
app.set('etag', 'weak');
app.set('trust proxy', 1);

// Middleware
app.use(requestId());
app.use(httpLogger());
app.use(helmet());
app.use(buildCors());
app.use(express.json({ limit: '1mb' }));
app.use(generalLimiter);
app.use(speedLimiter);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.get('/readyz', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: 'READY' });
  } catch {
    res.status(503).json({ status: 'DEGRADED', traceId: res.locals.requestId });
  }
});

// Record HTTP durations
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const route = (req as any).route?.path || req.path;
    httpRequestDuration.labels(req.method, route, String(res.statusCode)).observe(duration);
  });
  next();
});

// Metrics endpoint
app.get('/metrics', metricsMiddleware());

// Docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
app.get('/docs.json', (_req, res) => res.json(swaggerSpec));

app.use('/api/v1', apiRoutes);

app.use((req, _res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

app.use(errorHandler);

export default app;
