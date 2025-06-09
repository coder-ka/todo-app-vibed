'use client';

import { useState } from 'react';

interface Todo {
  id: string;
  title: string;
  note: string;
  accountId: string;
}

interface EditTodoProps {
  todo: Todo;
  updateTodoAction: (id: string, formData: FormData) => Promise<{ success?: boolean; error?: string }>;
  onCancel: () => void;
}

export default function EditTodo({ todo, updateTodoAction, onCancel }: EditTodoProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setError(null);
    
    const result = await updateTodoAction(todo.id, formData);
    
    if (result.error) {
      setError(result.error);
    } else {
      onCancel(); // Close edit mode on success
    }
    
    setIsSubmitting(false);
  };

  return (
    <form action={handleSubmit} className="space-y-3">
      <div>
        <input
          type="text"
          name="title"
          defaultValue={todo.title}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="TODOのタイトル"
        />
      </div>
      
      <div>
        <textarea
          name="note"
          defaultValue={todo.note}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="詳細なメモ（任意）"
        />
      </div>
      
      {error && (
        <div className="text-red-600 text-sm">
          {error}
        </div>
      )}
      
      <div className="flex space-x-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-3 py-1 rounded text-sm font-medium transition-colors cursor-pointer"
        >
          {isSubmitting ? '保存中...' : '保存'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-3 py-1 rounded text-sm font-medium transition-colors cursor-pointer"
        >
          キャンセル
        </button>
      </div>
    </form>
  );
}