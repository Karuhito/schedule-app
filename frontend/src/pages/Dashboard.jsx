import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow text-center">
        <h1 className="text-2xl font-semibold mb-2">ダッシュボード</h1>
        <p className="text-gray-500 mb-6">ようこそ、{user?.username} さん</p>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition"
        >
          ログアウト
        </button>
      </div>
    </div>
  )
}