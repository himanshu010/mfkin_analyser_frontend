// The mark: three rising bars, the leader in the accent colour.
export const LogoMark = ({ className = "size-9" }) => (
  <svg aria-hidden className={className} fill="none" viewBox="0 0 36 36">
    <rect
      className="fill-surface-2 stroke-line-strong"
      height="35"
      rx="10"
      width="35"
      x="0.5"
      y="0.5"
    />
    <rect className="fill-primary" height="9" rx="1.5" width="5" x="9" y="18" />
    <rect className="fill-primary" height="13" rx="1.5" width="5" x="15.5" y="14" />
    <rect className="fill-accent" height="18" rx="1.5" width="5" x="22" y="9" />
  </svg>
);

const Logo = ({ subtitle = "Sector intelligence and fund scouting" }) => (
  <div className="flex min-w-0 items-center gap-3">
    <LogoMark />
    <div className="min-w-0">
      <p className="truncate text-lg leading-tight font-semibold tracking-tight">
        MFkin <span className="text-primary">Analyser</span>
      </p>
      {subtitle ? (
        <p className="hidden truncate text-xs text-fg-muted sm:block">{subtitle}</p>
      ) : null}
    </div>
  </div>
);

export default Logo;
