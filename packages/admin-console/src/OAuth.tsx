import { useQuery } from '@tanstack/react-query'
import { AuthService } from 'api'
import useQueryParams from 'hooks/useQueryParams'
import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
interface OAuthProps {}
const OAuth = ({}: OAuthProps) => {
  const { code, client_id } = useQueryParams()
  const history = useHistory()
  useEffect(() => {
    const authService = new AuthService()
    authService
      .requestAccessToken({
        code,
        client_id
      })
      .then(({ access_token }) => {
        localStorage.setItem('accessToken', access_token)
        history.replace('/admin-console')
      })
  }, [])
  return null
}

export default OAuth
