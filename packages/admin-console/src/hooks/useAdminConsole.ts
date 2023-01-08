import { useContext } from 'react'
import { adminConsoleContext } from '../context/AdminConsoleContext'

export const useAdminConsole = () => useContext(adminConsoleContext)
