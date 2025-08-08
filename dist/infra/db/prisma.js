"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const env_1 = require("@/config/env");
const prisma_1 = require("../../generated/prisma");
const log = env_1.ENV.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'];
exports.prisma = global.prisma ?? new prisma_1.PrismaClient({ log });
if (env_1.ENV.NODE_ENV !== 'production') {
    global.prisma = exports.prisma;
}
