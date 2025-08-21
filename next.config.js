/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

module.exports = {
    basePath,                 // e.g. '/mxtk' on ngrok, '' locally
    assetPrefix: basePath,    // ensure images/assets resolve under /mxtk
    images: { unoptimized: true }, // avoids remote loader headaches under tunnels
    experimental: { optimizePackageImports: ['lucide-react'] },
}


