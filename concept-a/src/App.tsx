import { CssBaseline, ThemeProvider } from '@mui/material'
import { HashRouter, Route, Routes } from 'react-router-dom'
import theme from './theme'
import { AppStateProvider } from './state/AppState'
import Layout from './components/Layout'

import Home from './pages/shop/Home'
import Listing from './pages/shop/Listing'
import ProductPage from './pages/shop/ProductPage'
import AllCategories from './pages/shop/AllCategories'
import Brands from './pages/shop/Brands'
import Flyers from './pages/shop/Flyers'
import Wishlist from './pages/shop/Wishlist'
import Compare from './pages/shop/Compare'

import Cart from './pages/checkout/Cart'
import CheckoutShipping from './pages/checkout/CheckoutShipping'
import CheckoutPayment from './pages/checkout/CheckoutPayment'
import Success from './pages/checkout/Success'

import SignIn from './pages/account/SignIn'
import ForgotPassword from './pages/account/ForgotPassword'
import AccountLayout from './pages/account/AccountLayout'
import Dashboard from './pages/account/Dashboard'
import Orders from './pages/account/Orders'
import OrderDetail from './pages/account/OrderDetail'
import Credit from './pages/account/Credit'
import Addresses from './pages/account/Addresses'
import Profile from './pages/account/Profile'
import GuestOrderStatus from './pages/account/GuestOrderStatus'

import About from './pages/company/About'
import Contact from './pages/company/Contact'
import Supplier from './pages/company/Supplier'
import DownloadApp from './pages/company/DownloadApp'
import Service from './pages/company/Service'
import CmsPage from './pages/company/CmsPage'
import Blog from './pages/company/Blog'
import Region from './pages/company/Region'
import NotFound from './pages/company/NotFound'

import Summary from './pages/review/Summary'
import Components from './pages/review/Components'
import Preview from './pages/review/Preview'

/**
 * Routes mirror the production GraphCommerce routes (see brief "Page inventory").
 * Category pages live under /c/:dept here only because the prototype has no URL resolver;
 * production keeps /packaging, /grocery/... at the root.
 */
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppStateProvider>
        <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/review/preview" element={<Preview />} />
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="c/:dept" element={<Listing />} />
              <Route path="search/:term" element={<Listing />} />
              <Route path="p/:slug" element={<ProductPage />} />
              <Route path="all-categories" element={<AllCategories />} />
              <Route path="brands" element={<Brands />} />
              <Route path="flyers-offers" element={<Flyers />} />
              <Route path="wishlist" element={<Wishlist />} />
              <Route path="compare" element={<Compare />} />

              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<CheckoutShipping />} />
              <Route path="checkout/payment" element={<CheckoutPayment />} />
              <Route path="checkout/success" element={<Success />} />
              <Route path="thank-you" element={<Success />} />

              <Route path="account/signin" element={<SignIn />} />
              <Route path="account/forgot-password" element={<ForgotPassword />} />
              <Route path="account" element={<AccountLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="orders" element={<Orders />} />
                <Route path="orders/:number" element={<OrderDetail />} />
                <Route path="customerdashbord" element={<Credit />} />
                <Route path="customerdashbord/:tab" element={<Credit />} />
                <Route path="addresses" element={<Addresses />} />
                <Route path="profile" element={<Profile />} />
                <Route path="company" element={<Profile />} />
              </Route>
              <Route path="guest/orderstatus" element={<GuestOrderStatus />} />

              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="become-a-supplier" element={<Supplier />} />
              <Route path="download-app" element={<DownloadApp />} />
              <Route path="service" element={<Service />} />
              <Route path="page/:slug" element={<CmsPage />} />
              <Route path="blog" element={<Blog />} />
              <Route path="region/:city" element={<Region />} />

              <Route path="review/summary" element={<Summary />} />
              <Route path="review/components" element={<Components />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </HashRouter>
      </AppStateProvider>
    </ThemeProvider>
  )
}
