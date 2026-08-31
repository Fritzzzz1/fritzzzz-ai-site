import { useCallback, useEffect, useRef, useState } from 'react'

interface MapZoomOptions {
  maxScale?: number
  onZoomToggle?: (direction: 1 | -1) => void
}

export function useMapZoom(enabled: boolean, options: MapZoomOptions = {}) {
  const { maxScale = 3, onZoomToggle } = options
  const [zoomed, setZoomed] = useState(false)
  const [dragging, setDragging] = useState(false)
  const zoomedRef = useRef(false)
  const el = useRef<HTMLDivElement>(null)
  const state = useRef({
    s: 1,
    tx: 0,
    ty: 0,
    ts: 1,
    ttx: 0,
    tty: 0,
    raf: 0,
    dragging: false,
    moved: 0,
    px: 0,
    py: 0,
  })

  const ensureFrame = useCallback(() => {
    const a = state.current
    if (a.raf) return
    const instant = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const tick = () => {
      const node = el.current
      if (!node) {
        a.raf = 0
        return
      }
      const k = instant ? 1 : a.dragging ? 0.5 : 0.18
      a.s += (a.ts - a.s) * k
      a.tx += (a.ttx - a.tx) * k
      a.ty += (a.tty - a.ty) * k
      node.style.transform = `translate(${a.tx}px, ${a.ty}px) scale(${a.s})`
      const settled =
        Math.abs(a.ts - a.s) < 0.001 &&
        Math.abs(a.ttx - a.tx) < 0.4 &&
        Math.abs(a.tty - a.ty) < 0.4
      if (settled) {
        if (a.ts === 1) {
          node.style.transform = ''
          a.s = 1
          a.tx = 0
          a.ty = 0
        }
        a.raf = 0
        return
      }
      a.raf = requestAnimationFrame(tick)
    }
    a.raf = requestAnimationFrame(tick)
  }, [])

  const setZoomFlag = useCallback((target: number) => {
    const isZoomed = target > 1.02
    if (isZoomed !== zoomedRef.current) {
      zoomedRef.current = isZoomed
      setZoomed(isZoomed)
      onZoomToggle?.(isZoomed ? 1 : -1)
    }
  }, [onZoomToggle])

  const baseBox = useCallback(() => {
    const a = state.current
    const rect = el.current!.getBoundingClientRect()
    return {
      left: rect.left - a.tx,
      top: rect.top - a.ty,
      width: rect.width / a.s,
      height: rect.height / a.s,
    }
  }, [])

  const clampPan = (t: number, scale: number, size: number) =>
    Math.min(0, Math.max(size * (1 - scale), t))

  const zoomAbout = useCallback(
    (clientX: number, clientY: number, rawScale: number) => {
      if (!el.current) return
      const a = state.current
      const box = baseBox()
      const scale = Math.min(maxScale, Math.max(1, rawScale))
      const cx = clientX - box.left
      const cy = clientY - box.top
      const qx = (cx - a.ttx) / a.ts
      const qy = (cy - a.tty) / a.ts
      a.ts = scale
      a.ttx = clampPan(cx - qx * scale, scale, box.width)
      a.tty = clampPan(cy - qy * scale, scale, box.height)
      setZoomFlag(scale)
      ensureFrame()
    },
    [baseBox, ensureFrame, setZoomFlag, maxScale],
  )

  const reset = useCallback(() => {
    const a = state.current
    a.ts = 1
    a.ttx = 0
    a.tty = 0
    setZoomFlag(1)
    ensureFrame()
  }, [ensureFrame, setZoomFlag])

  const stepZoom = useCallback(
    (event: React.MouseEvent) => {
      const a = state.current
      const next = a.ts < 1.5 ? 1.9 : a.ts < 2.4 ? 2.8 : 1
      if (next === 1) reset()
      else zoomAbout(event.clientX, event.clientY, next)
    },
    [reset, zoomAbout],
  )

  const onPointerDown = useCallback((event: React.PointerEvent) => {
    const a = state.current
    a.dragging = true
    setDragging(true)
    a.moved = 0
    a.px = event.clientX
    a.py = event.clientY
    event.currentTarget.setPointerCapture(event.pointerId)
  }, [])

  const onPointerMove = useCallback(
    (event: React.PointerEvent) => {
      const a = state.current
      if (!a.dragging) return
      const dx = event.clientX - a.px
      const dy = event.clientY - a.py
      a.px = event.clientX
      a.py = event.clientY
      a.moved += Math.abs(dx) + Math.abs(dy)
      const box = baseBox()
      a.ttx = clampPan(a.ttx + dx, a.ts, box.width)
      a.tty = clampPan(a.tty + dy, a.ts, box.height)
      ensureFrame()
    },
    [baseBox, ensureFrame],
  )

  const onPointerUp = useCallback(() => {
    const a = state.current
    a.dragging = false
    setDragging(false)
  }, [])

  const movedRef = useCallback(() => state.current.moved, [])

  const zoomBy = useCallback(
    (factor: number) => {
      const node = el.current
      if (!node) return
      const rect = node.getBoundingClientRect()
      zoomAbout(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        state.current.ts * factor,
      )
    },
    [zoomAbout],
  )

  useEffect(() => {
    if (!enabled) return
    const node = el.current
    if (!node) return
    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      const a = state.current
      const factor = Math.exp(-event.deltaY * (event.ctrlKey ? 0.012 : 0.0022))
      zoomAbout(event.clientX, event.clientY, a.ts * factor)
    }
    node.addEventListener('wheel', onWheel, { passive: false })
    return () => node.removeEventListener('wheel', onWheel)
  }, [enabled, zoomAbout])

  useEffect(() => {
    const a = state.current
    return () => {
      if (a.raf) cancelAnimationFrame(a.raf)
    }
  }, [])

  return {
    el,
    zoomed,
    dragging,
    zoomedRef,
    reset,
    stepZoom,
    zoomBy,
    movedRef,
    onPointerDown,
    onPointerMove,
    onPointerUp,
  }
}
