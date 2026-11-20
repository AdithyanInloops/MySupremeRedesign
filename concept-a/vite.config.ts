import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// Dev only: serves /api/* from server/api.ts, the same handler the Vercel functions in api/ export.
const api: Plugin = {
  name: 'profile-api',
  configureServer(server) {
    server.middlewares.use('/api', async (req, res) => {
      const { handle } = (await server.ssrLoadModule('/server/api.ts')) as typeof import('./server/api.ts')
      const chunks: Buffer[] = []
      for await (const chunk of req) chunks.push(chunk as Buffer)
      const r = await handle(new Request(new URL(req.originalUrl ?? req.url ?? '/', 'http://localhost'), {
        method: req.method,
        headers: req.headers as Record<string, string>,
        body: chunks.length ? Buffer.concat(chunks) : undefined,
      }))
      res.statusCode = r.status
      r.headers.forEach((v, k) => res.setHeader(k, v))
      res.end(await r.text())
    })
  },
}

// @mui/icons-material v5 deep imports resolve to CJS, which this bundler wraps as { default }.
// Point them at the package's own ESM build so `import X from '@mui/icons-material/X'` works as in Next.js.
export default defineConfig(({ mode }) => {
  // Hand the .env keys to the dev API (server/api.ts). Assigning undefined to process.env would store the string "undefined".
  const env = loadEnv(mode, process.cwd(), '')
  for (const k of ['GOOGLE_PLACES_API_KEY', 'VITE_GOOGLE_PLACES_API_KEY']) if (env[k]) process.env[k] ??= env[k]
  return {
    base: './',
    plugins: [react(), api],
    resolve: {
      alias: [{ find: /^@mui\/icons-material\/(?!esm\/)([A-Za-z0-9]+)$/, replacement: '@mui/icons-material/esm/$1' }],
    },
  }
})
