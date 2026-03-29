import { useEffect, useState } from 'react'

const cache = new Map()

function StarIcon({ className }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden
    >
      <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Zm0 2.445L6.615 5.5a.75.75 0 0 1-.564.41l-3.097.45 2.24 2.184a.75.75 0 0 1 .216.664l-.528 3.084 2.769-1.456a.75.75 0 0 0 .698 0l2.77 1.456-.53-3.084a.75.75 0 0 1 .216-.664l2.24-2.183-3.096-.45a.75.75 0 0 1-.564-.41L8 2.694Z" />
    </svg>
  )
}

function readEnvStars() {
  const v = import.meta.env.VITE_GITHUB_STARS
  return typeof v === 'string' ? v.trim() : ''
}

export default function RepoStarCount({
  owner,
  repo,
  className = '',
}) {
  const key = `${owner}/${repo}`
  const envStars = readEnvStars()

  const [text, setText] = useState(() => {
    const hit = cache.get(key)
    return typeof hit === 'string' ? hit : null
  })

  const [loading, setLoading] = useState(() => {
    const hit = cache.get(key)
    return typeof hit !== 'string' && hit !== '__error__'
  })

  const [failed, setFailed] = useState(() => cache.get(key) === '__error__')

  useEffect(() => {
    const hit = cache.get(key)
    if (typeof hit === 'string') return
    if (hit === '__error__') return

    let cancelled = false
    fetch(`https://img.shields.io/github/stars/${owner}/${repo}.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (cancelled || !d) {
          if (!cancelled) {
            setLoading(false)
            cache.set(key, '__error__')
            setFailed(true)
          }
          return
        }
        if (d.color === 'red' || /not found/i.test(String(d.message || ''))) {
          cache.set(key, '__error__')
          if (!cancelled) {
            setLoading(false)
            setFailed(true)
          }
          return
        }
        const msg = String(d.message || d.value || '').trim()
        if (!msg) {
          cache.set(key, '__error__')
          if (!cancelled) {
            setLoading(false)
            setFailed(true)
          }
          return
        }
        cache.set(key, msg)
        if (!cancelled) {
          setLoading(false)
          setText(msg)
        }
      })
      .catch(() => {
        cache.set(key, '__error__')
        if (!cancelled) {
          setLoading(false)
          setFailed(true)
        }
      })

    return () => {
      cancelled = true
    }
  }, [key, owner, repo])

  const display = text || envStars

  const wrapClass = `inline-flex items-center gap-1 ${className}`.trim()
  const iconClass =
    'size-[1em] shrink-0 translate-y-[0.04em] opacity-[0.92]'

  if (display) {
    return (
      <span className={wrapClass} aria-label={`${display} GitHub stars`}>
        <StarIcon className={iconClass} />
        <span className="tabular-nums">{display}</span>
      </span>
    )
  }

  if (loading) {
    return (
      <span
        className={wrapClass}
        aria-busy="true"
        aria-label="Loading star count"
      >
        <StarIcon className={`${iconClass} opacity-50`} />
        <span className="inline-block w-[1.1em] text-center opacity-50">
          …
        </span>
      </span>
    )
  }

  if (failed) {
    return (
      <span
        className={wrapClass}
        title="Star count appears when the GitHub repo is public."
        aria-label="GitHub stars (count unavailable)"
      >
        <StarIcon className={`${iconClass} opacity-55`} />
      </span>
    )
  }

  return null
}
