import type { AppProps } from 'next/app'
import Head from 'next/head'
import { CssBaseline, ThemeProvider } from '@mui/material'
// The redesign uses real Poppins weights instead of browser-synthesised bold.
import '@fontsource/poppins/400.css'
import '@fontsource/poppins/500.css'
import '@fontsource/poppins/600.css'
import '@fontsource/poppins/700.css'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { theme } from '../lib/theme'
import { ToastProvider } from '../lib/toast'
import { CartProvider } from '../lib/cart'
import { SessionProvider } from '../lib/session'
import { QuickOrderProvider } from '../components/QuickOrder/QuickOrder'
import Layout from '../components/Layout/Layout'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Head>
        <title>MySupreme — Wholesale Food &amp; Restaurant Supply</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#E00000" />
      </Head>
      <ToastProvider>
        <SessionProvider>
          <CartProvider>
            <QuickOrderProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </QuickOrderProvider>
          </CartProvider>
        </SessionProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}
