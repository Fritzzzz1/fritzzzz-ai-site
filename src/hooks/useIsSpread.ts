import { useEffect, useState } from 'react'

export function useIsSpread() {
  const [isSpread, setIsSpread] = useState(
    () => window.matchMedia('(min-width: 860px)').matches,
  )
  useEffect(() => {
    const query = window.matchMedia('(min-width: 860px)')
    const onChange = (event: MediaQueryListEvent) => setIsSpread(event.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])
  return isSpread
}
