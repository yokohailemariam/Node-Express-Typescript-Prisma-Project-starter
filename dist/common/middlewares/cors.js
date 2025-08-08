"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCors = buildCors;
const env_1 = require("@/config/env");
const cors_1 = __importDefault(require("cors"));
function buildCors() {
    const origins = env_1.ENV.CORS_ORIGIN?.split(',')
        .map((s) => s.trim())
        .filter(Boolean) ?? ['http://localhost:3000'];
    return (0, cors_1.default)({
        origin: origins,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
        exposedHeaders: ['X-Request-Id', 'ETag'],
        maxAge: 600,
    });
}
