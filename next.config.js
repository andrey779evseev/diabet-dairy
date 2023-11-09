const withPWA = require('@ducanh2912/next-pwa').default({
	dest: 'public',
})

/** @type {import('next').NextConfig} */
const nextConfig = process.env.NODE_ENV === 'development' ? {} : withPWA({})

module.exports = nextConfig
