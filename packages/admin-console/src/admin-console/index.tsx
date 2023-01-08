import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { userService } from '../api'

const AdminConsole = () => {
  const { data, error, isSuccess } = useQuery(
    ['current-user'],
    userService.fetchUserInfo
  )
  if (!isSuccess) return <div>loading</div>
  return (
    <div className="relative overflow-hidden bg-white">
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        {JSON.stringify(data)}
      </div>
    </div>
  )
}

export default AdminConsole
