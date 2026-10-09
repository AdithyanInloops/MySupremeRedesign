import { HashRouter, Route, Routes } from 'react-router-dom'
import { CssBaseline, ThemeProvider } from '@mui/material'
import theme from './theme'
import { AppProvider } from './state/app'
import AppShell from './components/AppShell'
import Welcome from './screens/Welcome'
import SignIn from './screens/SignIn'
import Home from './screens/Home'
import Search from './screens/Search'
import Shop from './screens/Shop'
import Department from './screens/Department'
import ProductScreen from './screens/Product'
import Cart from './screens/Cart'
import Checkout from './screens/Checkout'
import OrderPlaced from './screens/OrderPlaced'
import Orders from './screens/Orders'
import OrderDetail from './screens/OrderDetail'
import Deals from './screens/Deals'
import Account from './screens/Account'
import Credit from './screens/Credit'
import Addresses from './screens/Addresses'
import Favorites from './screens/Favorites'
import CmsShowcase from './screens/CmsShowcase'
import QuickOrder from './screens/QuickOrder'
import Scan from './screens/Scan'
import Notifications from './screens/Notifications'
import Help from './screens/Help'
import NotFound from './screens/NotFound'

/** Hash routing so the static build runs anywhere without server rewrites (same as Concept A). */
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <HashRouter>
          <Routes>
            <Route element={<AppShell />}>
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/shop/:dept" element={<Department />} />
              <Route path="/p/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-placed/:number" element={<OrderPlaced />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/orders/:number" element={<OrderDetail />} />
              <Route path="/deals" element={<Deals />} />
              <Route path="/account" element={<Account />} />
              <Route path="/account/credit" element={<Credit />} />
              <Route path="/account/addresses" element={<Addresses />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/cms" element={<CmsShowcase />} />
              <Route path="/quick-order" element={<QuickOrder />} />
              <Route path="/scan" element={<Scan />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/help" element={<Help />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </HashRouter>
      </AppProvider>
    </ThemeProvider>
  )
}
