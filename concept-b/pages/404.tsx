import Head from 'next/head'
import Link from 'next/link'
import { Box, Button, Chip } from '@mui/material'
import { departments } from '../lib/data'
import { PageContainer } from '../components/ui/Section'
import EmptyState from '../components/ui/EmptyState'
import SearchBox from '../components/Layout/SearchBox'
import { SearchXIcon } from '../components/ui/icons'

/** Not found: say what happened, offer search right here, and the most useful ways back. */
export default function NotFound() {
  return (
    <PageContainer>
      <Head><title>Page not found | MySupreme</title></Head>
      <EmptyState
        icon={<SearchXIcon />}
        title="We can’t find that page"
        headingLevel="h1"
        actions={<><Button component={Link} href="/" variant="contained" size="large">Go to the home page</Button><Button component={Link} href="/service/contact-us" variant="outlined" size="large">Contact us</Button></>}
      >
        The link may be old or mistyped. Search for what you need, or pick a department.
        <Box sx={{ maxWidth: 520, mx: 'auto', mt: 3, textAlign: 'left' }}><SearchBox size="lg" /></Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mt: 2.5 }}>
          {departments.map((d) => <Chip key={d.uid} component={Link} href={`/${d.url_key}`} clickable label={d.name} variant="outlined" />)}
        </Box>
      </EmptyState>
    </PageContainer>
  )
}
