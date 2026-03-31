import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalValidationPipe } from './common/validation.pipe';
import { securityHeadersMiddleware } from './common/security.middleware';
import { rateLimitMiddleware } from './common/rate-limit.middleware';
import { validateEnvironmentVariables } from './common/env.validation';

async function bootstrap() {
  validateEnvironmentVariables();

  const app = await NestFactory.create(AppModule);

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const isProd = process.env.NODE_ENV === 'production';

  app.enableCors({
    origin: frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
  });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new GlobalValidationPipe());

  app.use(securityHeadersMiddleware);
  app.use(rateLimitMiddleware);

  if (isProd) {
    const server = app.getHttpAdapter().getInstance();
    if (server && typeof server.set === 'function') {
      server.set('trust proxy', 1);
    }

    app.use((req, res, next) => {
      if (!req.secure && req.get('x-forwarded-proto') !== 'https') {
        return res.redirect(`https://${req.headers.host}${req.url}`);
      }
      return next();
    });
  }

  await app.listen(Number(process.env.PORT));
}

void bootstrap();
