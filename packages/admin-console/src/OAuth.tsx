import useQueryParams from 'hooks/useQueryParams'
import React from 'react'
interface OAuthProps {}
const OAuth = ({}: OAuthProps) => {
  const params = useQueryParams()
  console.log(params)

  return null
}

export default OAuth
