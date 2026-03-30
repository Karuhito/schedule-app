import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  // 認証不要なエンドポイントにはトークンを付けない
  const publicPaths = ['/auth/register/', '/auth/login/']
  const isPublic = publicPaths.some((path) => config.url?.includes(path))
  if (token && !isPublic) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api