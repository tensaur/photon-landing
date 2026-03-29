import { useEffect, useRef } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

function snapScrollRevealIfNeeded(animation) {
  const st = animation?.scrollTrigger
  if (!st) return
  if (st.vars?.scrub) return
  if (st.progress > 0) {
    animation.progress(1)
  }
}

const ATTR = 'data-scroll-reveal-init'

export function useScrollReveal(ref, setup) {
  const setupRef = useRef(setup)
  setupRef.current = setup

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (el.getAttribute(ATTR)) return
    el.setAttribute(ATTR, '1')

    const anim = setupRef.current(el)

    ScrollTrigger.refresh()
    snapScrollRevealIfNeeded(anim)

    const t1 = setTimeout(() => {
      ScrollTrigger.refresh()
      snapScrollRevealIfNeeded(anim)
    }, 250)

    const t2 = setTimeout(() => {
      ScrollTrigger.refresh()
      snapScrollRevealIfNeeded(anim)
    }, 600)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [ref])
}
