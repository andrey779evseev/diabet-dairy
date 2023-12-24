'use client'

import 'dayjs/locale/en'
import 'dayjs/locale/ru'
import { z } from 'zod'
import { makeZodI18nMap } from 'zod-i18n-map'
import * as dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import utc from 'dayjs/plugin/utc'
import { SessionProvider } from 'next-auth/react'
import { PropsWithChildren, useEffect } from 'react'
import { ThemeProvider } from 'next-themes'
import { ToastAction } from '@/components/ui/Toast'
import { useTranslation } from '@/lib/i18n/client'
import { useNetworkStatus } from '@/hooks/useNetworkStatus'
import { toast } from '@/hooks/useToast'

dayjs.extend(isBetween)
dayjs.extend(utc)

export default function Providers(props: PropsWithChildren) {
	const { children } = props
	const isOnline = useNetworkStatus()
	const { t } = useTranslation()

	useEffect(() => {
		if (!isOnline) {
			const obj = toast({
				title: t('toast.connection.title'),
				description: t('toast.connection.description'),
				variant: 'destructive',
				action: (
					<ToastAction
						altText={t('toast.connection.action')}
						onClick={() => window.location.reload()}
					>
						{t('toast.connection.action')}
					</ToastAction>
				),
				duration: 60000,
			})
			return () => obj.dismiss()
		}
	}, [isOnline, t])

  useEffect(() => {
		z.setErrorMap(makeZodI18nMap({ ns: ['translation', 'zod', 'custom'] }))
	}, [t])

	return (
		<SessionProvider refetchWhenOffline={false}>
			<ThemeProvider
				attribute='class'
				defaultTheme='dark'
				disableTransitionOnChange
			>
				{children}
			</ThemeProvider>
		</SessionProvider>
	)
}
