'use client'

import { LocalesAtom, useLocale } from '@/state/atoms'
import { I18nProvider } from '@react-aria/i18n'
import { getLocales } from '@/localization/locales'
import 'dayjs/locale/en'
import 'dayjs/locale/ru'
import { useSetAtom } from 'jotai'
import { memo, PropsWithChildren, useEffect } from 'react'

type PropsType = PropsWithChildren

function LocaleProvider(props: PropsType) {
	const { children } = props
	const setLocales = useSetAtom(LocalesAtom)
	const locale = useLocale()

	useEffect(() => {
		;(async () => {
			const locales = await getLocales(locale)
			setLocales(locales)
		})()
	}, [locale, setLocales])

	return <I18nProvider locale={locale}>{children}</I18nProvider>
}

export default memo(LocaleProvider)
