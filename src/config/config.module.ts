import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import appConfig from './app.config';
import databaseConfig from './database.config';
import { validationSchema } from './validation.schema';
const ENV = process.env.NODE_ENV;
@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
      load: [appConfig, databaseConfig],
      validationSchema,
      isGlobal: true,
    }),
  ],
})
export class ConfigModule {}
