import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

async function main() {
  // Clear existing users
  await prisma.user.deleteMany({})

  // Create admin user
  await prisma.user.create({
    data: {
      email: 'luckyomokarho@example.com',
      password: await bcrypt.hash('Test@123', 10),
      firstName: 'Lucky',
      lastName: 'Oniovosa',
      mobile: '+2348133333333',
      role: 'ADMIN',
      status: 'ACTIVE',
      photo: '/placeholder-avatar.png',
    },
  })

  // Create 100 random users
  const users = Array.from({ length: 50 }).map(() => ({
    email: faker.internet.email().toLowerCase(),
    password: bcrypt.hashSync('password123', 10),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    mobile: faker.phone.number({ style: 'international', length: 11 }),
    role: faker.helpers.arrayElement(['USER', 'ADMIN']),
    status: faker.helpers.arrayElement(['ACTIVE', 'PENDING', 'INACTIVE']),
    photo: '/placeholder-avatar.png',
  }))

  await prisma.user.createMany({
    data: users,
  })

  console.log('Seeded database with 101 users')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 