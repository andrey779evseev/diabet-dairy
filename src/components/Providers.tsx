'use client'

import * as dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { SessionProvider } from 'next-auth/react'
import { memo, PropsWithChildren } from 'react'
import { ThemeProvider } from 'next-themes'

dayjs.extend(isBetween)

function Providers(props: PropsWithChildren) {
	const { children } = props
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

export default memo(Providers)
