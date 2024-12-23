import { prisma } from '../lib/prisma'
import { Role, Status } from '@prisma/client'
import bcrypt from 'bcryptjs'

interface CreateUserData {
  email: string
  password: string
  firstName: string
  lastName: string
  mobile?: string
  photo?: string
  role?: Role
  status?: Status
}

interface UpdateUserData {
  email?: string
  firstName?: string
  lastName?: string
  mobile?: string
  photo?: string
  role?: Role
  status?: Status
}

export class UserService {
  async createUser(data: CreateUserData) {
    const hashedPassword = await bcrypt.hash(data.password, 10)
    return prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    })
  }

  async updateUser(id: string, data: UpdateUserData) {
    return prisma.user.update({
      where: { id },
      data,
    })
  }

  async deleteUser(id: string) {
    return prisma.user.delete({
      where: { id },
    })
  }

  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    })
  }

  async findUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    })
  }
} 