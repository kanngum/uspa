import { config } from 'dotenv';
import { defineConfig } from 'prisma/config';
import path from 'node:path';

config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  schema: 'prisma/schema.prisma',

  migrations: {
    seed: 'tsx prisma/seed/seed.ts',
  },

  datasource: {
    url: process.env.DATABASE_URL,
  },
});