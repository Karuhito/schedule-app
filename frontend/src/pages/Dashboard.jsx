import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  analyzePriorities,
  applyPriorities,
} from "../api/tasks";

const CATEGORIES = [
  { value: "work", label: "仕事・タスク" },
  { value: "private", label: "プライベート" },
  { value: "health", label: "健康・運動" },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    category: "work",
    due_date: "",
    start_time: "",
    end_time: "",
  });
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await getTasks();
    setTasks(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setLoading(true);
    try {
      await createTask({
        title: form.title,
        category: form.category,
        due_date: form.due_date || null,
        start_time: form.start_time || null,
        end_time: form.end_time || null,
      });
      setForm({
        title: "",
        category: "work",
        due_date: "",
        start_time: "",
        end_time: "",
      });
      await fetchTasks();
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = async (task) => {
    await updateTask(task.id, { is_completed: !task.is_completed });
    await fetchTasks();
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    await fetchTasks();
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleAnalyze = async () => {
    setAiLoading(true);
    setAiResult(null);
    try {
      const res = await analyzePriorities();
      setAiResult(res.data);
    } catch (err) {
      alert("AI分析に失敗しました。タスクが登録されているか確認してください。");
    } finally {
      setAiLoading(false);
    }
  };

  const handleApply = async () => {
    if (!aiResult) return;
    await applyPriorities({ prioritized_tasks: aiResult.prioritized_tasks });
    setAiResult(null);
    await fetchTasks();
  };

  const groupedTasks = CATEGORIES.map((cat) => ({
    ...cat,
    tasks: tasks.filter((t) => t.category === cat.value),
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold">スケジュールアプリ</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{user?.username}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-red-500 hover:underline"
          >
            ログアウト
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* AI優先順位提案 */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-base font-semibold">AI優先順位提案</h2>
              <p className="text-xs text-gray-400 mt-1">
                登録済みのタスクをAIが分析して優先順位を提案します
              </p>
            </div>
            <button
              onClick={handleAnalyze}
              disabled={aiLoading}
              className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-600 transition disabled:opacity-50"
            >
              {aiLoading ? "分析中..." : "AIに提案してもらう"}
            </button>
          </div>

          {aiResult && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-4 bg-purple-50 rounded-lg px-4 py-3">
                {aiResult.summary}
              </p>
              <div className="space-y-2 mb-4">
                {aiResult.prioritized_tasks.map((item) => {
                  const task = tasks.find((t) => t.id === item.id);
                  if (!task) return null;
                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3"
                    >
                      <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {item.priority}
                      </span>
                      <span className="flex-1 text-sm text-gray-700">
                        {task.title}
                      </span>
                      <span className="text-xs text-gray-400">
                        {item.reason}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setAiResult(null)}
                  className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition"
                >
                  却下
                </button>
                <button
                  onClick={handleApply}
                  className="px-4 py-2 bg-purple-500 text-white text-sm rounded-lg hover:bg-purple-600 transition"
                >
                  この順番で適用する
                </button>
              </div>
            </div>
          )}
        </div>
        {/* タスク入力フォーム */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-base font-semibold mb-4">タスクを追加</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="タスクを入力..."
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <div className="flex gap-3">
              <select
                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              <input
                type="date"
                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form.due_date}
                onChange={(e) => setForm({ ...form, due_date: e.target.value })}
              />
              {/* 時刻入力（任意） */}
              {form.due_date && (
                <div className="flex gap-2 items-center">
                  <span className="text-xs text-gray-400">時刻（任意）</span>
                  <input
                    type="time"
                    className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={form.start_time}
                    onChange={(e) =>
                      setForm({ ...form, start_time: e.target.value })
                    }
                  />
                  <span className="text-xs text-gray-400">〜</span>
                  <input
                    type="time"
                    className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={form.end_time}
                    onChange={(e) =>
                      setForm({ ...form, end_time: e.target.value })
                    }
                  />
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="ml-auto bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition disabled:opacity-50"
              >
                追加
              </button>
            </div>
          </form>
        </div>

        {/* タスク一覧 */}
        {groupedTasks.map((group) => (
          <div key={group.value} className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              {group.label}
            </h3>
            {group.tasks.length === 0 ? (
              <p className="text-sm text-gray-300 pl-1">タスクはありません</p>
            ) : (
              <div className="space-y-2">
                {group.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white rounded-lg shadow-sm px-4 py-3 flex items-center gap-3"
                  >
                    <input
                      type="checkbox"
                      checked={task.is_completed}
                      onChange={() => toggleComplete(task)}
                      className="w-4 h-4 accent-blue-500"
                    />
                    <span
                      className={`flex-1 text-sm ${
                        task.is_completed
                          ? "line-through text-gray-400"
                          : "text-gray-700"
                      }`}
                    >
                      {task.title}
                    </span>
                    {task.due_date && (
                      <span className="text-xs text-gray-400">
                        {task.due_date}
                        {task.start_time && ` ${task.start_time.slice(0, 5)}`}
                        {task.end_time && `〜${task.end_time.slice(0, 5)}`}
                      </span>
                    )}
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="text-gray-300 hover:text-red-400 text-sm transition"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </main>
    </div>
  );
}
