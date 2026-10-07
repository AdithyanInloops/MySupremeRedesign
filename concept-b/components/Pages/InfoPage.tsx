import type { ReactNode } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Box, Button, Typography } from '@mui/material'
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined'
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded'
import { colors, radius } from '../../lib/theme'
import PageHeader from '../ui/PageHeader'
import { PageContainer } from '../ui/Section'
import { PHONE, PHONE_HREF } from '../Layout/Header'

/**
 * Long-form content template (CMS pages, policies, blog index). Readable measure, a help card alongside, and the
 * same header as every other page. Full copy comes from the Magento CMS on the live site.
 */
export default function InfoPage({ eyebrow, title, lead, children, aside }: { eyebrow: string; title: string; lead?: string; children?: ReactNode; aside?: ReactNode }) {
  return (
    <PageContainer sx={{ pb: { xs: 5, md: 9 } }}>
      <Head><title>{`${title} | MySupreme`}</title></Head>
      <PageHeader breadcrumbs={[{ label: 'Home', href: '/' }, { label: title }]} eyebrow={eyebrow} title={title} description={lead} />
      <Box sx={{ display: 'grid', gap: { xs: 3, md: 6 }, gridTemplateColumns: { xs: 'minmax(0,1fr)', md: 'minmax(0,1fr) 320px' }, alignItems: 'start' }}>
        <Box sx={{ maxWidth: 720, color: colors.ink700, fontSize: 16, lineHeight: 1.75, '& p': { mt: 0, mb: 2 }, '& h2': { color: colors.ink, fontSize: 21, fontWeight: 600, mt: 4, mb: 1.5 }, '& ul': { pl: 3, mb: 2 } }}>
          {children}
          <Box sx={{ mt: 4, p: 2.5, borderRadius: radius.lg, bgcolor: colors.subtle, border: `1px dashed ${colors.line2}` }}>
            {/* TODO(content): render this page's Magento CMS block here. */}
            <Typography sx={{ fontSize: 14, color: colors.ink600 }}>The full text of this page is managed in the Magento CMS and appears here on the live site.</Typography>
          </Box>
        </Box>
        <Box component="aside" sx={{ position: { md: 'sticky' }, top: { md: 180 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {aside}
          <Box sx={{ p: 2.5, borderRadius: radius.xl, border: `1px solid ${colors.line}` }}>
            <Typography component="h2" variant="h4">Questions?</Typography>
            <Typography sx={{ fontSize: 14, color: colors.ink600, mt: 0.5, mb: 2 }}>Our team answers Mon–Sat, 9am–6pm.</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button component="a" href={PHONE_HREF} variant="outlined" startIcon={<PhoneOutlinedIcon />} fullWidth>{PHONE}</Button>
              <Button component={Link} href="/service/contact-us" variant="outlined" startIcon={<MailOutlineRoundedIcon />} fullWidth>Contact us</Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </PageContainer>
  )
}
