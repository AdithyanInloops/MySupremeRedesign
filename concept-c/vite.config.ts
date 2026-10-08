import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Static build with relative asset paths and hash routing, so it runs on any static host (Vercel, Netlify, a USB stick).
export default defineConfig({
  base: './',
  plugins: [react()],
  // One prototype bundle (~180 kB gzipped) is fine for a design review; no code-splitting needed.
  build: { chunkSizeWarningLimit: 800 },
})
