import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Logger, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { loadEnv } from './config/env';

async function bootstrap(): Promise<void> {
  const env = loadEnv();
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  app.enableCors({
    origin: env.CORS_ORIGIN.split(',').map((s) => s.trim()),
    credentials: true,
  });

  app.useGlobalFilters(new AllExceptionsFilter());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Buscou Viajou — API')
    .setDescription(
      'API REST do marketplace de fretamento. Autenticação via Supabase JWT (ES256, validação por JWKS).',
    )
    .setVersion('0.1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .addServer(`http://localhost:${env.PORT}`, 'Local')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  await app.listen(env.PORT);
  Logger.log(`🚌 Buscou Viajou API rodando em http://localhost:${env.PORT}`, 'Bootstrap');
  Logger.log(`📖 Swagger em http://localhost:${env.PORT}/docs`, 'Bootstrap');
}

bootstrap().catch((err) => {
  Logger.error('Failed to bootstrap', err);
  process.exit(1);
});
