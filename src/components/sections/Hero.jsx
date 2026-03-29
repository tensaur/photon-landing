import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const HERO_ATTR = 'data-hero-parallax-init'

export default function Hero() {
  const sectionRef = useRef(null)
  const contentRef = useRef(null)
  const scrollCueRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const content = contentRef.current
    const cue = scrollCueRef.current
    if (!section || !content) return
    if (section.getAttribute(HERO_ATTR)) return
    section.setAttribute(HERO_ATTR, '1')

    const mm = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mm.matches) return

    gsap.to(content, {
      y: 60,
      scale: 0.96,
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '80% top',
        scrub: 0.8,
      },
    })

    if (cue) {
      gsap.fromTo(
        cue,
        { opacity: 1, y: 0 },
        {
          opacity: 0,
          y: 10,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '45% top',
            scrub: 0.65,
          },
        }
      )
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="hero-section relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-8 md:px-12 lg:px-16"
    >
      <div
        className="pointer-events-none absolute inset-0 z-[1] hero-glow"
        aria-hidden
      />

      <div
        ref={contentRef}
        className="hero-stack relative z-[2] flex w-full max-w-[min(100%,52rem)] flex-col items-center text-center will-change-transform"
      >
        <p className="hero-line hero-line-0 section-eyebrow hero-eyebrow-spaced mb-10 md:mb-14 lg:mb-16">
          Metrics that keep up
        </p>

        <h1 className="hero-line hero-line-1 type-display-serif type-display-serif--hero text-[clamp(4.125rem,12vw,8.75rem)] text-primary">
          Photon
        </h1>

        <div
          className="hero-copy-block hero-line hero-line-2 mt-12 max-w-[min(100%,28rem)] text-pretty md:mt-[3.25rem] lg:mt-20 lg:max-w-[min(100%,32rem)]"
          role="group"
          aria-label="Product description"
        >
          <p className="hero-tagline-lead">
            Open source experiment tracking for the future of intelligence.
          </p>
          <p className="hero-tagline-tech font-mono-ui">
            <span className="hero-tagline-tech-dot" aria-hidden />
            Built in Rust
          </p>
        </div>
      </div>

      <div
        ref={scrollCueRef}
        className="pointer-events-none absolute bottom-[max(2rem,env(safe-area-inset-bottom))] left-1/2 z-[2] -translate-x-1/2 md:bottom-12"
      >
        <a
          href="#industry-context"
          className="hero-scroll-cue group pointer-events-auto flex flex-col items-center gap-3.5 [text-decoration:none]"
          aria-label="Scroll to next section"
        >
          <span className="hero-scroll-cue-label font-display text-[0.625rem] font-medium tracking-[0.32em] text-muted uppercase opacity-70 transition-opacity duration-500 group-hover:opacity-100">
            Scroll
          </span>
          <span className="hero-scroll-cue-track" aria-hidden>
            <span className="hero-scroll-cue-line" />
            <span className="hero-scroll-cue-orb" />
          </span>
        </a>
      </div>
    </section>
  )
}
