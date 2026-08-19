import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const isProduction = configService.get<string>('NODE_ENV') === 'production';

  // Security headers - relaxed in production for Swagger
  app.use(
    helmet({
      contentSecurityPolicy: isProduction ? false : undefined,
      crossOriginEmbedderPolicy: false,
    }),
  );

  // CORS - support multiple origins
  const corsOrigin = configService.get<string>('app.corsOrigin') || 'http://localhost:3000';
  const origins = corsOrigin.split(',').map((o) => o.trim());

  app.enableCors({
    origin: origins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type,Authorization,Accept',
  });

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger docs (available in all environments)
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Decentralized Learning Platform API')
    .setDescription('API for the DLearn Decentralized Learning Platform')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Authentication', 'User registration, login, and token management')
    .addTag('Courses', 'Course CRUD and discovery')
    .addTag('Enrollments', 'Student enrollment and progress tracking')
    .addTag('Certificates', 'Blockchain certificate issuance and verification')
    .addTag('Payments', 'Stellar-based payment processing')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  // Health check endpoint
  app.getHttpAdapter().get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  const port = configService.get<number>('app.port') || 8001;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
  console.log(`❤️  Health check: http://localhost:${port}/health`);
}
bootstrap();
