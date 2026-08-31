import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import './Newspaper.css'

const PAGES = [1, 2, 3, 4].map(
  (n) => `${import.meta.env.BASE_URL}newspaper/page-${n}.webp`,
)
const PDF_URL = `${import.meta.env.BASE_URL}newspaper/Liran-Friedman-Career-Newspaper.pdf`
const LEAVES = [
  { front: PAGES[0], back: PAGES[1] },
  { front: PAGES[2], back: PAGES[3] },
]
const SPREAD_LABELS = ['1', '2–3', '4']

let audioContext: AudioContext | null = null

function playPageRustle() {
  try {
    audioContext ??= new AudioContext()
    const ctx = audioContext
    if (ctx.state === 'suspended') void ctx.resume()
    const duration = 0.45
    const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) {
      const t = i / data.length
      const slide = Math.exp(-Math.pow((t - 0.1) * 6, 2))
      const settle = Math.exp(-Math.pow((t - 0.72) * 14, 2)) * 0.7
      data[i] = (Math.random() * 2 - 1) * (slide + settle) * Math.pow(1 - t, 1.5)
    }
    const source = ctx.createBufferSource()
    source.buffer = buffer
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.Q.value = 0.7
    filter.frequency.setValueAtTime(700, ctx.currentTime)
    filter.frequency.exponentialRampToValueAtTime(2600, ctx.currentTime + 0.2)
    const gain = ctx.createGain()
    gain.gain.value = 0.3
    source.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    source.start()
  } catch {
    /* the flip still happens silently */
  }
}

function useIsSpread() {
  const [isSpread, setIsSpread] = useState(
    () => window.matchMedia('(min-width: 860px)').matches,
  )
  useEffect(() => {
    const query = window.matchMedia('(min-width: 860px)')
    const onChange = (event: MediaQueryListEvent) => setIsSpread(event.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])
  return isSpread
}

export function NewspaperButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        className="btn btn--orange nav__about"
        onClick={() => setOpen(true)}
      >
        עליי
      </button>
      {open && <NewspaperModal onClose={() => setOpen(false)} />}
    </>
  )
}

function NewspaperModal({ onClose }: { onClose: () => void }) {
  const isSpread = useIsSpread()
  const [layout, setLayout] = useState(isSpread)
  const [step, setStep] = useState(0)
  const [flippingLeaf, setFlippingLeaf] = useState(-1)
  const closeRef = useRef<HTMLButtonElement>(null)
  const touchStartX = useRef(0)
  const lastStep = isSpread ? LEAVES.length : PAGES.length - 1

  if (layout !== isSpread) {
    setLayout(isSpread)
    setStep(0)
    setFlippingLeaf(-1)
  }

  const go = useCallback(
    (direction: 1 | -1) => {
      setStep((current) => {
        const next = current + direction
        if (next < 0 || next > lastStep) return current
        playPageRustle()
        if (isSpread) setFlippingLeaf(direction === 1 ? current : next)
        return next
      })
    },
    [isSpread, lastStep],
  )

  useEffect(() => {
    closeRef.current?.focus()
    for (const src of PAGES) new Image().src = src

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') go(1)
      if (event.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [go, onClose])

  return createPortal(
    <div className="newspaper" role="dialog" aria-modal="true" aria-label="עליי">
      <div className="newspaper__backdrop" onClick={onClose} />

      <div className="newspaper__scene" dir="ltr">
        <div className="newspaper__tools">
          <a href={PDF_URL} download className="newspaper__download">
            PDF
          </a>
          <button
            ref={closeRef}
            type="button"
            className="newspaper__glass-btn"
            aria-label="סגירה"
            onClick={onClose}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="newspaper__stage">
          <button
            type="button"
            className="newspaper__glass-btn newspaper__arrow"
            aria-label="עמוד קודם"
            disabled={step === 0}
            onClick={() => go(-1)}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <path
                d="M14.5 5.5L8 12l6.5 6.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {isSpread ? (
            <div className="newspaper__spin"><div
              className={`newspaper__book${
                step === 0
                  ? ' newspaper__book--closed'
                  : step === lastStep
                    ? ' newspaper__book--ended'
                    : ''
              }`}
              aria-live="polite"
            >
              {LEAVES.map((leaf, i) => {
                const turned = i < step
                return (
                  <div
                    key={leaf.front}
                    className={`newspaper__leaf${turned ? ' is-turned' : ''}${
                      flippingLeaf === i ? ' is-flipping' : ''
                    }`}
                    style={{
                      zIndex:
                        flippingLeaf === i
                          ? 40
                          : turned
                            ? 10 + i
                            : 10 + LEAVES.length - i,
                    }}
                    onTransitionEnd={() =>
                      setFlippingLeaf((f) => (f === i ? -1 : f))
                    }
                  >
                    <div className="newspaper__face newspaper__face--front">
                      <img src={leaf.front} alt="" draggable={false} />
                    </div>
                    <div className="newspaper__face newspaper__face--back">
                      <img src={leaf.back} alt="" draggable={false} />
                    </div>
                  </div>
                )
              })}
            </div></div>
          ) : (
            <div
              className="newspaper__single"
              onTouchStart={(e) => {
                touchStartX.current = e.touches[0].clientX
              }}
              onTouchEnd={(e) => {
                const delta = e.changedTouches[0].clientX - touchStartX.current
                if (Math.abs(delta) > 48) go(delta < 0 ? 1 : -1)
              }}
            >
              <img
                key={step}
                src={PAGES[step]}
                alt={`העיתון, עמוד ${step + 1} מתוך ${PAGES.length}`}
                className="newspaper__single-page"
                draggable={false}
              />
            </div>
          )}

          <button
            type="button"
            className="newspaper__glass-btn newspaper__arrow"
            aria-label="עמוד הבא"
            disabled={step === lastStep}
            onClick={() => go(1)}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <path
                d="M9.5 5.5L16 12l-6.5 6.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <footer className="newspaper__folio">
          <span className="newspaper__pager">
            {isSpread ? SPREAD_LABELS[step] : step + 1} / {PAGES.length}
          </span>
        </footer>
      </div>
    </div>,
    document.body,
  )
}
