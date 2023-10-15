import '@/styles/globals.css'
import * as dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Providers from '@/components/Providers'
import { Toaster } from '@/components/ui/Toaster'
import 'dayjs/locale/en-gb'
import IndexedDBWrapper from '@/components/IndexedDBWrapper'

dayjs.extend(isBetween)
dayjs.locale('en-gb')

const inter = Inter({ subsets: ['latin'] })

const APP_NAME = 'Diabet Dairy'
const APP_DEFAULT_TITLE = 'Diabet Dairy'
const APP_TITLE_TEMPLATE = '%s | Diabet dairy'
const APP_DESCRIPTION = 'Dairy for diebetics'

export const metadata: Metadata = {
	applicationName: APP_NAME,
	title: {
		default: APP_DEFAULT_TITLE,
		template: APP_TITLE_TEMPLATE,
	},
	description: APP_DESCRIPTION,
	manifest: '/manifest.json',
	themeColor: '#09090B',
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
	},
	twitter: {
		card: 'summary',
		title: {
			default: APP_DEFAULT_TITLE,
			template: APP_TITLE_TEMPLATE,
		},
		description: APP_DESCRIPTION,
	},
}

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang='en' suppressHydrationWarning={true}>
			<body className={inter.className}>
				<Providers>
					{children}
					<Toaster />
				</Providers>
				<IndexedDBWrapper />
			</body>
		</html>
	)
}
