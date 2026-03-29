import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import DashboardPreviewMock from './DashboardPreviewMock.jsx'
import { useScrollReveal } from '../../lib/snapScrollReveal.js'

gsap.registerPlugin(ScrollTrigger)

const DASH_PARALLAX_ATTR = 'data-dash-parallax-init'

export default function Dashboard() {
  const sectionRef = useRef(null)
  const cardRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const card = cardRef.current
    if (!section || !card) return
    if (section.getAttribute(DASH_PARALLAX_ATTR)) return
    section.setAttribute(DASH_PARALLAX_ATTR, '1')

    const mm = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mm.matches) return

    gsap.fromTo(
      card,
      {
        rotateX: 10,
        scale: 0.9,
        y: 80,
      },
      {
        rotateX: 0,
        scale: 1,
        y: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          end: 'center center',
          scrub: 0.8,
        },
      },
    )
  }, [])

  useScrollReveal(sectionRef, (section) => {
    const title = section.querySelector('.dash-title')
    const sub = section.querySelector('.dash-subline')
    const support = section.querySelector('.dash-supporting')

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 72%',
        toggleActions: 'play none none none',
        once: true,
      },
      defaults: { ease: 'power3.out' },
    })

    tl.fromTo(
      title,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 },
    )
    tl.fromTo(
      sub,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.85 },
      '-=0.55',
    )
    tl.fromTo(
      support,
      { y: 22, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.75 },
      '-=0.42',
    )
    return tl
  })

  return (
    <section
      ref={sectionRef}
      className="relative overflow-x-hidden"
      aria-labelledby="dashboard-heading"
    >
      <div className="mx-auto flex min-h-screen w-full max-w-[1400px] max-md:min-h-0 flex-col items-center justify-center px-6 py-20 pb-28 md:px-10 md:py-36 md:pb-36 lg:px-14">
        <div className="mb-14 max-w-2xl text-center md:mb-20">
          <h2
            id="dashboard-heading"
            className="dash-title font-sans text-[clamp(2.25rem,6vw,4rem)] font-normal leading-[1.04] tracking-[-0.03em] text-primary [font-optical-sizing:auto]"
          >
            A dashboard built for millions of data points.
          </h2>
          <p className="dash-subline mt-6 font-display text-[0.9375rem] leading-[1.65] text-secondary md:mt-8 md:text-[1rem]">
            Some dashboards tap out at ten thousand points. Ours is still stretching.
          </p>
        </div>

        <div
          ref={cardRef}
          className="dash-preview relative w-full max-w-3xl"
          style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
        >
          <div className="dash-glow pointer-events-none absolute -inset-6 rounded-3xl opacity-0 transition-opacity duration-700" aria-hidden />

          <div
            className="dash-preview-card relative overflow-hidden border border-[color:var(--border-default)] bg-[var(--bg-elevated)] shadow-[0_36px_88px_-24px_rgba(15,13,11,0.16),0_0_0_1px_rgba(255,255,255,0.75)_inset]"
            aria-label="Product preview"
          >
            <div className="w-full md:aspect-[16/10] md:min-h-0">
              <DashboardPreviewMock />
            </div>
          </div>
        </div>

        <p className="dash-supporting mt-10 font-display text-[0.875rem] text-muted md:mt-14 md:text-[0.9375rem]">
          100% Rust so your laptop can take the afternoon off.
        </p>
      </div>
    </section>
  )
}
