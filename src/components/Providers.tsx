'use client'

import LocaleProvider from '@/components/LocaleProvider'
import { ToastAction } from '@/components/ui/Toast'
import { useNetworkStatus } from '@/hooks/useNetworkStatus'
import { toast } from '@/hooks/useToast'
import { useLocales } from '@/state/atoms'
import * as dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import utc from 'dayjs/plugin/utc'
import { Provider as JotaiProvider } from 'jotai'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import { PropsWithChildren, useEffect } from 'react'

dayjs.extend(isBetween)
dayjs.extend(utc)

export default function Providers(props: PropsWithChildren) {
	const { children } = props
	const isOnline = useNetworkStatus()
	const locales = useLocales()

	useEffect(() => {
		if (!isOnline) {
			const obj = toast({
				title: locales?.toast.connection.title,
				description: locales?.toast.connection.description,
				variant: 'destructive',
				action: (
					<ToastAction
						altText={locales?.toast.connection.action ?? 'Refresh'}
						onClick={() => window.location.reload()}
					>
						{locales?.toast.connection.action}
					</ToastAction>
				),
        duration: 60000
			})
      return () => obj.dismiss()
		}
	}, [isOnline, locales])

	return (
		<JotaiProvider>
			<SessionProvider refetchWhenOffline={false}>
				<ThemeProvider
					attribute='class'
					defaultTheme='dark'
					disableTransitionOnChange
				>
					<LocaleProvider>{children}</LocaleProvider>
				</ThemeProvider>
			</SessionProvider>
		</JotaiProvider>
	)
}
