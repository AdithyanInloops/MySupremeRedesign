import { useState } from 'react'
import { Avatar, Box, Button, Dialog, DialogContent, IconButton, LinearProgress, Rating as MuiRating, Stack, TextField, Typography } from '@mui/material'
import CloseRounded from '@mui/icons-material/CloseRounded'
import VerifiedRounded from '@mui/icons-material/VerifiedRounded'
import RateReviewOutlined from '@mui/icons-material/RateReviewOutlined'
import { tokens } from '../../../theme'
import type { Product } from '../../../data/catalog'
import { useApp } from '../../../state/AppState'
import { Rating } from '../../../components/Commerce'

const c = tokens.color

const sample = [
  { who: 'Marco D.', biz: 'Trattoria Nonna, Oakville', stars: 5, date: 'Sep 28, 2026', title: 'Consistent every delivery', body: 'We go through four cases a week. Always arrives on the morning route, never crushed. Price beats our old distributor.' },
  { who: 'Aisha K.', biz: 'Chai & Co. Café, Brampton', stars: 4, date: 'Sep 14, 2026', title: 'Good value, case size is right', body: 'Exactly what we needed for the café. Would love a smaller pack option for slower weeks.' },
  { who: 'Daniel W.', biz: 'Smoke Yard BBQ food truck, Hamilton', stars: 5, date: 'Aug 30, 2026', title: 'Reorder every month', body: 'Easy to find by SKU and the reorder button saves me 20 minutes. Great quality.' },
]

export default function Reviews({ product }: { product: Product }) {
  const { review, toast } = useApp()
  const [open, setOpen] = useState(false)
  const [stars, setStars] = useState<number | null>(0)
  const [err, setErr] = useState(false)
  const has = product.reviews > 0
  const dist = [0.68, 0.2, 0.07, 0.03, 0.02]

  const writeBtn = (
    <Button variant="outlined" color="secondary" startIcon={<RateReviewOutlined />} onClick={() => setOpen(true)}>
      Write a review
    </Button>
  )

  return (
    <Box>
      {has ? (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '280px 1fr' }, gap: { xs: 3, md: 5 } }}>
          <Box>
            <Typography sx={{ fontSize: 48, fontWeight: 800, lineHeight: 1, color: c.ink }}>{product.rating.toFixed(1)}</Typography>
            <Box sx={{ my: 1 }}><Rating value={product.rating} count={product.reviews} size={20} /></Box>
            <Stack spacing={0.75} sx={{ mt: 2, mb: 2.5 }}>
              {dist.map((d, k) => (
                <Stack key={k} direction="row" spacing={1} alignItems="center">
                  <Typography sx={{ fontSize: 12.5, width: 40, color: c.text2 }}>{5 - k} star</Typography>
                  <LinearProgress variant="determinate" value={d * 100} sx={{ flex: 1, height: 8, borderRadius: 4, bgcolor: c.surface2, '& .MuiLinearProgress-bar': { bgcolor: '#E89B00', borderRadius: 4 } }} />
                  <Typography sx={{ fontSize: 12.5, width: 28, textAlign: 'right', color: c.text3 }}>{Math.round(d * product.reviews)}</Typography>
                </Stack>
              ))}
            </Stack>
            {writeBtn}
          </Box>
          <Stack spacing={2}>
            {sample.slice(0, Math.min(3, product.reviews)).map((r) => (
              <Box key={r.who} sx={{ p: 2.5, borderRadius: `${tokens.radius.md}px`, border: `1px solid ${c.line}`, bgcolor: '#fff' }}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                  <Avatar sx={{ bgcolor: c.navyTint, color: c.navy, fontWeight: 700, width: 40, height: 40, fontSize: 14 }}>{r.who.split(' ').map((w) => w[0]).join('')}</Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{r.who} <Box component="span" sx={{ color: c.text3, fontWeight: 400 }}>· {r.biz}</Box></Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <MuiRating value={r.stars} readOnly size="small" />
                      <Typography sx={{ fontSize: 12, color: c.successText, display: 'flex', alignItems: 'center', gap: 0.25, fontWeight: 600 }}><VerifiedRounded sx={{ fontSize: 14 }} /> Verified buyer</Typography>
                    </Stack>
                  </Box>
                  <Typography sx={{ fontSize: 12, color: c.text3, flexShrink: 0 }}>{r.date}</Typography>
                </Stack>
                <Typography sx={{ fontWeight: 700, fontSize: 15 }}>{r.title}</Typography>
                <Typography sx={{ fontSize: 14, color: c.text2, mt: 0.5 }}>{r.body}</Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center', py: 5, px: 2, bgcolor: c.bg, borderRadius: `${tokens.radius.md}px` }}>
          <Typography variant="h4">No reviews yet</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5, mb: 2.5 }}>Bought this for your kitchen? Help other chefs decide.</Typography>
          {writeBtn}
        </Box>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogContent sx={{ p: { xs: 2.5, md: 4 } }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="h3">Write a review</Typography>
            <IconButton aria-label="Close" onClick={() => setOpen(false)}><CloseRounded /></IconButton>
          </Stack>
          <Typography color="text.secondary" sx={{ mb: 2.5, fontSize: 14 }}>{product.name}</Typography>
          <Typography sx={{ fontWeight: 600, fontSize: 14, mb: 0.5 }}>Your rating *</Typography>
          <MuiRating value={stars} onChange={(_, v) => { setStars(v); setErr(false) }} size="large" sx={{ mb: err ? 0 : 2, '& .MuiRating-icon': { fontSize: 40 } }} />
          {err && <Typography sx={{ color: c.error, fontSize: 12.5, mb: 2 }}>Please choose a star rating</Typography>}
          <Stack spacing={2}>
            <TextField label="Nickname" defaultValue={review.signedIn ? 'Priya R.' : ''} fullWidth />
            <TextField label="Review title" placeholder="e.g. Great for our lunch rush" fullWidth />
            <TextField label="Your review" multiline minRows={4} placeholder="How did it work in your kitchen?" fullWidth />
          </Stack>
          <Stack direction="row" spacing={1.5} justifyContent="flex-end" sx={{ mt: 3 }}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={() => {
                if (!stars) return setErr(true)
                setOpen(false)
                toast('Thanks! Your review will appear after moderation.')
              }}
            >
              Submit review
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  )
}
