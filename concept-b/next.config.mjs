/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  // Same as the real site: MUI icons are tree-shaken per import.
  modularizeImports: { '@mui/icons-material': { transform: '@mui/icons-material/{{member}}' } },
}
export default nextConfig
