import { useEffect, useRef, useState } from 'react'
import { useInView } from '../hooks/useInView'
import './Lens.css'

const PATHS = [
  { label: 'הדרכה אישית', x: 56, y: 56 },
  { label: 'משימות אוטומטיות', x: 244, y: 56 },
  { label: 'סוכנים ותוכנות', x: 150, y: 282 },
]

const INTRO_MS = 2200
const CYCLE_MS = 2800
const TURN_MS = 120000
const CENTER = 150
const BOX_MIN = -40
const BOX_SIZE = 380
const LABEL_GAP = 30

function useDrift(
  stage: React.RefObject<HTMLDivElement | null>,
  labels: React.RefObject<(HTMLSpanElement | null)[]>,
  enabled: boolean,
) {
  useEffect(() => {
    if (!enabled) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      place(0)
      return
    }
    let frame = 0
    const started = performance.now()
    const tick = (now: number) => {
      place(((now - started) / TURN_MS) * 2 * Math.PI)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)

    function place(angle: number) {
      if (stage.current) stage.current.style.rotate = `${(angle * 180) / Math.PI}deg`
      const cos = Math.cos(angle)
      const sin = Math.sin(angle)
      PATHS.forEach((p, i) => {
        const el = labels.current?.[i]
        if (!el) return
        const dx = p.x - CENTER
        const dy = p.y - CENTER
        const len = Math.hypot(dx, dy)
        const ux = (dx * cos - dy * sin) / len
        const uy = (dx * sin + dy * cos) / len
        const ax = CENTER + ux * (len + LABEL_GAP)
        const ay = CENTER + uy * (len + LABEL_GAP)
        el.style.left = `${((ax - BOX_MIN) / BOX_SIZE) * 100}%`
        el.style.top = `${((ay - BOX_MIN) / BOX_SIZE) * 100}%`
        el.style.transform = `translate(${-50 + 50 * ux}%, ${-50 + 50 * uy}%)`
      })
    }
  }, [stage, labels, enabled])
}

function usePathCycle(paused: boolean, enabled: boolean) {
  const [active, setActive] = useState(-1)
  const beforeIntro = active === -1
  useEffect(() => {
    if (!enabled || paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let timer = 0
    const start = window.setTimeout(() => {
      setActive(0)
      timer = window.setInterval(() => setActive((i) => (i + 1) % PATHS.length), CYCLE_MS)
    }, beforeIntro ? INTRO_MS : 0)
    return () => {
      window.clearTimeout(start)
      window.clearInterval(timer)
    }
  }, [paused, enabled, beforeIntro])
  return [active, setActive] as const
}

interface LensProps {
  tone?: 'dark' | 'light'
}

export function Lens({ tone = 'dark' }: LensProps) {
  const { ref, inView } = useInView<HTMLDivElement>(0.35)
  const [hovered, setHovered] = useState(-1)
  const [cycled, setCycled] = usePathCycle(hovered !== -1, inView)
  const active = hovered !== -1 ? hovered : cycled
  const stage = useRef<HTMLDivElement>(null)
  const labels = useRef<(HTMLSpanElement | null)[]>([])
  useDrift(stage, labels, inView)

  return (
    <div
      ref={ref}
      className={`lens${tone === 'light' ? ' lens--on-light' : ''}${inView ? ' is-visible' : ''}`}
    >
      <div className="lens__stage" ref={stage}>
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

      </div>

      <div className="lens__labels">
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
          <span
            key={p.label}
            ref={(el) => {
              labels.current[i] = el
            }}
            className={`lens__label lens__label--${i + 1}${active === i ? ' is-active' : ''}`}
          >
            {p.label}
          </span>
        ))}
      </div>
    </div>
  )
}
