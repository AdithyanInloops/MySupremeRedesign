/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Lets `next dev` run beside a production `next start` without sharing a build folder.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  images: { unoptimized: true },
  // Same as the real site: MUI icons are tree-shaken per import.
  modularizeImports: { '@mui/icons-material': { transform: '@mui/icons-material/{{member}}' } },
}
export default nextConfig
