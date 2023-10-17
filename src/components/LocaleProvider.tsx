'use client'

import { LocaleAtom, LocalesAtom } from '@/state/atoms'
import { I18nProvider } from '@react-aria/i18n'
import { getLocales } from '@/localization/locales'
import 'dayjs/locale/en'
import 'dayjs/locale/ru'
import { Provider, useAtomValue, useSetAtom } from 'jotai'
import { memo, PropsWithChildren, useEffect } from 'react'

type PropsType = PropsWithChildren

function LocaleProvider(props: PropsType) {
	const { children } = props
	const setLocales = useSetAtom(LocalesAtom)
	const locale = useAtomValue(LocaleAtom)

	useEffect(() => {
		;(async () => {
			const locales = await getLocales(locale)
			setLocales(locales)
		})()
	}, [locale, setLocales])

	return (
		<Provider>
			<I18nProvider locale={locale}>{children}</I18nProvider>
		</Provider>
	)
}

export default memo(LocaleProvider)
