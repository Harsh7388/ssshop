import { PrismaClient } from '@prisma/client';
import path from 'path';

import fs from 'fs';

const getDatabaseUrl = () => {
  const envUrl = process.env.DATABASE_URL;
  if (envUrl && !envUrl.startsWith('file:')) {
    return envUrl;
  }

  // Check if running in a Serverless environment (Netlify, AWS Lambda, Vercel)
  const isServerless = Boolean(
    process.env.NETLIFY || 
    process.env.AWS_LAMBDA_FUNCTION_NAME || 
    process.env.LAMBDA_TASK_ROOT ||
    process.env.VERCEL
  );

  if (isServerless) {
    // /var/task is read-only in AWS Lambda/Netlify Functions. /tmp is the only writable directory.
    const tmpDbPath = path.join('/tmp', 'dev.db');

    if (!fs.existsSync(tmpDbPath) || fs.statSync(tmpDbPath).size === 0) {
      const src = path.join(process.cwd(), 'prisma', 'dev.db');
      if (fs.existsSync(src)) {
        try {
          fs.copyFileSync(src, tmpDbPath);
        } catch (e) {
          console.error('Failed to copy database template to /tmp:', e);
        }
      }
    }

    if (fs.existsSync(tmpDbPath)) {
      return `file:${tmpDbPath}`;
    }
  }

  // Local development fallback
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

