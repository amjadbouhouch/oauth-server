import { useQuery } from '@tanstack/react-query'
import { AuthService } from 'api'
import useQueryParams from 'hooks/useQueryParams'
import React, { useEffect } from 'react'
interface OAuthProps {}
const OAuth = ({}: OAuthProps) => {
  const { code, client_id } = useQueryParams()
  useEffect(() => {
    ;(async () => {
      const authService = new AuthService()
      authService.requestAccessToken({
        code,
        client_id
      })
    })()
  }, [])
  return null
}

export default OAuth
