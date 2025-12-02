"use client";

import { useEffect, useState } from "react";
import type { FilterType, Todo } from "@/types/todo";

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [isLoaded, setIsLoaded] = useState(false);

  // LocalStorageから読み込み
  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos));
      } catch (error) {
        console.error("Failed to parse todos from localStorage:", error);
      }
    }
    setIsLoaded(true);
  }, []);

  // LocalStorageに保存
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }, [todos, isLoaded]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() === "") return;

    const newTodo: Todo = {
      id: Date.now().toString(),
      text: inputText.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTodos([newTodo, ...todos]);
    setInputText("");
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)),
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const activeCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.filter((todo) => todo.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-block mb-4">
            <div className="text-6xl sm:text-7xl">✅</div>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-3 tracking-tight">
            TODOリスト
          </h1>
          <p className="text-lg sm:text-xl text-purple-200 font-light">
            タスクを管理して生産性を向上
          </p>
        </div>

        {/* 統計情報 */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30">
            <div className="text-3xl font-bold text-white mb-1">{todos.length}</div>
            <div className="text-sm text-purple-200">全タスク</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30">
            <div className="text-3xl font-bold text-yellow-300 mb-1">{activeCount}</div>
            <div className="text-sm text-purple-200">未完了</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30">
            <div className="text-3xl font-bold text-green-300 mb-1">{completedCount}</div>
            <div className="text-sm text-purple-200">完了</div>
          </div>
        </div>

        {/* 入力フォーム */}
        <form onSubmit={addTodo} className="mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="新しいタスクを入力..."
              className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-700 bg-gray-800/50 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none text-white placeholder-gray-400 text-base leading-6 transition-all h-[50px]"
              aria-label="新しいタスクを入力"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="group relative sm:w-auto w-full px-8 py-3 bg-gradient-to-br from-purple-600 via-violet-600 to-purple-700 text-white font-bold rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none h-[50px] shadow-xl hover:shadow-2xl"
              aria-label="タスクを追加"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
              <span className="relative z-10 flex items-center justify-center gap-2.5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="text-base tracking-wide">追加</span>
              </span>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 via-violet-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </div>
        </form>

        {/* フィルターボタン */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === "all"
                ? "bg-white text-purple-900 shadow-lg"
                : "bg-white/20 text-white hover:bg-white/30 border border-white/30"
            }`}
          >
            すべて ({todos.length})
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === "active"
                ? "bg-white text-purple-900 shadow-lg"
                : "bg-white/20 text-white hover:bg-white/30 border border-white/30"
            }`}
          >
            未完了 ({activeCount})
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === "completed"
                ? "bg-white text-purple-900 shadow-lg"
                : "bg-white/20 text-white hover:bg-white/30 border border-white/30"
            }`}
          >
            完了 ({completedCount})
          </button>
          {completedCount > 0 && (
            <button
              onClick={clearCompleted}
              className="ml-auto px-4 py-2 rounded-lg font-medium bg-red-500/80 text-white hover:bg-red-600 transition-all border border-red-400"
            >
              完了済みを削除
            </button>
          )}
        </div>

        {/* TODOリスト */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
          {filteredTodos.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">
                {filter === "completed" ? "🎉" : filter === "active" ? "📝" : "✨"}
              </div>
              <p className="text-xl text-gray-600 font-medium">
                {filter === "completed"
                  ? "完了したタスクはありません"
                  : filter === "active"
                    ? "未完了のタスクはありません"
                    : "タスクを追加してください"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredTodos.map((todo) => (
                <div key={todo.id} className="p-4 hover:bg-purple-50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-purple-500 flex items-center justify-center transition-all hover:scale-110"
                      style={{
                        backgroundColor: todo.completed ? "#a855f7" : "transparent",
                      }}
                      aria-label={todo.completed ? "タスクを未完了にする" : "タスクを完了にする"}
                    >
                      {todo.completed && (
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-lg ${
                          todo.completed ? "line-through text-gray-400" : "text-gray-800"
                        }`}
                      >
                        {todo.text}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(todo.createdAt).toLocaleString("ja-JP", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      aria-label="タスクを削除"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 使い方ガイド */}
        {todos.length === 0 && (
          <div className="mt-6 bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-white border border-white/30">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">💡</span> 使い方
            </h3>
            <div className="space-y-3 text-sm sm:text-base">
              <div className="flex items-start gap-3">
                <span className="text-xl">1️⃣</span>
                <div>
                  <p className="font-semibold mb-1">タスクを追加</p>
                  <p className="text-purple-100">
                    上の入力欄にタスクを入力して「追加」ボタンをクリック
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">2️⃣</span>
                <div>
                  <p className="font-semibold mb-1">タスクを完了</p>
                  <p className="text-purple-100">
                    チェックボックスをクリックして完了/未完了を切り替え
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">3️⃣</span>
                <div>
                  <p className="font-semibold mb-1">フィルター機能</p>
                  <p className="text-purple-100">
                    「すべて」「未完了」「完了」ボタンで表示を切り替え
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/30">
                <p className="text-sm text-purple-100">💾 タスクは自動的にブラウザに保存されます</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
