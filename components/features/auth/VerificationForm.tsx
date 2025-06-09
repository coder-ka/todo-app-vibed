'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface VerificationFormProps {
  verifyAction: (token: string, email: string, type: string) => Promise<{ success?: boolean; message?: string; error?: string }>;
}

export default function VerificationForm({ verifyAction }: VerificationFormProps) {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('認証中...');
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const verify = async () => {
      const token = searchParams.get('token');
      const email = searchParams.get('email');
      const type = searchParams.get('type');

      if (!token || !email || !type) {
        setStatus('error');
        setMessage('無効なリンクです');
        return;
      }

      try {
        const result = await verifyAction(token, email, type);
        
        if (result?.error) {
          setStatus('error');
          setMessage(result.error);
        } else if (result?.success) {
          setStatus('success');
          setMessage(result.message || '認証が完了しました');
          
          // Redirect to home page
          setTimeout(() => {
            router.push('/');
          }, 2000);
        } else {
          setStatus('error');
          setMessage('予期しないエラーが発生しました');
        }
      } catch (error) {
        // If redirect happened, this will throw but that's expected
        if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
          return; // Redirect successful
        }
        setStatus('error');
        setMessage('ネットワークエラーが発生しました');
      }
    };

    verify();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 text-center">
        {status === 'verifying' && (
          <div>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">認証中</h2>
            <p className="text-gray-600">{message}</p>
          </div>
        )}
        
        {status === 'success' && (
          <div>
            <div className="rounded-full h-12 w-12 bg-green-100 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">認証成功</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <p className="text-sm text-gray-500">アプリに移動しています...</p>
          </div>
        )}
        
        {status === 'error' && (
          <div>
            <div className="rounded-full h-12 w-12 bg-red-100 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">認証エラー</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <button
              onClick={() => router.push('/auth/login')}
              className="text-blue-600 hover:text-blue-500"
            >
              ログインページに戻る
            </button>
          </div>
        )}
      </div>
    </div>
  );
}