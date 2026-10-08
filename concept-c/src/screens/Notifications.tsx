import { useEffect, useRef } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Box, Button, Typography } from '@mui/material'
import { tokens, focusRing } from '../theme'
import { useApp } from '../state/app'
import { notifications, type Notice } from '../data/app'
import { TopBar } from '../components/ui'
import { InfoIcon, TagIcon, TruckIcon, WalletIcon, type IconComponent } from '../components/icons'

const c = tokens.color
const KIND: Record<Notice['kind'], { icon: IconComponent; bg: string; fg: string }> = {
  order: { icon: TruckIcon, bg: c.navyTint, fg: c.navy },
  deal: { icon: TagIcon, bg: c.saffronTint, fg: '#8A5A00' },
  account: { icon: WalletIcon, bg: c.errorTint, fg: c.error },
  info: { icon: InfoIcon, bg: c.surface2, fg: c.text2 },
}

export default function Notifications() {
  const { unread, readAll } = useApp()
  // Unread dots stay visible on this visit and clear for the next one.
  const wasUnread = useRef(unread > 0)
  useEffect(() => { const t = window.setTimeout(readAll, 1500); return () => window.clearTimeout(t) }, [readAll])
  return (
    <Box>
      <TopBar title="Notifications" actions={unread ? <Button size="small" onClick={readAll} sx={{ color: c.navy }}>Mark read</Button> : undefined} />
      <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, mt: 1, bgcolor: '#fff', borderTop: `1px solid ${c.line}`, borderBottom: `1px solid ${c.line}` }}>
        {notifications.map((n) => {
          const k = KIND[n.kind]
          const Icon = k.icon
          const isNew = wasUnread.current && n.unread
          const body = (
            <Box sx={{ display: 'flex', gap: 1.5, px: 2, py: 1.75, bgcolor: isNew ? '#FAFAFF' : '#fff' }}>
              <Box sx={{ width: 42, height: 42, borderRadius: '50%', bgcolor: k.bg, color: k.fg, display: 'grid', placeItems: 'center', flexShrink: 0 }}><Icon sx={{ fontSize: 21 }} /></Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                  <Typography sx={{ fontWeight: isNew ? 700 : 600, fontSize: 14.5 }}>{n.title}</Typography>
                  <Typography sx={{ fontSize: 12, color: c.text3, flexShrink: 0 }}>{n.time}</Typography>
                </Box>
                <Typography sx={{ fontSize: 13.5, color: c.text2, mt: 0.25 }}>{n.body}</Typography>
              </Box>
              {isNew && <Box aria-label="Unread" sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: c.red, mt: 0.75, flexShrink: 0 }} />}
            </Box>
          )
          return (
            <Box component="li" key={n.id} sx={{ '& + li': { borderTop: `1px solid ${c.line}` } }}>
              {n.href ? <Box component={RouterLink} to={n.href} sx={{ display: 'block', color: 'inherit', textDecoration: 'none', '&:active': { bgcolor: c.surface2 }, ...focusRing }}>{body}</Box> : body}
            </Box>
          )
        })}
      </Box>
      <Typography sx={{ textAlign: 'center', fontSize: 12.5, color: c.text3, my: 3 }}>Manage alerts in Account › Settings</Typography>
    </Box>
  )
}
