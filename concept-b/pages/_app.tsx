import type { AppProps } from 'next/app'
import Head from 'next/head'
import { CssBaseline, ThemeProvider } from '@mui/material'
// The live site loads only Poppins 400 (components/theme.ts); heavier weights are browser-synthesised.
// Loading 500–900 here made every heading visibly heavier than the live screenshots.
import '@fontsource/poppins/400.css'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { theme } from '../lib/theme'
import { CartProvider } from '../lib/cart'
import Layout from '../components/Layout/Layout'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Head>
        <title>MySupreme — Concept B prototype</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <CartProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </CartProvider>
    </ThemeProvider>
  )
}
