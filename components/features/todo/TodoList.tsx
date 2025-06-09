'use client';

import { useState } from 'react';
import EditTodo from './EditTodo';

interface Todo {
  id: string;
  title: string;
  note: string;
  accountId: string;
}

interface TodoListProps {
  todos: Todo[];
  deleteTodoAction: (id: string) => Promise<{ success?: boolean; error?: string }>;
  updateTodoAction: (id: string, formData: FormData) => Promise<{ success?: boolean; error?: string }>;
}

export default function TodoList({ todos, deleteTodoAction, updateTodoAction }: TodoListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  if (todos.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">まだTODOがありません。新しいTODOを作成してみましょう。</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {todos.map((todo) => (
        <div key={todo.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
          {editingId === todo.id ? (
            <EditTodo
              todo={todo}
              updateTodoAction={updateTodoAction}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-2">{todo.title}</h3>
                {todo.note && (
                  <p className="text-gray-600 text-sm whitespace-pre-wrap">{todo.note}</p>
                )}
              </div>
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => setEditingId(todo.id)}
                  className="text-blue-600 hover:text-blue-800 text-sm cursor-pointer"
                >
                  編集
                </button>
                <button
                  onClick={async () => {
                    if (confirm('このTODOを削除しますか？')) {
                      const result = await deleteTodoAction(todo.id);
                      if (result.error) {
                        alert(result.error);
                      }
                    }
                  }}
                  className="text-red-600 hover:text-red-800 text-sm cursor-pointer"
                >
                  削除
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}