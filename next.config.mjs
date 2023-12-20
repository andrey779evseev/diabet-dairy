import million from 'million/compiler'
import pwa from '@ducanh2912/next-pwa'

const withPWA = pwa({
	dest: 'public',
})

/** @type {import('next').NextConfig} */
const config = {
	reactStrictMode: true,
}

const nextConfig =
	process.env.NODE_ENV === 'development' ? config : withPWA(config)

const millionConfig = {
	auto: { rsc: true },
}

export default million.next(nextConfig, millionConfig)
