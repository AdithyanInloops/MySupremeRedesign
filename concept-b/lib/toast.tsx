import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { Box, Button, IconButton, Slide, Snackbar, Typography } from '@mui/material'
import { colors, radius, shadow, z } from './theme'
import { AlertCircleIcon, CheckCircleIcon, CloseIcon, InfoIcon } from '../components/ui/icons'

/**
 * One toast at a time, always answering "what happened → what changed → what can I do now".
 * `message` says what happened; `description` adds the detail; `action` offers the next step
 * (View cart, Undo…). Dark surface so it never blends into page content.
 */

export type ToastSeverity = 'success' | 'info' | 'error'
export type ToastAction = { label: string; href?: string; onClick?: () => void }
export type ToastOptions = { message: string; description?: string; severity?: ToastSeverity; action?: ToastAction; duration?: number }

type Ctx = { toast: (t: ToastOptions) => void; notify: (message: string, severity?: ToastSeverity) => void }
const ToastCtx = createContext<Ctx | null>(null)

const icons = {
  success: <CheckCircleIcon sx={{ color: '#34D399', fontSize: 22 }} />,
  info: <InfoIcon sx={{ color: '#93C5FD', fontSize: 22 }} />,
  error: <AlertCircleIcon sx={{ color: '#FCA5A5', fontSize: 22 }} />,
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<(ToastOptions & { key: number }) | null>(null)
  const [open, setOpen] = useState(false)

  const toast = useCallback((t: ToastOptions) => {
    setCurrent({ ...t, key: Date.now() + Math.random() })
    setOpen(true)
  }, [])
  const notify = useCallback((message: string, severity: ToastSeverity = 'success') => toast({ message, severity }), [toast])
  const value = useMemo(() => ({ toast, notify }), [toast, notify])

  const close = (_?: unknown, reason?: string) => {
    if (reason === 'clickaway') return
    setOpen(false)
  }
  const sev = current?.severity ?? 'success'
  const action = current?.action

  return (
    <ToastCtx.Provider value={value}>
      {children}
      <Snackbar
        key={current?.key}
        open={open}
        onClose={close}
        autoHideDuration={current?.duration ?? (action ? 6000 : 4000)}
        TransitionComponent={Slide}
        TransitionProps={{ direction: 'up' } as object}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        // Mobile: sit above the floating voice/chat buttons and any sticky bottom bar.
        sx={{ zIndex: z.toast, bottom: { xs: 'calc(88px + var(--sticky-bottom))', md: 'calc(24px + var(--sticky-bottom))' }, left: { xs: 12 }, right: { xs: 12 } }}
      >
        <Box
          role={sev === 'error' ? 'alert' : 'status'}
          aria-live={sev === 'error' ? 'assertive' : 'polite'}
          sx={{
            display: 'flex', alignItems: 'center', gap: 1.5, width: { xs: '100%', md: 'auto' }, minWidth: { md: 360 }, maxWidth: 520,
            bgcolor: colors.ink, color: '#fff', borderRadius: radius.lg, boxShadow: shadow.lg, pl: 2, pr: 1, py: 1.25,
          }}
        >
          <Box sx={{ display: 'flex', flexShrink: 0 }}>{icons[sev]}</Box>
          <Box sx={{ minWidth: 0, flex: 1, py: 0.25 }}>
            <Typography sx={{ fontSize: 14.5, fontWeight: 600, lineHeight: 1.35 }}>{current?.message}</Typography>
            {current?.description && (
              <Typography sx={{ fontSize: 13, color: 'rgba(255,255,255,.72)', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {current.description}
              </Typography>
            )}
          </Box>
          {action && (
            <Button
              {...(action.href ? { component: Link, href: action.href } : {})}
              onClick={() => { action.onClick?.(); setOpen(false) }}
              size="small"
              sx={{ flexShrink: 0, color: '#fff', bgcolor: 'rgba(255,255,255,.12)', '&:hover': { bgcolor: 'rgba(255,255,255,.2)' }, '&.Mui-focusVisible': { outline: '2px solid #fff' } }}
            >
              {action.label}
            </Button>
          )}
          <IconButton aria-label="Dismiss notification" onClick={() => setOpen(false)} size="small" sx={{ flexShrink: 0, color: 'rgba(255,255,255,.7)', '&:hover': { bgcolor: 'rgba(255,255,255,.1)', color: '#fff' }, '&.Mui-focusVisible': { outline: '2px solid #fff' } }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Snackbar>
    </ToastCtx.Provider>
  )
}

export function useToast() {
  const c = useContext(ToastCtx)
  if (!c) throw new Error('useToast outside ToastProvider')
  return c
}
