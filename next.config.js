/** @type {import('next').NextConfig} */
module.exports = {
    images: { unoptimized: true }, // avoids remote loader headaches under tunnels
    experimental: { optimizePackageImports: ['lucide-react'] },
}


