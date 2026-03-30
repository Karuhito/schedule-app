import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getTasks, createTask, updateTask, deleteTask } from "../api/tasks";

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
      setForm({ title: "", category: "work", due_date: "", start_time: "", end_time: "" });
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
                onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                />
                <span className="text-xs text-gray-400">〜</span>
                <input
                type="time"
                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form.end_time}
                onChange={(e) => setForm({ ...form, end_time: e.target.value })}
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
