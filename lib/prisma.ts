import { PrismaClient } from "@prisma/client";

const prislaClientSingleton = () => {
  return new PrismaClient();
};

type prislaClientSingleton = ReturnType<typeof prislaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? prislaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
