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
exports.getUsersCursor = exports.removeUser = exports.editUser = exports.addUser = exports.getUser = exports.countUsers = exports.getUsers = void 0;
const AppError_1 = require("@/common/middlewares/AppError");
const repo = __importStar(require("./repository"));
const getUsers = (page, limit) => repo.listUsers(page, limit);
exports.getUsers = getUsers;
const countUsers = () => repo.countUsers();
exports.countUsers = countUsers;
const getUser = async (id) => {
    const user = await repo.getUserById(id);
    if (!user) {
        throw new AppError_1.AppError('User not found', 404);
    }
    return user;
};
exports.getUser = getUser;
const addUser = async (data) => {
    const existing = await repo.getUserByEmail(data.email);
    if (existing) {
        throw new AppError_1.AppError('User with this email already exists', 409);
    }
    return await repo.createUser(data);
};
exports.addUser = addUser;
const editUser = async (id, data) => {
    const existing = await repo.getUserById(id);
    if (!existing) {
        throw new AppError_1.AppError('User not found', 404);
    }
    return await repo.updateUser(id, data);
};
exports.editUser = editUser;
const removeUser = async (id) => {
    const existing = await repo.getUserById(id);
    if (!existing) {
        throw new AppError_1.AppError('User not found', 404);
    }
    return await repo.deleteUser(id);
};
exports.removeUser = removeUser;
const getUsersCursor = (cursor, limit) => repo.listUsersCursor(cursor, limit);
exports.getUsersCursor = getUsersCursor;
