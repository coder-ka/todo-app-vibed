import AuthButton from '@/components/features/auth/AuthButton';
import HomeContent from '@/components/features/home/HomeContent';
import { getCurrentUser, logout as logoutUser } from '@/lib/auth';

export default async function Home() {
  const user = await getCurrentUser();

  async function getCurrentUserAction() {
    'use server';
    
    try {
      const user = await getCurrentUser();
      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  async function logoutAction() {
    'use server';
    
    try {
      await logoutUser();
      return {
        success: true,
        message: 'ログアウトしました',
      };
    } catch (error) {
      console.error('Logout error:', error);
      return {
        error: 'サーバーエラーが発生しました',
      };
    }
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">
              TODO アプリ
            </h1>
            <AuthButton 
              getCurrentUserAction={getCurrentUserAction}
              logoutAction={logoutAction}
            />
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <HomeContent 
            initialUser={user}
            getCurrentUserAction={getCurrentUserAction}
          />
        </div>
      </main>
    </div>
  );
}
