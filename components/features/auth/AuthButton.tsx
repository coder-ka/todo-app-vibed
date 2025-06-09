'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
}

interface AuthButtonProps {
  getCurrentUserAction: () => Promise<User | null>;
  logoutAction: () => Promise<{ success?: boolean; error?: string }>;
}

export default function AuthButton({ getCurrentUserAction, logoutAction }: AuthButtonProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userData = await getCurrentUserAction();
      setUser(userData);
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const result = await logoutAction();
      if (result?.success) {
        setUser(null);
        setShowMenu(false);
        router.push('/auth/login');
      } else {
        console.error('Logout failed:', result?.error);
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
    );
  }

  if (!user) {
    return (
      <button
        onClick={() => router.push('/auth/login')}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
      >
        ログイン
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
      >
        {user.email.charAt(0).toUpperCase()}
      </button>
      
      {showMenu && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-10 border">
          <div className="px-4 py-2 text-sm text-gray-700 border-b truncate">
            {user.email}
          </div>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            ログアウト
          </button>
        </div>
      )}
    </div>
  );
}