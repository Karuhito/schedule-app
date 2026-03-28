import { createContext, useContext, useState } from 'react'
import api from '../api/axios'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user')) || null
  )

  const register = async (email, username, password) => {
    const res = await api.post('/auth/register/', { email, username, password })
    localStorage.setItem('access_token', res.data.access)
    localStorage.setItem('refresh_token', res.data.refresh)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    setUser(res.data.user)
  }

  const login = async (email, password) => {
    const res = await api.post('/auth/login/', { email, password })
    localStorage.setItem('access_token', res.data.access)
    localStorage.setItem('refresh_token', res.data.refresh)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    setUser(res.data.user)
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}