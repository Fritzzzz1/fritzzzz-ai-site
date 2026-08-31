import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useIsSpread } from '../hooks/useIsSpread'
import { useMapZoom } from '../hooks/useMapZoom'
import { playPageRustle, playZoomTick } from './newspaperSounds'
import './Newspaper.css'

const PAGES = [1, 2, 3, 4].map(
  (n) => `${import.meta.env.BASE_URL}newspaper/page-${n}.webp`,
)
const PDF_URL = `${import.meta.env.BASE_URL}newspaper/Liran-Friedman-Career-Newspaper.pdf`
const SPREAD_LABELS = ['1', '2–3', '4']
const LENS_Z = 2.5
const LENS_R = 175

export function NewspaperButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        className="btn btn--newsprint nav__about"
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
  const [mode, setMode] = useState<'zoom' | 'lens'>('zoom')
  const leaves = [
    { front: PAGES[0], back: PAGES[1] },
    { front: PAGES[2], back: PAGES[3] },
  ]
  const closeRef = useRef<HTMLButtonElement>(null)
  const touchStartX = useRef(0)
  const {
    el: zoomAreaEl,
    zoomed: zoomActive,
    dragging: zoomDragging,
    zoomedRef,
    reset: resetZoom,
    stepZoom,
    zoomBy,
    movedRef: zoomMovedRef,
    onPointerDown: onZoomPointerDown,
    onPointerMove: onZoomPointerMove,
    onPointerUp: onZoomPointerUp,
  } = useMapZoom(isSpread && mode === 'zoom', { onZoomToggle: playZoomTick })
  const bookRef = useRef<HTMLDivElement>(null)
  const leafEls = useRef<(HTMLDivElement | null)[]>([])
  const pageDrag = useRef({
    active: false,
    startX: 0,
    leaf: -1,
    dir: 0 as 0 | 1 | -1,
    progress: 0,
    consumed: false,
  })
  const lastStep = isSpread ? 2 : PAGES.length - 1
  const spyglassEl = useRef<HTMLDivElement>(null)
  const spyglassViewEl = useRef<HTMLDivElement>(null)
  const spyglass = useRef({ x: 0, y: 0, tx: 0, ty: 0, visible: false, raf: 0 })

  const spyglassFrame = useCallback(() => {
    const g = spyglass.current
    if (g.raf) return
    const instant = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const tick = () => {
      const node = spyglassEl.current
      const view = spyglassViewEl.current
      const book = bookRef.current
      if (!node || !view || !book) {
        g.raf = 0
        return
      }
      const k = instant ? 1 : 0.28
      g.x += (g.tx - g.x) * k
      g.y += (g.ty - g.y) * k
      const width = book.offsetWidth
      const height = book.offsetHeight
      const inset = 17
      const ox = g.x * LENS_Z - (LENS_R - inset)
      const oy = g.y * LENS_Z - (LENS_R - inset)
      const half = (width / 2) * LENS_Z
      node.style.left = `${g.x - LENS_R}px`
      node.style.top = `${g.y - LENS_R}px`
      view.style.backgroundSize = `${half}px ${height * LENS_Z}px, ${half}px ${height * LENS_Z}px`
      view.style.backgroundPosition = `${-ox}px ${-oy}px, ${half - ox}px ${-oy}px`
      const settled =
        !g.visible ||
        (Math.abs(g.tx - g.x) < 0.3 && Math.abs(g.ty - g.y) < 0.3)
      if (settled) {
        g.raf = 0
        return
      }
      g.raf = requestAnimationFrame(tick)
    }
    g.raf = requestAnimationFrame(tick)
  }, [])

  const onLensMove = useCallback(
    (event: React.MouseEvent) => {
      const book = bookRef.current
      if (!book) return
      const rect = book.getBoundingClientRect()
      const g = spyglass.current
      g.tx = event.clientX - rect.left
      g.ty = event.clientY - rect.top
      if (!g.visible) {
        g.visible = true
        g.x = g.tx
        g.y = g.ty
        spyglassEl.current?.classList.add('is-visible')
      }
      spyglassFrame()
    },
    [spyglassFrame],
  )

  const onLensLeave = useCallback(() => {
    spyglass.current.visible = false
    spyglassEl.current?.classList.remove('is-visible')
  }, [])

  useEffect(() => {
    if (mode !== 'lens') onLensLeave()
  }, [mode, onLensLeave])

  const spreadFor = (side: 'left' | 'right') => {
    const page = side === 'left' ? step * 2 - 1 : step * 2
    return page >= 0 && page < PAGES.length
      ? `url(${PAGES[page]})`
      : 'linear-gradient(transparent, transparent)'
  }

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

  const stepRef = useRef(step)
  useEffect(() => {
    stepRef.current = step
  }, [step])

  const onPagePointerDown = useCallback(
    (event: React.PointerEvent) => {
      if (flippingLeaf !== -1) return
      const d = pageDrag.current
      d.active = true
      d.startX = event.clientX
      d.leaf = -1
      d.dir = 0
      d.progress = 0
      d.consumed = false
      event.currentTarget.setPointerCapture(event.pointerId)
    },
    [flippingLeaf],
  )

  const onPagePointerMove = useCallback((event: React.PointerEvent) => {
    const d = pageDrag.current
    if (!d.active) return
    const dx = event.clientX - d.startX
    if (d.dir === 0) {
      if (Math.abs(dx) < 8) return
      d.dir = dx < 0 ? 1 : -1
      const leaf = d.dir === 1 ? stepRef.current : stepRef.current - 1
      if (leaf < 0 || leaf >= 2) {
        d.dir = 0
        d.active = false
        return
      }
      d.leaf = leaf
      d.consumed = true
    }
    const node = leafEls.current[d.leaf]
    const book = bookRef.current
    if (!node || !book) return
    const faceWidth = book.offsetWidth / 2
    const raw = d.dir === 1 ? -dx : dx
    d.progress = Math.min(1, Math.max(0, raw / (faceWidth * 0.9)))
    const angle =
      d.dir === 1 ? -d.progress * 160 : -180 + d.progress * 160
    node.style.transition = 'none'
    node.style.zIndex = '50'
    node.style.transform = `rotateY(${angle}deg)`
  }, [])

  const onPagePointerUp = useCallback(() => {
    const d = pageDrag.current
    if (!d.active) return
    d.active = false
    if (d.leaf < 0) return
    const node = leafEls.current[d.leaf]
    if (!node) return
    node.style.transition = ''
    if (d.progress > 0.35) {
      go(d.dir as 1 | -1)
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          node.style.transform = ''
          node.style.zIndex = ''
        }),
      )
    } else {
      node.style.transform = ''
      window.setTimeout(() => {
        node.style.zIndex = ''
      }, 950)
    }
  }, [go])

  const onZoomAreaPointerDown = useCallback(
    (event: React.PointerEvent) => {
      if (mode === 'zoom' && zoomedRef.current) onZoomPointerDown(event)
      else onPagePointerDown(event)
    },
    [mode, zoomedRef, onZoomPointerDown, onPagePointerDown],
  )

  const onZoomAreaPointerMove = useCallback(
    (event: React.PointerEvent) => {
      if (mode === 'zoom' && zoomedRef.current) onZoomPointerMove(event)
      else onPagePointerMove(event)
    },
    [mode, zoomedRef, onZoomPointerMove, onPagePointerMove],
  )

  const onZoomAreaPointerUp = useCallback(
    (event: React.PointerEvent) => {
      onZoomPointerUp()
      onPagePointerUp()
      void event
    },
    [onZoomPointerUp, onPagePointerUp],
  )

  const onZoomAreaClick = useCallback(
    (event: React.MouseEvent) => {
      if (pageDrag.current.consumed) {
        pageDrag.current.consumed = false
        return
      }
      if (mode !== 'zoom') return
      if (zoomMovedRef() > 6) return
      stepZoom(event)
    },
    [mode, zoomMovedRef, stepZoom],
  )

  useEffect(() => {
    closeRef.current?.focus()
    for (const src of PAGES) new Image().src = src

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (zoomedRef.current) resetZoom()
        else onClose()
        return
      }
      if (zoomedRef.current) return
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
  }, [go, onClose, zoomedRef, resetZoom])

  return createPortal(
    <div
      className={`newspaper${zoomActive ? ' newspaper--zoomed' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="עליי"
    >
      <div
        className="newspaper__backdrop"
        onClick={zoomActive ? resetZoom : onClose}
      />

      <div className="newspaper__scene" dir="ltr">
        <div className="newspaper__tools">
          {isSpread && (
            <div className="newspaper__modes" role="group" aria-label="מצב קריאה">
              <button
                type="button"
                className={`newspaper__mode${mode === 'zoom' ? ' is-active' : ''}`}
                onClick={() => setMode('zoom')}
              >
                ZOOM
              </button>
              <button
                type="button"
                className={`newspaper__mode${mode === 'lens' ? ' is-active' : ''}`}
                onClick={() => {
                  resetZoom()
                  setMode('lens')
                }}
              >
                LENS
              </button>
            </div>
          )}
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
            <div className="newspaper__spin">
              <div
                ref={zoomAreaEl}
                className={`newspaper__zoom newspaper__zoom--${mode}${
                  zoomActive ? ' is-zoomed' : ''
                }${zoomDragging ? ' is-dragging' : ''}`}
                onClick={onZoomAreaClick}
                onPointerDown={onZoomAreaPointerDown}
                onPointerMove={onZoomAreaPointerMove}
                onPointerUp={onZoomAreaPointerUp}
                onPointerCancel={onZoomAreaPointerUp}
                onMouseMove={mode === 'lens' ? onLensMove : undefined}
                onMouseLeave={mode === 'lens' ? onLensLeave : undefined}
              >
                <div
                  ref={bookRef}
                  className={`newspaper__book${
                    step === 0
                      ? ' newspaper__book--closed'
                      : step === lastStep
                        ? ' newspaper__book--ended'
                        : ''
                  }`}
                  aria-live="polite"
                >
                  {leaves.map((leaf, i) => {
                    const turned = i < step
                    return (
                      <div
                        key={leaf.front}
                        ref={(node) => {
                          leafEls.current[i] = node
                        }}
                        className={`newspaper__leaf${turned ? ' is-turned' : ''}${
                          flippingLeaf === i ? ' is-flipping' : ''
                        }`}
                        style={{
                          zIndex:
                            flippingLeaf === i
                              ? 40
                              : turned
                                ? 10 + i
                                : 12 - i,
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
                  {mode === 'lens' && (
                    <div ref={spyglassEl} className="newspaper__spyglass">
                      <div className="newspaper__spyglass-handle" />
                      <div
                        ref={spyglassViewEl}
                        className="newspaper__spyglass-view"
                        style={{
                          backgroundImage: `${spreadFor('left')}, ${spreadFor('right')}`,
                        }}
                      />
                      <div className="newspaper__spyglass-rim" />
                      <div className="newspaper__spyglass-ring" />
                    </div>
                  )}
                </div>
              </div>
            </div>
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

        {isSpread && mode === 'zoom' && (
          <div className="newspaper__zoomctl">
            <button
              type="button"
              className="newspaper__glass-btn"
              aria-label="הגדלה"
              onClick={() => zoomBy(1.4)}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path
                  d="M12 5v14M5 12h14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <button
              type="button"
              className="newspaper__glass-btn"
              aria-label="הקטנה"
              onClick={() => zoomBy(1 / 1.4)}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path
                  d="M5 12h14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        )}

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

