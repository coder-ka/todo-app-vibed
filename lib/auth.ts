import { cookies } from 'next/headers';
import { prisma } from './db';
import { generateUUIDv7 } from './uuid';

export async function createLoginSession(accountId: string) {
  const loginId = generateUUIDv7();
  const expiredAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  await prisma.login.create({
    data: {
      id: loginId,
      accountId,
      expiredAt,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set('loginId', loginId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });

  return loginId;
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const loginId = cookieStore.get('loginId')?.value;

  if (!loginId) {
    return null;
  }

  const login = await prisma.login.findFirst({
    where: {
      id: loginId,
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
  const loginId = cookieStore.get('loginId')?.value;

  if (loginId) {
    await prisma.login.delete({
      where: { id: loginId },
    });
  }

  cookieStore.delete('loginId');
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