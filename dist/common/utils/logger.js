"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const env_1 = require("@/config/env");
const winston_1 = require("winston");
const isProduction = env_1.ENV.NODE_ENV === 'production';
exports.logger = (0, winston_1.createLogger)({
    level: isProduction ? 'info' : 'debug',
    format: isProduction
        ? winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.errors({ stack: true }), winston_1.format.json())
        : winston_1.format.combine(winston_1.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.format.errors({ stack: true }), winston_1.format.colorize(), winston_1.format.printf(({ timestamp, level, message, stack, ...rest }) => {
            const meta = Object.keys(rest).length ? ` ${JSON.stringify(rest)}` : '';
            return `${timestamp} [${level.toUpperCase()}]: ${stack || message}${meta}`;
        })),
    transports: [
        new winston_1.transports.Console(),
        new winston_1.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston_1.transports.File({ filename: 'logs/combined.log' }),
    ],
    exitOnError: false,
});
