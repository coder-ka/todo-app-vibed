import { Suspense } from 'react';
import VerificationForm from '@/components/features/auth/VerificationForm';
import { prisma } from '@/lib/db';
import { generateUUIDv7 } from '@/lib/uuid';
import { createLoginSession } from '@/lib/auth';

export default function VerifyPage() {
  async function verifyAction(token: string, email: string, type: string) {
    'use server';
    
    if (!token || !email || !type) {
      return {
        error: '必要なパラメータが不足しています',
      };
    }

    // Normalize the type parameter
    const normalizedType = type?.trim().toLowerCase();

    try {
      if (normalizedType === 'signup') {
        // For signup, the token is the temporary account ID
        const tempAccount = await prisma.account.findUnique({
          where: { id: token, email },
        });

        if (!tempAccount) {
          return {
            error: '無効なトークンまたは期限切れです',
          };
        }

        // Create a proper account with new ID
        const newAccountId = generateUUIDv7();
        
        // Delete the temporary account and create a new one
        await prisma.account.delete({ where: { id: token } });
        const account = await prisma.account.create({
          data: {
            id: newAccountId,
            email,
          },
        });

        // Create login session
        await createLoginSession(account.id);

        return {
          success: true,
          message: 'サインアップが完了しました',
        };
      } else if (normalizedType === 'login') {
        // For login, find the temporary login record
        console.log('Looking for login with token:', token);
        console.log('Expected email:', email);
        
        const tempLogin = await prisma.login.findFirst({
          where: {
            token: token,
            expiredAt: {
              gt: new Date(),
            },
          },
          include: {
            account: true,
          },
        });

        console.log('Found tempLogin:', tempLogin);

        if (!tempLogin) {
          console.log('No login record found with token:', token);
          return {
            error: '無効なトークンまたは期限切れです',
          };
        }

        if (tempLogin.account.email !== email) {
          console.log('Email mismatch. Expected:', email, 'Found:', tempLogin.account.email);
          return {
            error: '無効なトークンまたは期限切れです',
          };
        }

        // Delete the temporary login record
        await prisma.login.delete({ where: { id: tempLogin.id } });

        // Create a new login session
        await createLoginSession(tempLogin.account.id);

        return {
          success: true,
          message: 'ログインが完了しました',
        };
      } else {
        console.log('Invalid authentication type:', { originalType: type, normalizedType, typeOfOriginal: typeof type });
        return {
          error: `無効な認証タイプです: ${type} (normalized: ${normalizedType})`,
        };
      }
    } catch (error) {
      console.error('Verification error:', error);
      return {
        error: 'サーバーエラーが発生しました',
      };
    }
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <VerificationForm verifyAction={verifyAction} />
    </Suspense>
  );
}