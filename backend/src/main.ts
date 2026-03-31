import { NestFactory } from '@nestjs/core';
import { createServer } from 'node:net';
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
    origin: (origin, callback) => {
      // Allow non-browser requests (e.g. curl)
      if (!origin) return callback(null, true);

      // Always allow local dev origins
      try {
        const parsed = new URL(origin);
        if (
          parsed.hostname === 'localhost' ||
          parsed.hostname === '127.0.0.1'
        ) {
          return callback(null, true);
        }
      } catch {
        // ignore parse errors, fallback to configured origin
      }

      // Allow explicitly configured frontend origin
      if (origin === frontendUrl) {
        return callback(null, true);
      }

      return callback(
        new Error(`Origin '${origin}' not allowed by CORS`),
        false,
      );
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'X-Requested-With',
    ],
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
      const host = req.headers.host ?? '';
      // Don't force HTTPS on local development hosts (prevents ERR_SSL_PROTOCOL_ERROR)
      if (host.includes('localhost') || host.includes('127.0.0.1')) {
        return next();
      }
      if (!req.secure && req.get('x-forwarded-proto') !== 'https') {
        return res.redirect(`https://${req.headers.host}${req.url}`);
      }
      return next();
    });
  }

  const configuredPort = Number(process.env.PORT);
  const initialPort = Number.isFinite(configuredPort) && configuredPort > 0 ? configuredPort : 3000;
  const maxPortRetries = 10;

  const isPortAvailable = (port: number): Promise<boolean> =>
    new Promise((resolve) => {
      const server = createServer();

      server.once('error', () => {
        resolve(false);
      });

      server.once('listening', () => {
        server.close(() => resolve(true));
      });

      server.listen(port);
    });

  for (let attempt = 0; attempt <= maxPortRetries; attempt += 1) {
    const port = initialPort + attempt;

    if (!(await isPortAvailable(port))) {
      continue;
    }

    await app.listen(port);
    if (attempt > 0) {
      // eslint-disable-next-line no-console
      console.warn(`Port ${initialPort} sedang dipakai, server berjalan di port ${port}.`);
    }
    return;
  }

  throw new Error(
    `Tidak menemukan port kosong dalam rentang ${initialPort}-${initialPort + maxPortRetries}.`,
  );
}

void bootstrap();
