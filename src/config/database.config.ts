import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  name: process.env.DATABASE_NAME, // Changed from 'database' to 'name'
  schema: process.env.DATABASE_SCHEMA,
  synchronize: process.env.DATABASE_SYNCHRONIZE,
  autoLoadEntities: process.env.DATABASE_AUTO_LOAD_ENTITIES,
}));
