"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const env_1 = require("@/config/env");
const serverUrl = env_1.ENV.API_BASE_URL ?? `http://localhost:${env_1.ENV.PORT ?? 3000}`;
const definition = {
    openapi: '3.0.3',
    info: {
        title: 'Aug-bing API',
        version: '1.0.0',
        description: 'Starter Express API with response envelopes, RFC7807 errors, and users CRUD',
    },
    servers: [{ url: serverUrl }],
    components: {
        schemas: {
            ProblemDetails: {
                type: 'object',
                properties: {
                    type: { type: 'string', example: 'about:blank' },
                    title: { type: 'string', example: 'Bad Request' },
                    status: { type: 'integer', example: 400 },
                    detail: { type: 'string', example: 'Validation failed' },
                    instance: { type: 'string', example: '/api/v1/users' },
                    traceId: { type: 'string', example: '5f5c9a79-0f72-4d64-bb8b-1c6b6a8a9d51' },
                    errors: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                path: { type: 'string' },
                                message: { type: 'string' },
                                in: { type: 'string', enum: ['body', 'query', 'params'] },
                            },
                        },
                    },
                },
                required: ['title', 'status'],
            },
            PaginationMeta: {
                type: 'object',
                properties: {
                    total: { type: 'integer', example: 42 },
                    page: { type: 'integer', example: 1 },
                    limit: { type: 'integer', example: 20 },
                    pageCount: { type: 'integer', example: 3 },
                },
            },
            UserDTO: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' },
                    email: { type: 'string', format: 'email' },
                    name: { type: 'string', nullable: true },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                },
                required: ['id', 'email', 'createdAt', 'updatedAt'],
            },
            CreateUser: {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                },
                required: ['name', 'email'],
            },
            UpdateUser: {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                },
                additionalProperties: false,
            },
            EnvelopeUser: {
                type: 'object',
                properties: {
                    traceId: { type: 'string' },
                    data: { $ref: '#/components/schemas/UserDTO' },
                },
                required: ['data'],
            },
            EnvelopeUsers: {
                type: 'object',
                properties: {
                    traceId: { type: 'string' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/UserDTO' } },
                    meta: {
                        type: 'object',
                        properties: {
                            pagination: { $ref: '#/components/schemas/PaginationMeta' },
                            cursor: {
                                type: 'object',
                                properties: {
                                    nextCursor: { type: 'string', nullable: true },
                                    limit: { type: 'integer' },
                                },
                            },
                        },
                        additionalProperties: true,
                    },
                },
                required: ['data'],
            },
            EnvelopeBoolean: {
                type: 'object',
                properties: {
                    traceId: { type: 'string' },
                    data: { type: 'boolean' },
                },
                required: ['data'],
            },
        },
    },
    paths: {
        '/health': {
            get: {
                tags: ['System'],
                summary: 'Liveness probe',
                responses: { 200: { description: 'OK' } },
            },
        },
        '/api/v1/users': {
            get: {
                tags: ['Users'],
                summary: 'List users (page/limit or cursor)',
                parameters: [
                    { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1 } },
                    { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100 } },
                    { name: 'cursor', in: 'query', schema: { type: 'string', format: 'uuid' } },
                ],
                responses: {
                    200: {
                        description: 'Users list',
                        content: {
                            'application/json': { schema: { $ref: '#/components/schemas/EnvelopeUsers' } },
                        },
                    },
                    400: {
                        description: 'Validation error',
                        content: {
                            'application/json': { schema: { $ref: '#/components/schemas/ProblemDetails' } },
                        },
                    },
                },
            },
            post: {
                tags: ['Users'],
                summary: 'Create user',
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateUser' } } },
                },
                responses: {
                    201: {
                        description: 'Created',
                        content: {
                            'application/json': { schema: { $ref: '#/components/schemas/EnvelopeUser' } },
                        },
                    },
                    400: {
                        description: 'Validation error',
                        content: {
                            'application/json': { schema: { $ref: '#/components/schemas/ProblemDetails' } },
                        },
                    },
                    409: {
                        description: 'Conflict',
                        content: {
                            'application/json': { schema: { $ref: '#/components/schemas/ProblemDetails' } },
                        },
                    },
                },
            },
        },
        '/api/v1/users/{id}': {
            get: {
                tags: ['Users'],
                summary: 'Get user by ID',
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
                ],
                responses: {
                    200: {
                        description: 'OK',
                        content: {
                            'application/json': { schema: { $ref: '#/components/schemas/EnvelopeUser' } },
                        },
                    },
                    404: {
                        description: 'Not Found',
                        content: {
                            'application/json': { schema: { $ref: '#/components/schemas/ProblemDetails' } },
                        },
                    },
                },
            },
            patch: {
                tags: ['Users'],
                summary: 'Update user',
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
                ],
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateUser' } } },
                },
                responses: {
                    200: {
                        description: 'OK',
                        content: {
                            'application/json': { schema: { $ref: '#/components/schemas/EnvelopeUser' } },
                        },
                    },
                    400: {
                        description: 'Validation error',
                        content: {
                            'application/json': { schema: { $ref: '#/components/schemas/ProblemDetails' } },
                        },
                    },
                    404: {
                        description: 'Not Found',
                        content: {
                            'application/json': { schema: { $ref: '#/components/schemas/ProblemDetails' } },
                        },
                    },
                },
            },
            delete: {
                tags: ['Users'],
                summary: 'Delete user',
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
                ],
                responses: {
                    200: {
                        description: 'OK',
                        content: {
                            'application/json': { schema: { $ref: '#/components/schemas/EnvelopeBoolean' } },
                        },
                    },
                    404: {
                        description: 'Not Found',
                        content: {
                            'application/json': { schema: { $ref: '#/components/schemas/ProblemDetails' } },
                        },
                    },
                },
            },
        },
    },
};
const swaggerSpec = (0, swagger_jsdoc_1.default)({ definition, apis: [] });
exports.default = swaggerSpec;
