import { PrismaClient } from "@/generated/prisma/client";

// For global singleton
const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const prismaOptions: any = {
  log: process.env.NODE_ENV === "development" 
    ? ['error', 'warn']
    : ['error'],
};

// Create or reuse Prisma client instance
const prisma = globalForPrisma.prisma || new PrismaClient(prismaOptions);

// Save instance in development to prevent multiple connections
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;