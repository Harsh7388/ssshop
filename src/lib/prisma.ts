import { PrismaClient } from '@prisma/client';
import path from 'path';

const getDatabaseUrl = () => {
  const envUrl = process.env.DATABASE_URL;
  if (envUrl && !envUrl.startsWith('file:.')) {
    return envUrl;
  }
  // For Netlify Serverless Functions: resolve absolute path to prisma/dev.db
  const dbPath = path.resolve(process.cwd(), 'prisma', 'dev.db');
  return `file:${dbPath}`;
};

const prismaClientSingleton = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
  });
};

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;

