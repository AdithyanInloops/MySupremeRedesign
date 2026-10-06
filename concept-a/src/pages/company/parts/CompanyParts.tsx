import { useState, type ReactNode } from 'react'
import { Alert, Box, Button, Stack, Typography, type SxProps, type Theme } from '@mui/material'
import CloudUploadOutlined from '@mui/icons-material/CloudUploadOutlined'
import InsertDriveFileOutlined from '@mui/icons-material/InsertDriveFileOutlined'
import CloseRounded from '@mui/icons-material/CloseRounded'
import { tokens } from '../../../theme'
import { Container } from '../../../components/ui'
import { Breadcrumbs, type Crumb } from '../../../components/Shared'

const c = tokens.color

/** Photo hero shared by the company / content template family. */
export function CompanyHero({
  eyebrow, title, body, image, actions, crumbs, aside, tone = 'navy',
}: { eyebrow?: ReactNode; title: ReactNode; body?: ReactNode; image?: string; actions?: ReactNode; crumbs?: Crumb[]; aside?: ReactNode; tone?: 'navy' | 'light' }) {
  const dark = tone === 'navy'
  return (
    <Box sx={{ position: 'relative', overflow: 'hidden', bgcolor: dark ? c.navyDark : '#fff', color: dark ? '#fff' : c.ink, borderBottom: dark ? 0 : `1px solid ${c.line}` }}>
      {image && (
        <>
          <Box component="img" src={image} alt="" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: dark ? 0.42 : 1 }} />
          <Box sx={{ position: 'absolute', inset: 0, background: dark ? `linear-gradient(100deg, ${c.navyDark} 18%, rgba(27,25,80,.75) 55%, rgba(27,25,80,.25))` : 'linear-gradient(100deg, #fff 35%, rgba(255,255,255,.6) 65%, rgba(255,255,255,0))' }} />
        </>
      )}
      <Container sx={{ position: 'relative', py: { xs: 4, md: 8 } }}>
        {crumbs && <Breadcrumbs items={crumbs} sx={{ mb: 2, '& a, & span, & svg': dark ? { color: 'rgba(255,255,255,.85) !important' } : {} }} />}
        <Box sx={{ display: 'grid', gap: 4, gridTemplateColumns: { xs: '1fr', lg: aside ? '1.2fr 1fr' : '1fr' }, alignItems: 'center' }}>
          <Box sx={{ maxWidth: 680 }}>
            {eyebrow && <Typography variant="overline" sx={{ color: dark ? c.saffron : c.red, display: 'block', mb: 1 }}>{eyebrow}</Typography>}
            <Typography variant="h1" component="h1" sx={{ color: dark ? '#fff' : c.ink }}>{title}</Typography>
            {body && <Typography sx={{ mt: 2, fontSize: { xs: 15, md: 17 }, opacity: dark ? 0.88 : 1, color: dark ? '#fff' : c.text2, maxWidth: 600 }}>{body}</Typography>}
            {actions && <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 3.5 }}>{actions}</Stack>}
          </Box>
          {aside}
        </Box>
      </Container>
    </Box>
  )
}

/** Icon + title + body feature card. */
export function FeatureCard({ icon, title, body, sx }: { icon: ReactNode; title: string; body: ReactNode; sx?: SxProps<Theme> }) {
  return (
    <Box sx={{ p: { xs: 2.5, md: 3 }, bgcolor: '#fff', border: `1px solid ${c.line}`, borderRadius: `${tokens.radius.lg}px`, height: '100%', ...((sx as object) ?? {}) }}>
      <Box sx={{ width: 48, height: 48, borderRadius: `${tokens.radius.md}px`, bgcolor: c.redTint, color: c.red, display: 'grid', placeItems: 'center', mb: 2, '& svg': { fontSize: 26 } }}>{icon}</Box>
      <Typography variant="h5" component="h3" sx={{ mb: 0.75 }}>{title}</Typography>
      <Typography variant="body2" color="text.secondary">{body}</Typography>
    </Box>
  )
}

/** File upload drop zone (form field). */
export function FileDrop({ label, hint, error, accept }: { label: string; hint?: string; error?: string; accept?: string }) {
  const [file, setFile] = useState<string | null>(null)
  return (
    <Box>
      <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 0.75 }}>{label}</Typography>
      {file ? (
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ p: 1.5, border: `1px solid ${c.line2}`, borderRadius: `${tokens.radius.sm}px`, bgcolor: c.successTint }}>
          <InsertDriveFileOutlined sx={{ color: c.successText }} />
          <Typography sx={{ flex: 1, fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file}</Typography>
          <Button size="small" startIcon={<CloseRounded />} onClick={() => setFile(null)} sx={{ color: c.text2 }}>Remove</Button>
        </Stack>
      ) : (
        <Box
          component="label"
          sx={{
            display: 'flex', alignItems: 'center', gap: 1.5, p: 2, minHeight: 64, cursor: 'pointer', borderRadius: `${tokens.radius.sm}px`,
            border: `2px dashed ${error ? c.error : c.line2}`, bgcolor: error ? c.errorTint : c.bg, '&:hover': { borderColor: c.navy, bgcolor: c.navyTint },
            '&:focus-within': { outline: `3px solid ${c.navy}`, outlineOffset: 2 },
          }}
        >
          <CloudUploadOutlined sx={{ color: c.navy }} />
          <Box>
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Choose a file or drag it here</Typography>
            {hint && <Typography variant="caption" color="text.secondary">{hint}</Typography>}
          </Box>
          <input type="file" accept={accept} style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }} onChange={(e) => setFile(e.target.files?.[0]?.name ?? 'catalogue.pdf')} />
        </Box>
      )}
      {error && !file && <Typography sx={{ color: c.error, fontSize: 12, mt: 0.5, ml: 1.75 }}>{error}</Typography>}
    </Box>
  )
}

/** Success panel shown after a form submits. */
export function FormSuccess({ title, body, onReset }: { title: string; body: string; onReset: () => void }) {
  return (
    <Box sx={{ textAlign: 'center', py: { xs: 4, md: 6 } }}>
      <Alert severity="success" sx={{ justifyContent: 'center', mb: 2, borderRadius: `${tokens.radius.sm}px` }}>{title}</Alert>
      <Typography color="text.secondary" sx={{ mb: 3, maxWidth: 440, mx: 'auto' }}>{body}</Typography>
      <Button variant="outlined" color="secondary" onClick={onReset}>Send another</Button>
    </Box>
  )
}

/** Navy CTA band used at the bottom of company pages. */
export function CtaBand({ title, body, actions }: { title: string; body: string; actions: ReactNode }) {
  return (
    <Container sx={{ my: { xs: 5, md: 8 } }}>
      <Box sx={{ position: 'relative', overflow: 'hidden', bgcolor: c.red, color: '#fff', borderRadius: `${tokens.radius.xl}px`, p: { xs: 3, md: 6 }, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: { md: 'center' }, justifyContent: 'space-between' }}>
        <Box sx={{ position: 'absolute', right: -60, top: -60, width: 260, height: 260, borderRadius: '50%', bgcolor: 'rgba(255,255,255,.08)' }} />
        <Box sx={{ position: 'relative', maxWidth: 640 }}>
          <Typography variant="h2" sx={{ color: '#fff' }}>{title}</Typography>
          <Typography sx={{ mt: 1, opacity: 0.92 }}>{body}</Typography>
        </Box>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ position: 'relative', flexShrink: 0 }}>{actions}</Stack>
      </Box>
    </Container>
  )
}

export const whiteBtn = { bgcolor: '#fff', color: c.red, '&:hover': { bgcolor: c.redTint } }
export const ghostBtn = { color: '#fff', borderColor: 'rgba(255,255,255,.7)', '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,.1)' } }

/** Small purple label for content built in Plasmic. */
export function PlasmicNote({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', p: 1.5, borderRadius: `${tokens.radius.sm}px`, bgcolor: '#F5F3FF', border: '1px dashed #8B5CF6', color: '#5B21B6', fontSize: 13 }}>
      <Box component="span" sx={{ fontWeight: 800 }}>Plasmic template ·</Box> {children}
    </Box>
  )
}
