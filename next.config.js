/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: false,
  optimizeFileTracing: false,
  images: {
    loader: 'akamai',
    path:'',
    domains: ['firebasestorage.googleapis.com','ik.imagekit.io','dropbox.com']
  },
  trailingSlash: true,
  async redirects() {
    return [
      {
        source: '/admin/:asset*',
        destination: 'https://drugie-zycie-backend.vercel.app/admin/:asset*',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
