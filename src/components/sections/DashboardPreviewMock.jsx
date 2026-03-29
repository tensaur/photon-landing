export default function DashboardPreviewMock() {
  return (
    <div className="flex min-h-0 w-full flex-col bg-[var(--mock-chrome-bg)] text-left text-primary md:h-full">
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-[color:var(--border-subtle)] px-5 py-3.5 md:px-6">
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            className="h-2 w-2 shrink-0 rounded-full bg-glow-core/90"
            aria-hidden
          />
          <span className="font-display truncate text-[11px] font-medium tracking-wide text-secondary md:text-xs">
            run / <span className="text-primary">bert-finetune-v3</span>
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="hidden font-display text-[10px] text-muted sm:inline">epoch 42</span>
          <span className="dashboard-mock-status rounded-md border border-[#c5e6d4] bg-[#e4f1ee]/80 px-2.5 py-0.5 font-display text-[9px] font-semibold uppercase tracking-wider text-[#2d6a4f]">
            streaming
          </span>
        </div>
      </header>

      <div className="flex flex-col max-md:flex-none sm:flex-row md:min-h-0 md:flex-1">
        <aside
          className="flex shrink-0 border-b border-[color:var(--border-subtle)] sm:w-[52px] sm:flex-col sm:border-b-0 sm:border-r sm:border-[color:var(--border-subtle)] sm:py-3"
          aria-hidden
        >
          <div className="flex justify-around gap-1 px-2 py-2 sm:flex-col sm:items-center sm:gap-3 sm:px-0">
            {['M', 'R', 'L', 'D'].map((c, i) => (
              <span
                key={c}
                className={[
                  'flex h-8 w-8 items-center justify-center border border-transparent font-display text-[10px] font-semibold transition-colors',
                  i === 0
                    ? 'border-[color:var(--border-muted)] bg-[var(--mock-panel)] text-primary shadow-sm'
                    : 'text-muted hover:border-[color:var(--border-subtle)] hover:bg-[var(--mock-panel-soft)]',
                ].join(' ')}
              >
                {c}
              </span>
            ))}
          </div>
        </aside>

        <div className="flex min-w-0 max-md:flex-none flex-col gap-4 p-4 md:flex-1 md:gap-5 md:p-5">
          <div className="relative overflow-hidden border border-[color:var(--border-subtle)] bg-[var(--mock-panel)] p-4 shadow-sm">
            <div className="mb-3 flex items-end justify-between gap-4">
              <div>
                <p className="font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
                  Loss
                </p>
                <p className="mt-1 font-display text-xl font-semibold tabular-nums tracking-tight text-primary md:text-2xl">
                  0.00241
                </p>
              </div>
              <p className="font-display text-right text-[10px] text-muted">last 2.4k steps</p>
            </div>
            <svg
              className="chart-sparkline w-full"
              viewBox="0 0 520 140"
              preserveAspectRatio="none"
              aria-hidden
            >
              <defs>
                <linearGradient id="photon-chart-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(139, 92, 246, 0.22)" />
                  <stop offset="50%" stopColor="rgba(167, 139, 250, 0.35)" />
                  <stop offset="100%" stopColor="rgba(139, 92, 246, 0)" />
                </linearGradient>
                <linearGradient id="photon-chart-stroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="50%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#a78bfa" />
                </linearGradient>
              </defs>
              <path
                fill="url(#photon-chart-fill)"
                d="M0,105 C40,102 75,88 115,82 C155,76 185,92 230,78 C275,64 310,88 355,72 C400,56 440,68 520,52 L520,140 L0,140 Z"
              />
              <path
                fill="none"
                stroke="url(#photon-chart-stroke)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M0,105 C40,102 75,88 115,82 C155,76 185,92 230,78 C275,64 310,88 355,72 C400,56 440,68 520,52"
              />
            </svg>
          </div>

          <div className="grid grid-cols-3 gap-2 md:gap-3">
            {[
              { label: 'Points / s', value: '1.04M' },
              { label: 'Latency', value: '11ms' },
              { label: 'Dropped', value: '0' },
            ].map((k) => (
              <div
                key={k.label}
                className="border border-[color:var(--border-subtle)] bg-[var(--mock-panel-soft)] px-3 py-2.5 shadow-sm md:px-3.5 md:py-3"
              >
                <p className="font-display text-[9px] font-semibold uppercase tracking-[0.18em] text-muted">
                  {k.label}
                </p>
                <p className="mt-1 font-display text-base font-semibold tabular-nums text-primary md:text-lg">
                  {k.value}
                </p>
              </div>
            ))}
          </div>

          <div className="overflow-hidden border border-[color:var(--border-subtle)] bg-[color-mix(in_srgb,var(--mock-panel)_78%,transparent)]">
            <div className="border-b border-[color:var(--border-subtle)] px-3 py-2 font-display text-[9px] font-semibold uppercase tracking-[0.2em] text-muted md:px-4">
              Recent metrics
            </div>
            <ul className="divide-y divide-[color:color-mix(in_srgb,var(--text-primary)_5%,transparent)] font-display text-[10px] md:text-[11px]">
              {[
                ['train.loss', '0.00241', '↓'],
                ['val.accuracy', '0.9912', '↑'],
              ].map(([name, val, dir]) => (
                <li
                  key={name}
                  className="flex items-center justify-between gap-3 px-3 py-2.5 md:px-4"
                >
                  <span className="truncate text-muted">{name}</span>
                  <span className="shrink-0 tabular-nums text-secondary">{val}</span>
                  <span className="w-4 shrink-0 text-center text-glow-core/85">{dir}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
