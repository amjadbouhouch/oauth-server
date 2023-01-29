import React, { createContext, useState } from 'react'
interface IAuthContext {
  login: (accessToken: string) => void
  logout: () => void
  isLoggedIn: boolean
}

export const AuthContext = createContext({} as IAuthContext)

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    Boolean(localStorage.getItem('accessToken'))
  )

  function login(accessToken: string) {
    localStorage.setItem('accessToken', accessToken)
    setIsLoggedIn(true)
  }

  function logout() {
    localStorage.clear()
    setIsLoggedIn(false)
  }

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        isLoggedIn
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
