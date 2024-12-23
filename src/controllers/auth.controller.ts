/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body

      const user = await prisma.user.findFirst({
        where: { 
          email: { 
            equals: email.toLowerCase(),
            mode: 'insensitive'
          }
        }
      })

      if (!user || !user.password) {
        return res.status(401).json({ message: 'User does not exist' })
      }

      const isValidPassword = await bcrypt.compare(password, user.password)

      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' })
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: user.id,
          email: user.email,
          role: user.role,
          name: `${user.firstName} ${user.lastName}`
        },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      )

      // Don't send password in response
      const { password: _, ...userWithoutPassword } = user

      return res.json({
        ...userWithoutPassword,
        name: `${user.firstName} ${user.lastName}`,
        token
      })
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  async register(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName } = req.body

      // Check for existing user case-insensitively
      const existingUser = await prisma.user.findFirst({
        where: { 
          email: { 
            equals: email.toLowerCase(),
            mode: 'insensitive'
          }
        }
      })

      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' })
      }

      const user = await prisma.user.create({
        data: {
          email: email.toLowerCase(), // Store email in lowercase
          password: await bcrypt.hash(password, 10),
          firstName,
          lastName,
          role: 'USER',
          status: 'PENDING'
        }
      })

      // Generate JWT token for new user
      const token = jwt.sign(
        { 
          id: user.id,
          email: user.email,
          role: user.role,
          name: `${user.firstName} ${user.lastName}`
        },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      )

      const { password: _, ...userWithoutPassword } = user

      return res.status(201).json({
        ...userWithoutPassword,
        token
      })
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  async logout(req: Request, res: Response) {
    try {
      // Handle any server-side cleanup if needed
      return res.status(200).json({ message: 'Logged out successfully' })
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
} 