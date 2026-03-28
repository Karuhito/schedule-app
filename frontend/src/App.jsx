import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [status, setStatus] = useState('確認中...')

  useEffect(() => {
    axios.get('http://localhost:8000/api/health/')
      .then(res => setStatus(res.data.status))
      .catch(() => setStatus('接続失敗'))
  }, [])

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-2xl">バックエンド: {status}</p>
    </div>
  )
}

export default App
