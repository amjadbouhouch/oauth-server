import React, { createContext } from 'react'
import { User } from '@oauth/db-client'
import { useQuery } from '@tanstack/react-query'
import { userService } from '../api'
import { isAxiosError } from 'axios'
import { useAuth } from 'hooks/useAuth'
interface AdminConsoleContextProps {
  user: User
}
export const AdminConsoleContext = createContext<AdminConsoleContextProps>(
  {} as AdminConsoleContextProps
)

export const AdminConsoleContextProvider = ({ children }) => {
  const { logout } = useAuth()
  const { data: user } = useQuery(['current-user'], userService.fetchUserInfo, {
    onError(err) {
      // TODO maybe token expired or something
      if (
        isAxiosError(err) &&
        [400, 401, 402, 403, 404].includes(err.response?.status)
      ) {
        logout()
        // log out
      }
    },
    onSuccess(user) {}
  })
  if (!user) {
    // add loading stuff
    return null
  }
  const value: AdminConsoleContextProps = {
    user
  }
  return (
    <AdminConsoleContext.Provider value={value}>
      {children}
    </AdminConsoleContext.Provider>
  )
}
