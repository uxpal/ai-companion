import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-unused-vars, no-var
  var prisma: PrismaClient | undefined;
}

const prismaDB = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.prisma = prismaDB;

export default prismaDB;
