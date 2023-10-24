'use client'

import * as dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { Provider as JotaiProvider } from 'jotai'
import { SessionProvider } from 'next-auth/react'
import { memo, PropsWithChildren } from 'react'
import { ThemeProvider } from 'next-themes'
import LocaleProvider from '@/components/LocaleProvider'

dayjs.extend(isBetween)

function Providers(props: PropsWithChildren) {
	const { children } = props
	return (
		<SessionProvider refetchWhenOffline={false}>
			<JotaiProvider>
				<ThemeProvider
					attribute='class'
					defaultTheme='dark'
					disableTransitionOnChange
				>
					<LocaleProvider>{children}</LocaleProvider>
				</ThemeProvider>
			</JotaiProvider>
		</SessionProvider>
	)
}

export default memo(Providers)
