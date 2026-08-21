import { useEffect, useState } from 'react'
import './Lens.css'

const PATHS = [
  { label: 'הדרכה אישית', x: 56, y: 56 },
  { label: 'משימות אוטומטיות', x: 244, y: 56 },
  { label: 'סוכנים ותוכנות', x: 150, y: 282 },
]

const INTRO_MS = 2200
const CYCLE_MS = 2800

function usePathCycle(paused: boolean) {
  const [active, setActive] = useState(-1)
  useEffect(() => {
    if (paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let timer = 0
    const start = window.setTimeout(() => {
      setActive(0)
      timer = window.setInterval(() => setActive((i) => (i + 1) % PATHS.length), CYCLE_MS)
    }, active === -1 ? INTRO_MS : 0)
    return () => {
      window.clearTimeout(start)
      window.clearInterval(timer)
    }
  }, [paused, active === -1])
  return [active, setActive] as const
}

export function Lens() {
  const [hovered, setHovered] = useState(-1)
  const [cycled, setCycled] = usePathCycle(hovered !== -1)
  const active = hovered !== -1 ? hovered : cycled

  return (
    <div className="lens">
      <div className="lens__stage">
        <svg
          className="lens__svg"
          viewBox="-40 -40 380 380"
          role="img"
          aria-label="שלוש דרכים שיוצאות מהאבחון: הדרכה אישית, משימות אוטומטיות, סוכנים ותוכנות"
        >
          <circle className="lens__ring" cx="150" cy="150" r="108" pathLength={1} />
          {PATHS.map((p, i) => (
            <line
              key={p.label}
              className={`lens__spoke lens__spoke--${i + 1}${active === i ? ' is-active' : ''}`}
              x1="150"
              y1="150"
              x2={p.x}
              y2={p.y}
              pathLength={1}
            />
          ))}
          <circle className="lens__center" cx="150" cy="150" r="24" />
          {PATHS.map((p, i) => (
            <circle
              key={p.label}
              className={`lens__node lens__node--${i + 1}${active === i ? ' is-active' : ''}`}
              cx={p.x}
              cy={p.y}
              r="17"
            />
          ))}
        </svg>

        {PATHS.map((p, i) => (
          <span
            key={p.label}
            className={`lens__hit lens__hit--${i + 1}`}
            aria-hidden="true"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => {
              setHovered(-1)
              setCycled(i)
            }}
          />
        ))}

        {PATHS.map((p, i) => (
          <span key={p.label} className={`lens__label lens__label--${i + 1}${active === i ? ' is-active' : ''}`}>
            {p.label}
          </span>
        ))}
      </div>
    </div>
  )
}
