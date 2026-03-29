import { useRef } from 'react'
import gsap from 'gsap'
import MagneticButton from '../MagneticButton.jsx'
import RepoStarCount from '../RepoStarCount.jsx'
import { useScrollReveal } from '../../lib/snapScrollReveal.js'

export default function CTA() {
  const sectionRef = useRef(null)

  useScrollReveal(sectionRef, (section) => {
    const heading = section.querySelector('.cta-heading')
    const lead = section.querySelector('.cta-lead')
    const actions = section.querySelector('.cta-actions')
    const link = section.querySelector('.cta-community-link')

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 70%',
        toggleActions: 'play none none none',
        once: true,
      },
      defaults: { ease: 'power3.out' },
    })

    tl.fromTo(heading, { y: 44, opacity: 0 }, { y: 0, opacity: 1, duration: 1 })
    tl.fromTo(lead, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.6')
    tl.fromTo(
      actions,
      { y: 36, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.88 },
      '-=0.5',
    )
    tl.fromTo(link, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.52')
    return tl
  })

  return (
    <section
      ref={sectionRef}
      className="cta-section relative flex h-full min-h-0 flex-col items-center justify-center overflow-hidden px-6 py-24 text-center md:py-32"
      aria-labelledby="cta-heading"
    >
      <div className="cta-glow pointer-events-none absolute inset-0" aria-hidden />

      <div className="relative z-[1] mx-auto flex w-full max-w-3xl flex-col items-center">
        <h2
          id="cta-heading"
          className="cta-heading font-sans text-[clamp(2.5rem,6.5vw,4.75rem)] font-normal italic leading-[1.04] tracking-[-0.035em] text-primary [font-optical-sizing:auto]"
        >
          Open source.{' '}
          <br className="hidden sm:inline" />
          <span className="not-italic">Self-hosted. All yours.</span>
        </h2>
        <p className="cta-lead mt-6 max-w-lg font-display text-[0.9375rem] text-secondary md:mt-8 md:text-[1.0625rem]">
          No $250/month subscriptions. Just your data, on your infra.
        </p>

        <div className="cta-actions mt-14 flex w-full flex-col items-stretch gap-4 sm:mt-16 sm:w-auto sm:flex-row sm:items-center sm:justify-center sm:gap-5">
          <MagneticButton
            href="https://github.com/tensaur/photon"
            target="_blank"
            rel="noopener noreferrer"
            strength={0.26}
            className="cta-btn-primary interactive-btn interactive-btn--primary inline-flex min-h-[3.5rem] cursor-pointer items-center justify-center gap-2.5 bg-[var(--cta-solid)] px-14 py-4 font-display text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-[var(--text-on-dark)] shadow-[0_1px_0_rgba(255,255,255,0.06)_inset] transition-all duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            data-cursor-hover
          >
            Star on GitHub
            <RepoStarCount
              owner="tensaur"
              repo="photon"
              className="font-normal normal-case tracking-normal opacity-85"
            />
          </MagneticButton>
          <MagneticButton
            href="https://docs.rs/photon/latest/photon/"
            target="_blank"
            rel="noopener noreferrer"
            strength={0.22}
            className="cta-btn-secondary interactive-btn interactive-btn--secondary inline-flex min-h-[3.5rem] cursor-pointer items-center justify-center border border-[color:var(--border-emphasis)] bg-transparent px-14 py-4 font-display text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-primary transition-all duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            data-cursor-hover
          >
            Read the Docs
          </MagneticButton>
        </div>

        <a
          href="https://discord.gg/U5hWx8EA7Y"
          target="_blank"
          rel="noopener noreferrer"
          className="cta-community-link link-animated mt-12 font-display text-[0.875rem] text-secondary md:mt-14"
          data-cursor-hover
        >
          Join the Community
        </a>
      </div>
    </section>
  )
}
