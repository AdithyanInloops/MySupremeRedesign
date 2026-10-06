import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Box, Button, IconButton, InputAdornment, TextField, Typography } from '@mui/material'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import { useCart } from '../../lib/cart'

// Mirrors the live components/Signup/AccountSignInUpForm.tsx + SignInForm.tsx (sign-in mode). Visual only.
const label = { color: '#0C0C0C', fontSize: '16px', fontFamily: 'Poppins', fontWeight: 500 }
const field = { '& .MuiOutlinedInput-root': { borderRadius: '4px', height: 56 }, '& .MuiOutlinedInput-input': { fontSize: 15 } }

export default function AccountSignInPage() {
  const { notify } = useCart()
  const [show, setShow] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    notify('Sign in is visual only in this prototype', 'info')
  }
  return (
    <>
      <Head><title>Sign in | MySupreme</title><meta name="robots" content="noindex" /></Head>
      <Box sx={{ maxWidth: 1052, mx: 'auto', px: { xs: 2, md: 0 }, py: { xs: 10, md: 10 } }}>
        <Box sx={{ width: '100%', display: 'flex', padding: { md: 4, xs: 1 }, backgroundColor: 'white', flexDirection: { xs: 'column', md: 'row' } }}>
          <Box sx={{ width: '50%', backgroundColor: '#FF413D', alignItems: 'center', justifyContent: 'center', borderTopLeftRadius: '20px', borderBottomLeftRadius: '20px', display: { xs: 'none', md: 'flex' } }}>
            <img src="/assets/login.svg" alt="" width={400} height={400} style={{ maxWidth: '100%', height: 'auto' }} />
          </Box>
          <Box sx={{ width: { xs: '100%', md: '50%' }, backgroundColor: '#FFFFFF', padding: { md: 5, xs: 2 }, borderRadius: { xs: '20px', md: '0px 20px 20px 0px' }, boxShadow: '5px 5px 15px rgba(0, 0, 0, 0.2)' }}>
            <Typography fontWeight="bold" variant="h4" sx={{ color: '#0C0C0C', fontFamily: 'Poppins', pl: 1, fontSize: { xs: 18, md: 24 } }}>Log in</Typography>
            <Typography sx={{ pl: 1, color: '#0C0C0C', fontFamily: 'Poppins', fontSize: { md: '16px', xs: '13px' } }}>Login to your account in seconds</Typography>
            <Box component="form" onSubmit={submit} sx={{ p: 1 }} noValidate>
              <Box sx={{ pb: 1, mt: 1 }}>
                <Typography sx={label}>Email address</Typography>
                <TextField fullWidth required type="email" placeholder="Email address *" value={email} onChange={(e) => setEmail(e.target.value)} sx={{ ...field, mt: 0.5 }} inputProps={{ 'aria-label': 'Email address' }} />
              </Box>
              <Typography sx={{ ...label, mt: 1 }}>Password</Typography>
              <TextField
                fullWidth
                required
                type={show ? 'text' : 'password'}
                placeholder="Password *"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ ...field, mt: 0.5 }}
                inputProps={{ 'aria-label': 'Password' }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton aria-label={show ? 'Hide password' : 'Show password'} onClick={() => setShow((s) => !s)} edge="end">
                        {show ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Box sx={{ display: 'flex' }}>
                <Box component={Link} href="/account/signin" sx={{ ml: 'auto', textDecoration: 'none', color: '#FF413D', fontSize: { xs: 12, md: 16 }, fontFamily: 'Poppins' }}>Forgot password</Box>
              </Box>
              <Button type="submit" fullWidth variant="contained" disableElevation sx={{ mt: 2, bgcolor: '#FF413D', borderRadius: '50px', height: 48, textTransform: 'none', fontWeight: 600, fontSize: 16, '&:hover': { bgcolor: '#e63939' } }}>
                Log in
              </Button>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: '10px', px: 1 }}>
              <Typography sx={{ color: '#0C0C0C', fontFamily: 'Poppins', fontSize: { xs: 14, md: 16 } }}>Dont have an Account</Typography>
              <Typography component="button" type="button" onClick={() => notify('Sign up is visual only in this prototype', 'info')} sx={{ color: '#FF413D', cursor: 'pointer', fontFamily: 'Poppins', bgcolor: 'transparent', border: 0, p: 0, fontSize: { xs: 14, md: 16 } }}>
                Sign up
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  )
}
