import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { UserService } from '../services/user.service'
import { Prisma, Status } from '@prisma/client'

export class UserController {
  private userService = new UserService()

  async getUsers(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const skip = (page - 1) * limit;
    
      // Extract search and filter parameters from the request query
      const { search, status, sortBy, sortOrder } = req.query;

        // Build the where clause for filtering
      const whereClause: Prisma.UserWhereInput = {};
      if (search) {
        whereClause.OR = [
            { email: { contains: String(search), mode: 'insensitive' } },
            { firstName: { contains: String(search), mode: 'insensitive' } },
            { lastName: { contains: String(search), mode: 'insensitive' } },
        ];
      }
      if (status) {
        whereClause.status = status as Status;
      }

      // Determine sorting parameters
    const orderBy: Record<string, 'asc' | 'desc'> = {};
    if (sortBy) {
      orderBy[String(sortBy)] = sortOrder === 'asc' ? 'asc' : 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

      const [users, total, activeCount, pendingCount, inactiveCount] = await Promise.all([
        prisma.user.findMany({
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
        prisma.user.count({ where: whereClause }),
        prisma.user.count({ where: { status: 'ACTIVE' } }),
        prisma.user.count({ where: { status: 'PENDING' } }),
        prisma.user.count({ where: { status: 'INACTIVE' } })
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
    } catch {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getUser(req: Request, res: Response) {
    try {
      const { id } = req.params
      const user = await prisma.user.findUnique({
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
      })
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }
      res.json(user)
    } catch {
      res.status(500).json({ message: 'Failed to fetch user' })
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { email, firstName, lastName, mobile, photo, role, status } = req.body
      const user = await prisma.user.update({
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
      })
      res.json(user)
    } catch {
      res.status(500).json({ message: 'Failed to update user' })
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params
      await prisma.user.delete({
        where: { id },
      })
      res.status(204).send()
    } catch {
      res.status(500).json({ message: 'Failed to delete user' })
    }
  }
} 