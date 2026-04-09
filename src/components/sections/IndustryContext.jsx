import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useScrollReveal } from '../../lib/snapScrollReveal.js'

gsap.registerPlugin(ScrollTrigger)

const PARALLAX_ATTR = 'data-industry-parallax-init'

export default function IndustryContext() {
  const sectionRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const content = contentRef.current
    if (!section || !content) return
    if (section.getAttribute(PARALLAX_ATTR)) return
    section.setAttribute(PARALLAX_ATTR, '1')

    const mm = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mm.matches) return

    gsap.fromTo(
      content,
      { y: 30 },
      {
        y: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.65,
        },
      },
    )
  }, [])

  useScrollReveal(sectionRef, (section) => {
    const h1 = section.querySelector('.ic-headline-1')
    const h2 = section.querySelector('.ic-headline-2')
    const asides = section.querySelectorAll('.ic-aside')

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      gsap.set([h1, h2, ...asides], {
        opacity: 1,
        y: 0,
        rotateX: 0,
      })
      return gsap.timeline()
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 76%',
        toggleActions: 'play none none none',
        once: true,
      },
      defaults: { ease: 'power2.out' },
    })

    tl.fromTo(
      h1,
      { y: 50, opacity: 0, rotateX: 8 },
      { y: 0, opacity: 1, rotateX: 0, duration: 0.9 },
    )
    tl.fromTo(
      h2,
      { y: 44, opacity: 0, rotateX: 8 },
      { y: 0, opacity: 1, rotateX: 0, duration: 0.85 },
      '-=0.5',
    )
    tl.fromTo(
      asides,
      { y: 18, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.65, stagger: 0.15 },
      '-=0.42',
    )
    return tl
  })

  return (
    <section
      id="industry-context"
      ref={sectionRef}
      className="relative overflow-hidden scroll-mt-24 md:scroll-mt-28"
      aria-labelledby="industry-context-heading"
    >
      <div className="mx-auto max-w-[1400px] px-6 py-40 md:px-12 md:py-52 lg:px-20 lg:py-64">
        <div ref={contentRef} className="mx-auto max-w-[44rem] will-change-transform">
          <h2
            id="industry-context-heading"
            className="heading-clip-wrap relative font-normal"
          >
            <span className="heading-clip-line block" style={{ perspective: '900px' }}>
              <span className="ic-headline-1 type-display-serif type-display-serif--block block text-[clamp(3rem,8vw,5.75rem)] text-primary opacity-0">
                OpenAI bought Neptune for $400M.
              </span>
            </span>
            <span
              className="heading-clip-line block pt-[0.08em]"
              style={{ perspective: '900px' }}
            >
              <span className="ic-headline-2 type-display-serif type-display-serif--block block text-[clamp(3rem,8vw,5.75rem)] italic text-secondary opacity-0">
                We open sourced it.
              </span>
            </span>
          </h2>

          <p className="ic-aside mt-5 max-w-[32rem] font-display text-[clamp(0.9375rem,1.8vw,1.0625rem)] font-normal leading-[1.6] text-muted opacity-0 md:mt-6">
            And then there's W&B with their slow and laggy dashboards.
          </p>

          <p className="ic-aside mt-10 max-w-[32rem] text-[0.7rem] tracking-wide text-muted/40 opacity-0 md:mt-12">
            *Photon is not affiliated with Neptune or OpenAI. We built an independent open-source alternative.
          </p>

        </div>
      </div>
    </section>
  )
}
