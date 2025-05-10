import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { DocumentBuilder } from '@nestjs/swagger';
import { SensitiveDataInterceptor } from './common/interceptors/sensitive-data.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Áp dụng SensitiveDataInterceptor cho toàn bộ ứng dụng
  app.useGlobalInterceptors(new SensitiveDataInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Loại bỏ các thuộc tính không được định nghĩa trong DTO
      forbidNonWhitelisted: true, // Báo lỗi nếu có thuộc tính không được khai báo trong DTO
      transform: true, // Tự động chuyển đổi kiểu dữ liệu
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('VietLegal API')
    .setDescription('API Documentation for VietLegal Assistant Platform')
    .setTermsOfService('http://localhost:3001/terms-of-service')
    .setLicense(
      'MIT License',
      'https://github.com/git/git-scm.com/blob/main/MIT-LICENSE.txt',
    )
    .addServer('http://localhost:2410')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      },
      'access-token',
    )
    .build();

  // Instantiate Document
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: '*', // Cho phép tất cả các nguồn
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 2410);
}
bootstrap();
