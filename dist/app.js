"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const api_1 = __importDefault(require("./api"));
const errorHandler_1 = require("./common/middlewares/errorHandler");
const AppError_1 = require("./common/middlewares/AppError");
const requestId_1 = require("./common/middlewares/requestId");
const cors_1 = require("./common/middlewares/cors");
const rateLimit_1 = require("./common/middlewares/rateLimit");
const httpLogger_1 = require("./common/middlewares/httpLogger");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = __importDefault(require("./docs/swagger"));
const prisma_1 = require("@/infra/db/prisma");
const metrics_1 = require("@/common/monitoring/metrics");
const app = (0, express_1.default)();
app.disable('x-powered-by');
app.set('etag', 'weak');
app.set('trust proxy', 1);
// Middleware
app.use((0, requestId_1.requestId)());
app.use((0, httpLogger_1.httpLogger)());
app.use((0, helmet_1.default)());
app.use((0, cors_1.buildCors)());
app.use(express_1.default.json({ limit: '1mb' }));
app.use(rateLimit_1.generalLimiter);
app.use(rateLimit_1.speedLimiter);
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});
app.get('/readyz', async (_req, res) => {
    try {
        await prisma_1.prisma.$queryRaw `SELECT 1`;
        res.status(200).json({ status: 'READY' });
    }
    catch {
        res.status(503).json({ status: 'DEGRADED', traceId: res.locals.requestId });
    }
});
// Record HTTP durations
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        const route = req.route?.path || req.path;
        metrics_1.httpRequestDuration.labels(req.method, route, String(res.statusCode)).observe(duration);
    });
    next();
});
// Metrics endpoint
app.get('/metrics', (0, metrics_1.metricsMiddleware)());
// Docs
app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default, { explorer: true }));
app.get('/docs.json', (_req, res) => res.json(swagger_1.default));
app.use('/api/v1', api_1.default);
app.use((req, _res, next) => {
    next(new AppError_1.AppError(`Route ${req.originalUrl} not found`, 404));
});
app.use(errorHandler_1.errorHandler);
exports.default = app;
