import { useQuery } from '@tanstack/react-query'
import { AuthService } from 'api'
import { useAuth } from 'hooks/useAuth'
import useQueryParams from 'hooks/useQueryParams'
import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
interface OAuthProps {}
const OAuth = ({}: OAuthProps) => {
  const { code, client_id } = useQueryParams()
  const { login } = useAuth()
  useEffect(() => {
    const authService = new AuthService()
    authService
      .requestAccessToken({
        code,
        client_id
      })
      .then(({ access_token }) => {
        login(access_token)
      })
  }, [])
  return null
}

export default OAuth
