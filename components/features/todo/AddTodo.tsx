'use client';

import { useState } from 'react';

interface AddTodoProps {
  createTodoAction: (formData: FormData) => Promise<{ success?: boolean; error?: string }>;
}

export default function AddTodo({ createTodoAction }: AddTodoProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setError(null);
    
    const result = await createTodoAction(formData);
    
    if (result.error) {
      setError(result.error);
    } else {
      // Clear form on success
      const form = document.getElementById('add-todo-form') as HTMLFormElement;
      form?.reset();
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">新しいTODO</h2>
      
      <form id="add-todo-form" action={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            タイトル <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="TODOのタイトルを入力"
          />
        </div>
        
        <div>
          <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
            メモ
          </label>
          <textarea
            id="note"
            name="note"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="詳細なメモを入力（任意）"
          />
        </div>
        
        {error && (
          <div className="text-red-600 text-sm">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
        >
          {isSubmitting ? '作成中...' : 'TODOを作成'}
        </button>
      </form>
    </div>
  );
}