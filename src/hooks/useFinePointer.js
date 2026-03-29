import { useEffect, useState } from 'react'

export function useFinePointer() {
  const [fine, setFine] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(pointer: fine)').matches : false,
  )

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)')
    const onChange = () => setFine(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return fine
}
