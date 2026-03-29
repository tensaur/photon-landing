import { useEffect, useRef, useState } from 'react'
import { useFinePointer } from '../hooks/useFinePointer.js'

const LERP = 0.38

const INTERACTIVE_SELECTOR = [
  'a[href]',
  'button',
  'input',
  'textarea',
  'select',
  '[role="button"]',
  '[data-cursor-hover]',
  'label[for]',
  'summary',
].join(', ')

export default function CustomCursor() {
  const finePointer = useFinePointer()
  const [hovering, setHovering] = useState(false)
  const [mouseInView, setMouseInView] = useState(false)

  const targetRef = useRef({ x: 0, y: 0 })
  const currentRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef(0)
  const rootRef = useRef(null)
  const snapNextRef = useRef(true)

  const showCustom = finePointer && hovering && mouseInView

  useEffect(() => {
    if (!finePointer) {
      document.documentElement.classList.remove('custom-cursor-active')
      return
    }
    if (showCustom) {
      document.documentElement.classList.add('custom-cursor-active')
    } else {
      document.documentElement.classList.remove('custom-cursor-active')
    }
    return () => {
      document.documentElement.classList.remove('custom-cursor-active')
    }
  }, [finePointer, showCustom])

  useEffect(() => {
    if (!finePointer) return

    const onMove = (e) => {
      targetRef.current.x = e.clientX
      targetRef.current.y = e.clientY

      if (snapNextRef.current) {
        currentRef.current.x = e.clientX
        currentRef.current.y = e.clientY
        snapNextRef.current = false
      }

      setMouseInView(true)

      const el = document.elementFromPoint(e.clientX, e.clientY)
      const onTarget = Boolean(el?.closest?.(INTERACTIVE_SELECTOR))

      setHovering((prev) => {
        if (onTarget && !prev) {
          currentRef.current.x = e.clientX
          currentRef.current.y = e.clientY
        }
        return onTarget
      })
    }

    const onLeaveWindow = () => {
      setMouseInView(false)
      setHovering(false)
      snapNextRef.current = true
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeaveWindow)
    window.addEventListener('blur', onLeaveWindow)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeaveWindow)
      window.removeEventListener('blur', onLeaveWindow)
    }
  }, [finePointer])

  useEffect(() => {
    if (!finePointer) return

    const tick = () => {
      const t = targetRef.current
      const c = currentRef.current
      c.x += (t.x - c.x) * LERP
      c.y += (t.y - c.y) * LERP

      const node = rootRef.current
      if (node) {
        node.style.transform = `translate3d(${c.x}px, ${c.y}px, 0) translate(-50%, -50%)`
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [finePointer])

  if (!finePointer) return null

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed left-0 top-0 z-[10050]"
      style={{ willChange: 'transform' }}
      aria-hidden
    >
      <div
        className={[
          'rounded-full border-2 bg-transparent transition-[width,height,background-color,border-color,box-shadow,opacity] duration-150 ease-out',
          hovering ? 'custom-cursor-ring h-10 w-10' : 'custom-cursor-dot h-2 w-2 bg-[var(--logo-ink)] shadow-none',
          showCustom ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
      />
    </div>
  )
}
