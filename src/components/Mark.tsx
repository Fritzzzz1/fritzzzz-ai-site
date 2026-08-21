import './Mark.css'

interface MarkProps {
  tone: 'light' | 'dark'
  size?: number
}

export function Mark({ tone, size = 32 }: MarkProps) {
  const ringStroke = tone === 'light' ? '#16262E' : '#F4F5F6'
  const nodeFill = tone === 'light' ? '#E8F1EF' : '#16262E'
  const nodeStroke = tone === 'light' ? '#0C5C57' : '#58A49E'
  const centerFill = tone === 'light' ? '#0C5C57' : '#58A49E'

  return (
    <svg
      className="mark"
      width={size}
      height={size}
      viewBox="0 0 300 300"
      role="img"
      aria-label="fritzzzz_ai"
    >
      <circle cx="150" cy="150" r="108" fill="none" stroke={ringStroke} strokeWidth="11" />
      <line x1="150" y1="150" x2="56" y2="56" stroke={nodeStroke} strokeWidth="8" />
      <line x1="150" y1="150" x2="244" y2="56" stroke={nodeStroke} strokeWidth="8" />
      <line x1="150" y1="150" x2="150" y2="282" stroke={nodeStroke} strokeWidth="8" />
      <circle cx="150" cy="150" r="24" fill={centerFill} />
      <circle cx="56" cy="56" r="17" fill={nodeFill} stroke={nodeStroke} strokeWidth="8" />
      <circle cx="244" cy="56" r="17" fill={nodeFill} stroke={nodeStroke} strokeWidth="8" />
      <circle cx="150" cy="282" r="17" fill={nodeFill} stroke={nodeStroke} strokeWidth="8" />
    </svg>
  )
}

interface LockupProps {
  tone: 'light' | 'dark'
  size?: number
}

export function Lockup({ tone, size = 32 }: LockupProps) {
  return (
    <span className={`lockup lockup--${tone}`}>
      <Mark tone={tone} size={size} />
      <span className="lockup__word">
        fritzzzz<span className="lockup__accent">_ai</span>
      </span>
    </span>
  )
}
