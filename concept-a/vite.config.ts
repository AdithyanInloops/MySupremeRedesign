import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// @mui/icons-material v5 deep imports resolve to CJS, which this bundler wraps as { default }.
// Point them at the package's own ESM build so `import X from '@mui/icons-material/X'` works as in Next.js.
export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: [{ find: /^@mui\/icons-material\/(?!esm\/)([A-Za-z0-9]+)$/, replacement: '@mui/icons-material/esm/$1' }],
  },
})
