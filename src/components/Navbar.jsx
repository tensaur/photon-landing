import RepoStarCount from './RepoStarCount.jsx'

export default function Navbar() {
  return (
    <header className="nav-glass fixed inset-x-0 top-0 z-[60]" role="banner">
      <div className="flex h-[3.5rem] w-full items-stretch md:h-[3.75rem]">
        <a
          href="#"
          className="type-display-serif type-display-serif--compact-logo flex shrink-0 items-center justify-center border-l border-r border-[color:var(--border-default)] px-5 text-[1.1875rem] text-logo transition-opacity hover:opacity-60 min-[380px]:min-w-[7.5rem] min-[380px]:px-6 md:min-w-[9rem] md:px-7 md:text-[1.3125rem] lg:min-w-[10rem] lg:px-8"
        >
          Photon
        </a>
        <div className="min-w-0 flex-1" aria-hidden />
        <nav
          className="flex shrink-0 items-stretch font-display text-[0.78rem] font-medium md:text-[0.8125rem]"
          aria-label="Primary"
        >
          <a
            href="https://github.com/tensaur/photon"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-fill-link flex min-w-0 items-center gap-2.5 border-x border-[color:var(--border-default)] px-5 md:gap-3 md:px-6"
            data-cursor-hover
          >
            <span className="shrink-0">GitHub</span>
            <RepoStarCount
              owner="tensaur"
              repo="photon"
              className="nav-github-stars shrink-0 text-[0.75rem] font-medium tabular-nums tracking-tight"
            />
          </a>
          <a
            href="https://docs.rs/photon/latest/photon/"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-fill-link flex items-center border-r border-[color:var(--border-default)] px-5 md:px-6"
            data-cursor-hover
          >
            Docs
          </a>
        </nav>
      </div>
    </header>
  )
}
