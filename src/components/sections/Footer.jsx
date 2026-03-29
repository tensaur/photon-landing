import { useRef } from 'react'
import gsap from 'gsap'
import { useScrollReveal } from '../../lib/snapScrollReveal.js'

export default function Footer() {
  const footerRef = useRef(null)

  useScrollReveal(footerRef, (footer) => {
    const inner = footer.querySelector('.footer-inner')

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: footer,
        start: 'top 92%',
        toggleActions: 'play none none none',
        once: true,
      },
      defaults: { ease: 'power3.out' },
    })

    tl.fromTo(inner, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75 })
    return tl
  })

  return (
    <footer
      ref={footerRef}
      className="site-footer shrink-0 border-t border-[color:var(--border-subtle)]"
    >
      <div className="footer-inner mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-4 px-6 py-6 md:grid-cols-3 md:gap-6 md:px-12 md:py-7 lg:px-20">
        <nav
          className="flex items-center justify-center gap-7 font-display text-[0.8125rem] font-medium tracking-[0.06em] text-muted md:justify-start"
          aria-label="Footer"
        >
          <a
            href="https://github.com/tensaur/photon"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link text-muted"
            data-cursor-hover
          >
            GitHub
          </a>
          <a
            href="https://docs.rs/photon/latest/photon/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link text-muted"
            data-cursor-hover
          >
            Docs
          </a>
          <a
            href="https://discord.gg/U5hWx8EA7Y"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link text-muted"
            data-cursor-hover
          >
            Community
          </a>
        </nav>

        <p className="text-center font-display text-[0.6875rem] font-normal tracking-[0.02em] text-muted">
          Made with ❤️ by{' '}
          <a
            href="https://tensaur.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link text-secondary underline-offset-[0.2em]"
            data-cursor-hover
          >
            Tensaur
          </a>{' '}
          🦖
        </p>

        <p className="type-display-serif type-display-serif--block text-center text-[clamp(0.875rem,2vw,0.9375rem)] font-normal italic leading-snug tracking-[var(--type-display-serif-track)] text-secondary md:text-right">
          Built with Rust, and a healthy dislike of slow dashboards.
        </p>
      </div>
    </footer>
  )
}
