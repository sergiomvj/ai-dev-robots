/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    experimental: {
        serverActions: { allowedOrigins: ['dashboard.fbrapps.com'] },
    },
    typescript: { ignoreBuildErrors: true },
    eslint: { ignoreDuringBuilds: true },
}

export default nextConfig
