import { PrismaClient } from '@prisma/client'

declare global {
  // allow global `var` for hot reload in dev
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') global.prisma = prisma

export default prisma

// Helper function to handle database connections
export const connectDB = async () => {
  try {
    await prisma.$connect()
    console.log('✅ Database connected successfully')
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    process.exit(1)
  }
}

// Helper function to disconnect
export const disconnectDB = async () => {
  await prisma.$disconnect()
}
