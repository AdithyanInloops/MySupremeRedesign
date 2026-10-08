import { useRef } from 'react'

/**
 * Mouse drag-to-scroll for horizontal swipe areas, so the design can be presented on a laptop with a mouse the way
 * it feels on a phone. Touch and trackpads keep their native scrolling; a drag never triggers the tile underneath.
 */
export function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const state = useRef({ down: false, x: 0, left: 0, moved: false, snap: '' })
  const onPointerDown = (e: React.PointerEvent<T>) => {
    if (e.pointerType !== 'mouse' || e.button !== 0 || !ref.current) return
    const el = ref.current
    state.current = { down: true, x: e.clientX, left: el.scrollLeft, moved: false, snap: el.style.scrollSnapType }
  }
  const onPointerMove = (e: React.PointerEvent<T>) => {
    const s = state.current
    const el = ref.current
    if (!s.down || !el) return
    const dx = e.clientX - s.x
    if (!s.moved && Math.abs(dx) > 5) { s.moved = true; el.style.scrollSnapType = 'none'; el.style.cursor = 'grabbing'; el.setPointerCapture(e.pointerId) }
    if (s.moved) el.scrollLeft = s.left - dx
  }
  const end = (e: React.PointerEvent<T>) => {
    const s = state.current
    const el = ref.current
    if (!s.down || !el) return
    s.down = false
    if (s.moved) {
      el.style.cursor = ''
      el.releasePointerCapture?.(e.pointerId)
      // Let the browser settle on the nearest snap point.
      const left = el.scrollLeft
      el.style.scrollSnapType = s.snap
      el.scrollLeft = left
    }
  }
  const onClickCapture = (e: React.MouseEvent<T>) => {
    if (state.current.moved) { e.preventDefault(); e.stopPropagation(); state.current.moved = false }
  }
  return { ref, onPointerDown, onPointerMove, onPointerUp: end, onPointerCancel: end, onClickCapture, onDragStart: (e: React.DragEvent) => e.preventDefault() }
}
