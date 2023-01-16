import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

export default function useQueryParams<
  Type extends { [x: string]: string }
>(): Type {
  const search = useLocation().search

  const queries = useMemo(() => {
    const q: any = {}
    search
      .substr(1)
      .split('&')
      .forEach((elem) => {
        const [key, value] = elem.split('=')

        q[key] = value
      })
    return q
  }, [search])

  return queries
}
