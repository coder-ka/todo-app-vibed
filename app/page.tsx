import AuthButton from '@/components/features/auth/AuthButton';
import HomeContent from '@/components/features/home/HomeContent';
import AddTodo from '@/components/features/todo/AddTodo';
import TodoList from '@/components/features/todo/TodoList';
import { getCurrentUser, logout as logoutUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { generateUUIDv7 } from '@/lib/uuid';
import { revalidatePath } from 'next/cache';

export default async function Home() {
  const user = await getCurrentUser();
  
  // Get todos for logged in user
  const todos = user ? await prisma.todo.findMany({
    where: { accountId: user.id },
    orderBy: { id: 'desc' },
  }) : [];

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

  async function createTodoAction(formData: FormData) {
    'use server';
    
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return {
        error: 'ログインが必要です',
      };
    }

    const title = formData.get('title') as string;
    const note = formData.get('note') as string;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return {
        error: 'タイトルが必要です',
      };
    }

    try {
      await prisma.todo.create({
        data: {
          id: generateUUIDv7(),
          title: title.trim(),
          note: note || '',
          accountId: currentUser.id,
        },
      });

      revalidatePath('/');
      
      return {
        success: true,
      };
    } catch (error) {
      console.error('Create todo error:', error);
      return {
        error: 'サーバーエラーが発生しました',
      };
    }
  }

  async function deleteTodoAction(id: string) {
    'use server';
    
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return {
        error: 'ログインが必要です',
      };
    }

    try {
      // Verify todo belongs to current user
      const todo = await prisma.todo.findUnique({
        where: { id },
      });

      if (!todo || todo.accountId !== currentUser.id) {
        return {
          error: 'TODO が見つかりません',
        };
      }

      await prisma.todo.delete({
        where: { id },
      });

      revalidatePath('/');
      
      return {
        success: true,
      };
    } catch (error) {
      console.error('Delete todo error:', error);
      return {
        error: 'サーバーエラーが発生しました',
      };
    }
  }

  async function updateTodoAction(id: string, formData: FormData) {
    'use server';
    
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return {
        error: 'ログインが必要です',
      };
    }

    const title = formData.get('title') as string;
    const note = formData.get('note') as string;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return {
        error: 'タイトルが必要です',
      };
    }

    try {
      // Verify todo belongs to current user
      const todo = await prisma.todo.findUnique({
        where: { id },
      });

      if (!todo || todo.accountId !== currentUser.id) {
        return {
          error: 'TODO が見つかりません',
        };
      }

      await prisma.todo.update({
        where: { id },
        data: {
          title: title.trim(),
          note: note || '',
        },
      });

      revalidatePath('/');
      
      return {
        success: true,
      };
    } catch (error) {
      console.error('Update todo error:', error);
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
        {user ? (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                ようこそ
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                {user.email} さん、TODOアプリへようこそ！
              </p>
            </div>
            
            <AddTodo createTodoAction={createTodoAction} />
            
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                あなたのTODO
              </h3>
              <TodoList 
                todos={todos}
                deleteTodoAction={deleteTodoAction}
                updateTodoAction={updateTodoAction}
              />
            </div>
          </div>
        ) : (
          <div className="text-center">
            <HomeContent 
              initialUser={user}
              getCurrentUserAction={getCurrentUserAction}
            />
          </div>
        )}
      </main>
    </div>
  );
}
