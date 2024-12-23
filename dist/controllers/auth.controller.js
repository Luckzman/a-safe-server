"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const prisma_1 = require("../lib/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthController {
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await prisma_1.prisma.user.findFirst({
                where: {
                    email: {
                        equals: email.toLowerCase(),
                        mode: 'insensitive'
                    }
                }
            });
            if (!user || !user.password) {
                return res.status(401).json({ message: 'User does not exist' });
            }
            const isValidPassword = await bcryptjs_1.default.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            // Generate JWT token
            const token = jsonwebtoken_1.default.sign({
                id: user.id,
                email: user.email,
                role: user.role,
                name: `${user.firstName} ${user.lastName}`
            }, process.env.JWT_SECRET, { expiresIn: '24h' });
            // Don't send password in response
            const { password: _, ...userWithoutPassword } = user;
            return res.json({
                ...userWithoutPassword,
                name: `${user.firstName} ${user.lastName}`,
                token
            });
        }
        catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async register(req, res) {
        try {
            const { email, password, firstName, lastName } = req.body;
            // Check for existing user case-insensitively
            const existingUser = await prisma_1.prisma.user.findFirst({
                where: {
                    email: {
                        equals: email.toLowerCase(),
                        mode: 'insensitive'
                    }
                }
            });
            if (existingUser) {
                return res.status(400).json({ message: 'Email already in use' });
            }
            const user = await prisma_1.prisma.user.create({
                data: {
                    email: email.toLowerCase(), // Store email in lowercase
                    password: await bcryptjs_1.default.hash(password, 10),
                    firstName,
                    lastName,
                    role: 'USER',
                    status: 'PENDING'
                }
            });
            // Generate JWT token for new user
            const token = jsonwebtoken_1.default.sign({
                id: user.id,
                email: user.email,
                role: user.role,
                name: `${user.firstName} ${user.lastName}`
            }, process.env.JWT_SECRET, { expiresIn: '24h' });
            const { password: _, ...userWithoutPassword } = user;
            return res.status(201).json({
                ...userWithoutPassword,
                token
            });
        }
        catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async logout(req, res) {
        try {
            // Handle any server-side cleanup if needed
            return res.status(200).json({ message: 'Logged out successfully' });
        }
        catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}
exports.AuthController = AuthController;
