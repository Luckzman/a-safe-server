"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const prisma_1 = require("../lib/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UserService {
    async createUser(data) {
        const hashedPassword = await bcryptjs_1.default.hash(data.password, 10);
        return prisma_1.prisma.user.create({
            data: {
                ...data,
                password: hashedPassword,
            },
        });
    }
    async updateUser(id, data) {
        return prisma_1.prisma.user.update({
            where: { id },
            data,
        });
    }
    async deleteUser(id) {
        return prisma_1.prisma.user.delete({
            where: { id },
        });
    }
    async findUserByEmail(email) {
        return prisma_1.prisma.user.findUnique({
            where: { email },
        });
    }
    async findUserById(id) {
        return prisma_1.prisma.user.findUnique({
            where: { id },
        });
    }
}
exports.UserService = UserService;
