"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const AppError_1 = require("./AppError");
const logger_1 = require("../utils/logger");
const env_1 = require("@/config/env");
const prisma_1 = require("@/generated/prisma");
const titles = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
    422: 'Unprocessable Entity',
    500: 'Internal Server Error',
};
const errorHandler = (err, req, res, _next) => {
    let status = err instanceof AppError_1.AppError ? err.statusCode : 500;
    let title = titles[status] ?? 'Error';
    let detail = err.message || 'Internal Server Error';
    // Prisma known errors
    if (err instanceof prisma_1.Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            status = 409;
            detail = 'Resource already exists (unique constraint)';
        }
    }
    logger_1.logger.error(`[${req.method}] ${req.originalUrl} - ${detail}`, {
        stack: err.stack,
        traceId: res.locals.requestId,
    });
    const problem = {
        type: 'about:blank',
        title,
        status,
        detail,
        instance: req.originalUrl,
        traceId: res.locals.requestId,
        ...(env_1.ENV.NODE_ENV !== 'production' && { stack: err.stack }),
    };
    res.status(status).json(problem);
};
exports.errorHandler = errorHandler;
