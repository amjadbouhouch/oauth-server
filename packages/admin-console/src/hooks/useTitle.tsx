import { useEffect } from 'react'

const defaultTitle = 'Oauth Test'
export default function useTitle(title: string) {
  useEffect(() => {
    if (title) {
      document.title = title
    }

    return () => {
      document.title = defaultTitle
    }
  }, [title])
}
