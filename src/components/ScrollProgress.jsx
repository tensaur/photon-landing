import { useEffect, useRef } from 'react'

export default function ScrollProgress() {
  const barRef = useRef(null)

  useEffect(() => {
    const update = () => {
      if (!barRef.current) return
      const h = document.documentElement.scrollHeight - window.innerHeight
      const progress = h > 0 ? window.scrollY / h : 0
      barRef.current.style.transform = `scaleX(${progress})`
    }

    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <div className="fixed inset-x-0 top-0 z-[70] h-[2px]" aria-hidden>
      <div
        ref={barRef}
        className="h-full w-full origin-left bg-gradient-to-r from-[var(--glow-core)] via-[var(--glow-bloom)] to-[var(--glow-hot)] will-change-transform"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  )
}
