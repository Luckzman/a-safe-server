"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const prisma_1 = require("../lib/prisma");
const user_service_1 = require("../services/user.service");
class UserController {
    constructor() {
        this.userService = new user_service_1.UserService();
    }
    async getUsers(req, res) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            // Extract search and filter parameters from the request query
            const { search, status, sortBy, sortOrder } = req.query;
            // Build the where clause for filtering
            const whereClause = {};
            if (search) {
                whereClause.OR = [
                    { email: { contains: String(search), mode: 'insensitive' } },
                    { firstName: { contains: String(search), mode: 'insensitive' } },
                    { lastName: { contains: String(search), mode: 'insensitive' } },
                ];
            }
            if (status) {
                whereClause.status = status;
            }
            // Determine sorting parameters
            const orderBy = {};
            if (sortBy) {
                orderBy[String(sortBy)] = sortOrder === 'asc' ? 'asc' : 'desc';
            }
            else {
                orderBy.createdAt = 'desc';
            }
            const [users, total, activeCount, pendingCount, inactiveCount] = await Promise.all([
                prisma_1.prisma.user.findMany({
                    where: whereClause,
                    skip,
                    take: limit,
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        role: true,
                        status: true,
                        mobile: true,
                        photo: true,
                    },
                    orderBy,
                }),
                prisma_1.prisma.user.count({ where: whereClause }),
                prisma_1.prisma.user.count({ where: { status: 'ACTIVE' } }),
                prisma_1.prisma.user.count({ where: { status: 'PENDING' } }),
                prisma_1.prisma.user.count({ where: { status: 'INACTIVE' } })
            ]);
            return res.json({
                users,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                },
                counts: {
                    activeCount,
                    pendingCount,
                    inactiveCount
                }
            });
        }
        catch {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async getUser(req, res) {
        try {
            const { id } = req.params;
            const user = await prisma_1.prisma.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    mobile: true,
                    photo: true,
                    role: true,
                    status: true,
                    createdAt: true,
                },
            });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        }
        catch {
            res.status(500).json({ message: 'Failed to fetch user' });
        }
    }
    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const { email, firstName, lastName, mobile, photo, role, status } = req.body;
            const user = await prisma_1.prisma.user.update({
                where: { id },
                data: {
                    email,
                    firstName,
                    lastName,
                    mobile,
                    photo,
                    role,
                    status,
                },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    mobile: true,
                    photo: true,
                    role: true,
                    status: true,
                    createdAt: true,
                },
            });
            res.json(user);
        }
        catch {
            res.status(500).json({ message: 'Failed to update user' });
        }
    }
    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            await prisma_1.prisma.user.delete({
                where: { id },
            });
            res.status(204).send();
        }
        catch {
            res.status(500).json({ message: 'Failed to delete user' });
        }
    }
}
exports.UserController = UserController;
