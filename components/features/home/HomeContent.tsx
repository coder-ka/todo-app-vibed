'use client';

import { useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
}

interface HomeContentProps {
  initialUser?: User | null;
  getCurrentUserAction?: () => Promise<User | null>;
}

export default function HomeContent({ initialUser, getCurrentUserAction }: HomeContentProps) {
  const [user, setUser] = useState<User | null>(initialUser || null);
  const [loading, setLoading] = useState(!initialUser);

  useEffect(() => {
    if (!initialUser && getCurrentUserAction) {
      checkAuth();
    }
  }, [initialUser, getCurrentUserAction]);

  const checkAuth = async () => {
    if (!getCurrentUserAction) return;
    
    try {
      const userData = await getCurrentUserAction();
      setUser(userData);
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-48 mx-auto mb-8"></div>
        </div>
      </div>
    );
  }

  if (user) {
    // Logged in user content
    return (
      <>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          ようこそ
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          {user.email} さん、TODOアプリへようこそ！
        </p>
        
        <div className="max-w-4xl mx-auto">
          <div id="todo-app-container">
            {/* TODO functionality will be inserted here */}
          </div>
        </div>
      </>
    );
  }

  // Not logged in content
  return (
    <>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        TODOアプリへようこそ
      </h2>
      <p className="text-lg text-gray-600 mb-8">
        タスクを効率的に管理しましょう
      </p>
      
      <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          開始するには
        </h3>
        <p className="text-gray-600 mb-4">
          ログインまたはサインアップしてください
        </p>
        <a
          href="/auth/login"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors inline-block cursor-pointer"
        >
          ログイン
        </a>
      </div>
    </>
  );
}