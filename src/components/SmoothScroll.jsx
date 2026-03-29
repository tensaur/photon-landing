import { useLayoutEffect, useRef, useCallback } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let _lenis = null
let _lenisRefCount = 0

function acquireLenis() {
  if (!_lenis) {
    _lenis = new Lenis({
      lerp: 0.055,
      wheelMultiplier: 0.82,
      touchMultiplier: 1,
      smoothWheel: true,
      syncTouch: true,
      syncTouchLerp: 0.06,
    })

    const onScroll = () => ScrollTrigger.update()
    _lenis.on('scroll', onScroll)
    _lenis.__onScroll = onScroll

    ScrollTrigger.scrollerProxy(window, {
      scrollTop(value) {
        if (arguments.length) {
          _lenis.scrollTo(value, { immediate: true })
        }
        return _lenis.scroll
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
          right: window.innerWidth,
          bottom: window.innerHeight,
        }
      },
      pinType: document.documentElement.style.transform ? 'transform' : 'fixed',
    })
  }
  _lenisRefCount++
  return _lenis
}

function releaseLenis() {
  _lenisRefCount--
  if (_lenisRefCount <= 0) {
    _lenisRefCount = 0
    if (_lenis) {
      _lenis.off('scroll', _lenis.__onScroll)
      ScrollTrigger.scrollerProxy(window, {})
      _lenis.destroy()
      _lenis = null
    }
  }
}

export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null)
  const rafId = useRef(0)

  const tick = useCallback((time) => {
    lenisRef.current?.raf(time)
    rafId.current = requestAnimationFrame(tick)
  }, [])

  useLayoutEffect(() => {
    const lenis = acquireLenis()
    lenisRef.current = lenis
    rafId.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId.current)
      releaseLenis()
      lenisRef.current = null
    }
  }, [tick])

  return (
    <>
      <div className="site-atmosphere" aria-hidden />
      {children}
    </>
  )
}
