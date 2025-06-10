import { cookies } from 'next/headers';
import { prisma } from './db';
import { generateUUIDv7 } from './uuid';
import crypto from 'crypto';

export async function createLoginSession(accountId: string) {
  const loginId = generateUUIDv7();
  const token = crypto.randomBytes(32).toString('hex'); // Generate secure token
  const expiredAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  await prisma.login.create({
    data: {
      id: loginId,
      token,
      accountId,
      expiredAt,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set('authToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });

  return token;
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('authToken')?.value;

  if (!token) {
    return null;
  }

  const login = await prisma.login.findFirst({
    where: {
      token,
      expiredAt: {
        gt: new Date(),
      },
    },
    include: {
      account: true,
    },
  });

  return login?.account || null;
}

export async function logout() {
  const cookieStore = await cookies();
  const token = cookieStore.get('authToken')?.value;

  if (token) {
    await prisma.login.deleteMany({
      where: { token },
    });
  }

  cookieStore.delete('authToken');
}

export async function cleanupExpiredLogins() {
  await prisma.login.deleteMany({
    where: {
      expiredAt: {
        lt: new Date(),
      },
    },
  });
}