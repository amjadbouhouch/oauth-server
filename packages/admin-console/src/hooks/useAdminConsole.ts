import { useContext } from 'react'
import { AdminConsoleContext } from '../context/AdminConsoleContext'

export const useAdminConsole = () => useContext(AdminConsoleContext)
