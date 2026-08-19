"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import type { User } from "@/types"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (data: SignupData) => Promise<void>
  logout: () => void
  updateUser: (user: User) => void
}

interface SignupData {
  full_name: string
  email: string
  password: string
  role: "student" | "instructor"
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null)
  const [loading, setLoading] = React.useState(true)
  const router = useRouter()

  React.useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (token) {
      api.setToken(token)
      api.get<User>("/auth/me")
        .then(setUser)
        .catch(() => {
          localStorage.removeItem("access_token")
          api.setToken(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    const res = await api.post<{ accessToken: string; refreshToken: string; user: User }>("/auth/login", { email, password })
    localStorage.setItem("access_token", res.accessToken)
    if (res.refreshToken) localStorage.setItem("refresh_token", res.refreshToken)
    api.setToken(res.accessToken)
    setUser(res.user)
    router.push("/dashboard")
  }

  const signup = async (data: SignupData) => {
    const res = await api.post<{ accessToken: string; refreshToken: string; user: User }>("/auth/register", data)
    localStorage.setItem("access_token", res.accessToken)
    if (res.refreshToken) localStorage.setItem("refresh_token", res.refreshToken)
    api.setToken(res.accessToken)
    setUser(res.user)
    router.push("/onboarding")
  }

  const logout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    api.setToken(null)
    setUser(null)
    router.push("/login")
  }

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
