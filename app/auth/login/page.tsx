import LoginForm from '@/components/features/auth/LoginForm';
import { prisma } from '@/lib/db';
import { sendEmail, generateMagicLinkEmail } from '@/lib/email';
import { generateUUIDv7 } from '@/lib/uuid';

export default function LoginPage() {
  async function signupAction(formData: FormData) {
    'use server';
    
    const email = formData.get('email') as string;

    if (!email || typeof email !== 'string') {
      return {
        error: 'メールアドレスが必要です',
      };
    }

    try {
      // Check if account already exists
      const existingAccount = await prisma.account.findUnique({
        where: { email },
      });

      if (existingAccount) {
        return {
          error: 'このメールアドレスは既に登録されています',
        };
      }

      // Generate verification token
      const token = generateUUIDv7();

      // Store token temporarily as account record
      await prisma.account.create({
        data: {
          id: token,
          email,
        },
      });

      // Send email
      const emailContent = generateMagicLinkEmail(email, token, 'signup');
      await sendEmail({
        to: email,
        subject: emailContent.subject,
        html: emailContent.html,
      });

      return {
        success: true,
        message: 'サインアップ用のメールを送信しました。メールボックスを確認してください。',
      };
    } catch (error) {
      console.error('Signup error:', error);
      return {
        error: 'サーバーエラーが発生しました',
      };
    }
  }

  async function loginAction(formData: FormData) {
    'use server';
    
    const email = formData.get('email') as string;

    if (!email || typeof email !== 'string') {
      return {
        error: 'メールアドレスが必要です',
      };
    }

    try {
      // Check if account exists
      const account = await prisma.account.findUnique({
        where: { email },
      });

      if (!account) {
        return {
          error: 'このメールアドレスは登録されていません',
        };
      }

      // Generate login token
      const token = generateUUIDv7();
      
      // Create a temporary login record for verification
      await prisma.login.create({
        data: {
          id: generateUUIDv7(), // Separate ID for the record
          token: token, // Use token for verification
          accountId: account.id,
          expiredAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
        },
      });

      // Send email
      const emailContent = generateMagicLinkEmail(email, token, 'login');
      await sendEmail({
        to: email,
        subject: emailContent.subject,
        html: emailContent.html,
      });

      return {
        success: true,
        message: 'ログイン用のメールを送信しました。メールボックスを確認してください。',
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        error: 'サーバーエラーが発生しました',
      };
    }
  }

  return <LoginForm loginAction={loginAction} signupAction={signupAction} />;
}