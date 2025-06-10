'use client';

import { useState } from 'react';

interface LoginFormProps {
  loginAction: (formData: FormData) => Promise<{ success?: boolean; message?: string; error?: string }>;
  signupAction: (formData: FormData) => Promise<{ success?: boolean; message?: string; error?: string }>;
}

export default function LoginForm({ loginAction, signupAction }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (type: 'login' | 'signup') => {
    if (!email) return;
    
    setIsLoading(true);
    setMessage('');
    setIsError(false);

    const formData = new FormData();
    formData.append('email', email);

    try {
      const result = type === 'login' ? await loginAction(formData) : await signupAction(formData);
      
      if (result.success) {
        setIsSubmitted(true);
        setMessage(result.message || '');
      } else {
        setIsError(true);
        setMessage(result.error || 'エラーが発生しました');
      }
    } catch (error) {
      setIsError(true);
      setMessage('ネットワークエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              メールを送信しました
            </h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <p className="text-sm text-gray-500">
              メールボックスを確認し、リンクをクリックして認証を完了してください。
            </p>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setMessage('');
                setEmail('');
              }}
              className="mt-4 text-blue-600 hover:text-blue-500 text-sm cursor-pointer"
            >
              別のメールアドレスで試す
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            ログイン / サインアップ
          </h2>
          <p className="text-gray-600">
            メールアドレスを入力してください
          </p>
        </div>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              メールアドレス
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="your-email@example.com"
            />
          </div>

          {message && (
            <div className={`text-sm text-center ${isError ? 'text-red-600' : 'text-green-600'}`}>
              {message}
            </div>
          )}

          <div className="space-y-3">
            <button
              type="button"
              disabled={isLoading || !email}
              onClick={() => handleSubmit('login')}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? '送信中...' : 'ログイン'}
            </button>
            
            <button
              type="button"
              disabled={isLoading || !email}
              onClick={() => handleSubmit('signup')}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? '送信中...' : 'サインアップ'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}