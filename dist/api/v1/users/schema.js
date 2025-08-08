"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsersQuerySchema = exports.updateUserSchema = exports.createUserSchema = exports.idParamSchema = void 0;
const zod_1 = require("zod");
exports.idParamSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
exports.createUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required'),
    email: zod_1.z.email('Invalid email'),
});
exports.updateUserSchema = zod_1.z
    .object({
    name: zod_1.z.string().min(1).optional(),
    email: zod_1.z.email('Invalid email').optional(),
})
    .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
});
exports.listUsersQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).optional(),
    limit: zod_1.z.coerce.number().int().min(1).max(100).optional(),
    cursor: zod_1.z.string().uuid().optional(),
});
