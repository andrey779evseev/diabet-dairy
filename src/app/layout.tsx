import IndexedDBWrapper from '@/components/IndexedDBWrapper'
import Providers from '@/components/Providers'
import { Toaster } from '@/components/ui/Toaster'
import '@/styles/globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Header from '@/components/Header'
import { getUserAuth } from '@/lib/auth'
import { env } from '@/lib/env.mjs'

const inter = Inter({ subsets: ['latin'] })

const APP_NAME = 'Diabet Dairy'
const APP_DEFAULT_TITLE = 'Diabet Dairy'
const APP_TITLE_TEMPLATE = '%s | Diabet dairy'
const APP_DESCRIPTION =
	'Your All-in-One Diabetes Management Solution. Take control of your health with our user-friendly platform for tracking insulin, glucose levels, food intake, and activity. Empower your diabetes management journey today.'

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	maximumScale: 1,
	themeColor: '#09090B',
}

export const metadata: Metadata = {
	applicationName: APP_NAME,
	title: {
		default: APP_DEFAULT_TITLE,
		template: APP_TITLE_TEMPLATE,
	},
	description: APP_DESCRIPTION,
	metadataBase: env.VERCEL_URL ?? 'http://localhost:3000',
	manifest: '/manifest.json',
	appleWebApp: {
		capable: true,
		statusBarStyle: 'default',
		title: APP_DEFAULT_TITLE,
		// startUpImage: [],
	},
	formatDetection: {
		telephone: false,
	},
	openGraph: {
		type: 'website',
		siteName: APP_NAME,
		title: {
			default: APP_DEFAULT_TITLE,
			template: APP_TITLE_TEMPLATE,
		},
		description: APP_DESCRIPTION,
		url: 'https://diabet-dairy.vercel.app',
		images: '/assets/og.png',
	},
	twitter: {
		card: 'summary_large_image',
		title: {
			default: APP_DEFAULT_TITLE,
			template: APP_TITLE_TEMPLATE,
		},
		description: APP_DESCRIPTION,
		site: 'https://diabet-dairy.vercel.app',
		images: '/assets/og.png',
	},
}

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const session = await getUserAuth()
	return (
		<html lang='en' suppressHydrationWarning={true}>
			<body className={inter.className}>
				<Providers>
					<main className='p-2'>
						{!!session ? <Header /> : null}
						{children}
					</main>
					<Toaster />
				</Providers>
				<IndexedDBWrapper />
			</body>
		</html>
	)
}
