import React, { createContext } from 'react'
import { User } from '@oauth/db-client'
import { useQuery } from '@tanstack/react-query'
import { userService } from '../api'
interface AdminConsoleContextProps {
  user: User
}
export const adminConsoleContext = createContext<AdminConsoleContextProps>(
  {} as AdminConsoleContextProps
)

export const AdminConsoleContextProvider = ({ children }) => {
  const { data: user } = useQuery(['current-user'], userService.fetchUserInfo, {
    onError(err) {
      // TODO maybe token expired or something
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
    <adminConsoleContext.Provider value={value}>
      {children}
    </adminConsoleContext.Provider>
  )
}
