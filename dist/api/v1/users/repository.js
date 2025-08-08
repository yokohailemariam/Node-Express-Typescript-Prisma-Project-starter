"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsers = listUsers;
exports.getUserById = getUserById;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.getUserByEmail = getUserByEmail;
exports.countUsers = countUsers;
exports.listUsersCursor = listUsersCursor;
const prisma_1 = require("@/infra/db/prisma");
async function listUsers(page = 1, limit = 20) {
    const take = Math.max(1, Math.min(limit, 100));
    const skip = (Math.max(1, page) - 1) * take;
    return prisma_1.prisma.user.findMany({ skip, take, orderBy: { createdAt: 'desc' } });
}
async function getUserById(id) {
    return prisma_1.prisma.user.findUnique({ where: { id } });
}
async function createUser(input) {
    return prisma_1.prisma.user.create({ data: input });
}
async function updateUser(id, input) {
    return prisma_1.prisma.user.update({ where: { id }, data: input });
}
async function deleteUser(id) {
    await prisma_1.prisma.user.delete({ where: { id } });
    return true;
}
async function getUserByEmail(email) {
    return prisma_1.prisma.user.findUnique({ where: { email } });
}
async function countUsers() {
    return prisma_1.prisma.user.count();
}
async function listUsersCursor(cursor, limit = 10) {
    const take = Math.max(1, Math.min(limit, 100));
    if (cursor) {
        return prisma_1.prisma.user.findMany({
            take,
            skip: 1,
            cursor: { id: cursor },
            orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        });
    }
    return prisma_1.prisma.user.findMany({
        take,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    });
}
