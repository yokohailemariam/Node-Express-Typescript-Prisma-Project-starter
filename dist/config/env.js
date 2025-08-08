"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const envSchema = zod_1.z
    .object({
    PORT: zod_1.z.coerce.number().int().positive().default(3000),
    NODE_ENV: zod_1.z.enum(['development', 'test', 'production']).default('development'),
    JWT_SECRET: zod_1.z.string().min(1),
    DATABASE_URL: zod_1.z.string().min(1).optional(),
    CORS_ORIGIN: zod_1.z.string().min(1).default('http://localhost:3000,http://localhost:3001'),
})
    .refine((env) => env.NODE_ENV !== 'production' || !!env.DATABASE_URL, {
    message: 'DATABASE_URL is required in production',
    path: ['DATABASE_URL'],
});
exports.ENV = envSchema.parse(process.env);
