import { BadRequestException, UnauthorizedException } from '@nestjs/common';

export type AuthUser = {
  id_user: number;
  email: string;
  role: string;
};

export function signToken(user: AuthUser): string {
  return Buffer.from(JSON.stringify(user)).toString('base64url');
}

export function parseToken(header?: string): AuthUser {
  if (!header?.startsWith('Bearer ')) {
    throw new UnauthorizedException('Token tidak ditemukan.');
  }

  try {
    const raw = header.slice(7);
    const parsed = JSON.parse(Buffer.from(raw, 'base64url').toString('utf8')) as AuthUser;
    if (!parsed?.id_user || !parsed?.email || !parsed?.role) {
      throw new Error('invalid payload');
    }
    return parsed;
  } catch {
    throw new UnauthorizedException('Token tidak valid.');
  }
}

export function parseOptionalDate(value?: string | null): Date | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new BadRequestException('Format tanggal tidak valid.');
  }
  return date;
}
