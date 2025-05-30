import million from 'million/compiler'

/** @type {import('next').NextConfig} */
const nextConfig = {
	// reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com',
				port: '',
				pathname: '/**',
			},
		],
	},
}

const millionConfig = {
	auto: { rsc: true },
}

export default million.next(nextConfig, millionConfig)
