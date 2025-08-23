/** @type {import('next').NextConfig} */
module.exports = {
    images: { unoptimized: true }, // avoids remote loader headaches under tunnels
    experimental: { optimizePackageImports: ['lucide-react'] },
    // Use assetPrefix for Next.js static assets when behind proxy
    assetPrefix: process.env.NODE_ENV === 'development' ? '/mxtk' : '',
}


