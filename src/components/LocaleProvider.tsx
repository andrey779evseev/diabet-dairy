'use client'

import { LocalesAtom, useLocale } from '@/state/atoms'
import { I18nProvider } from '@react-aria/i18n'
import { getLocales } from '@/localization/locales'
import 'dayjs/locale/en'
import 'dayjs/locale/ru'
import { useSetAtom } from 'jotai'
import { z } from 'zod'
import { makeZodI18nMap } from 'zod-i18n-map'
import enTranslation from 'zod-i18n-map/locales/en/zod.json'
import ruTranslation from 'zod-i18n-map/locales/ru/zod.json'
import { memo, PropsWithChildren, useEffect } from 'react'
import i18next from 'i18next'

type PropsType = PropsWithChildren

function LocaleProvider(props: PropsType) {
	const { children } = props
	const setLocales = useSetAtom(LocalesAtom)
	const locale = useLocale()

	useEffect(() => {
		i18next.init({
			lng: locale,
			resources: {
				en: {
					zod: enTranslation,
					custom: {
						insulin_dose_error:
							'Either actrapid or protofan should be filled in.',
					},
				},
				ru: {
					zod: ruTranslation,
					custom: {
						insulin_dose_error:
							'Либо актрапид, либо протофан должны быть указаны.',
					},
				},
			},
		})
		z.setErrorMap(makeZodI18nMap({ ns: ['zod', 'custom'] }))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		;(async () => {
			const locales = await getLocales(locale)
			setLocales(locales)
			await i18next.changeLanguage(locale)
			z.setErrorMap(makeZodI18nMap({ ns: ['zod', 'custom'] }))
		})()
	}, [locale, setLocales])

	return <I18nProvider locale={locale}>{children}</I18nProvider>
}

export default memo(LocaleProvider)
