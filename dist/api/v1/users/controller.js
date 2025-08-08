"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.create = exports.get = exports.list = void 0;
const svc = __importStar(require("./service"));
const response_1 = require("@/common/utils/response");
const audit_1 = require("@/common/utils/audit");
const list = async (req, res, next) => {
    try {
        res.set('Cache-Control', 'public, max-age=60, must-revalidate');
        const limit = Number(req.query.limit ?? 10);
        const cursor = typeof req.query.cursor === 'string' ? req.query.cursor : undefined;
        if (cursor) {
            const users = await svc.getUsersCursor(cursor, limit);
            const nextCursor = users.length ? users[users.length - 1].id : undefined;
            return (0, response_1.ok)(res, users, { cursor: { nextCursor, limit } });
        }
        const page = Number(req.query.page ?? 1);
        const [users, total] = await Promise.all([svc.getUsers(page, limit), svc.countUsers()]);
        const pageCount = Math.ceil(total / Math.max(1, Math.min(limit, 100)));
        return (0, response_1.ok)(res, users, { pagination: { total, page, limit, pageCount } });
    }
    catch (e) {
        next(e);
    }
};
exports.list = list;
const get = async (req, res, next) => {
    try {
        res.set('Cache-Control', 'public, max-age=60, must-revalidate');
        const user = await svc.getUser(req.params.id);
        return (0, response_1.ok)(res, user);
    }
    catch (e) {
        next(e);
    }
};
exports.get = get;
const create = async (req, res, next) => {
    try {
        const user = await svc.addUser(req.body);
        (0, audit_1.audit)({
            action: 'user.create',
            resource: { type: 'user', id: user.id },
            success: true,
            traceId: res.locals.requestId,
        });
        return (0, response_1.created)(res, user);
    }
    catch (e) {
        (0, audit_1.audit)({
            action: 'user.create',
            success: false,
            traceId: res.locals.requestId,
            metadata: { error: e.message },
        });
        next(e);
    }
};
exports.create = create;
const update = async (req, res, next) => {
    try {
        const user = await svc.editUser(req.params.id, req.body);
        (0, audit_1.audit)({
            action: 'user.update',
            resource: { type: 'user', id: req.params.id },
            success: true,
            traceId: res.locals.requestId,
        });
        return (0, response_1.ok)(res, user);
    }
    catch (e) {
        (0, audit_1.audit)({
            action: 'user.update',
            resource: { type: 'user', id: req.params.id },
            success: false,
            traceId: res.locals.requestId,
            metadata: { error: e.message },
        });
        next(e);
    }
};
exports.update = update;
const remove = async (req, res, next) => {
    try {
        const okResult = await svc.removeUser(req.params.id);
        (0, audit_1.audit)({
            action: 'user.delete',
            resource: { type: 'user', id: req.params.id },
            success: true,
            traceId: res.locals.requestId,
        });
        return (0, response_1.ok)(res, okResult);
    }
    catch (e) {
        (0, audit_1.audit)({
            action: 'user.delete',
            resource: { type: 'user', id: req.params.id },
            success: false,
            traceId: res.locals.requestId,
            metadata: { error: e.message },
        });
        next(e);
    }
};
exports.remove = remove;
