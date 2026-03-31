export function validateEnvironmentVariables(): void {
  const requiredVars = ['DATABASE_URL', 'JWT_SECRET', 'FRONTEND_URL', 'PORT'];
  const missing = requiredVars.filter((v) => !process.env[v]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  const nodeEnv = process.env.NODE_ENV?.trim() || 'development';
  const allowed = ['development', 'production', 'test'];
  if (!allowed.includes(nodeEnv.toLowerCase())) {
    throw new Error(`NODE_ENV must be one of ${allowed.join(', ')}`);
  }
  process.env.NODE_ENV = nodeEnv;

  if (!/^https?:\/\/.+$/i.test(process.env.FRONTEND_URL!)) {
    throw new Error('FRONTEND_URL must be a valid URL with protocol http/https.');
  }

  if (!Number.isFinite(Number(process.env.BCRYPT_ROUNDS || '0')) || Number(process.env.BCRYPT_ROUNDS) < 8) {
    throw new Error('BCRYPT_ROUNDS must be a number >= 8');
  }

  if (!Number.isFinite(Number(process.env.PORT || ''))) {
    throw new Error('PORT must be a valid number');
  }
}
