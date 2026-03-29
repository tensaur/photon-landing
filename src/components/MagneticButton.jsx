import { useEffect, useRef, useState } from 'react'

const isTouchDevice = () =>
  typeof window !== 'undefined' &&
  (window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window)

export default function MagneticButton({
  strength = 0.32,
  className = '',
  children,
  ...props
}) {
  const ref = useRef(null)
  const pos = useRef({ x: 0, y: 0 })
  const tgt = useRef({ x: 0, y: 0 })
  const reduceRef = useRef(false)
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    setIsTouch(isTouchDevice())
  }, [])

  useEffect(() => {
    if (isTouch) return

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    reduceRef.current = mq.matches
    const onMq = () => {
      reduceRef.current = mq.matches
    }
    mq.addEventListener('change', onMq)
    return () => mq.removeEventListener('change', onMq)
  }, [isTouch])

  useEffect(() => {
    if (isTouch) return

    let id = 0
    const tick = () => {
      const k = reduceRef.current ? 1 : 0.26
      pos.current.x += (tgt.current.x - pos.current.x) * k
      pos.current.y += (tgt.current.y - pos.current.y) * k
      const n = ref.current
      if (n)
        n.style.transform = `translate3d(${pos.current.x}px,${pos.current.y}px,0)`
      id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [isTouch])

  const onMove = (e) => {
    if (reduceRef.current) return
    const n = ref.current
    if (!n) return
    const r = n.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    tgt.current.x = (e.clientX - cx) * strength
    tgt.current.y = (e.clientY - cy) * strength
  }

  const onLeave = () => {
    tgt.current.x = 0
    tgt.current.y = 0
  }

  if (isTouch) {
    return (
      <a className={className} {...props}>
        {children}
      </a>
    )
  }

  return (
    <span
      ref={ref}
      className="inline-flex"
      style={{ willChange: 'transform' }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <a className={className} {...props} onBlur={onLeave}>
        {children}
      </a>
    </span>
  )
}
