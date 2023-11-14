'use client'

import { LocalesAtom, useLocale } from '@/state/atoms'
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
						sheet_insulin_error:
							'Either short or long insulin should be filled in.',
						required: 'Required',
					},
				},
				ru: {
					zod: ruTranslation,
					custom: {
						sheet_insulin_error:
							'Либо короткий, либо длинный инсулин должны быть указаны.',
						required: 'Обязательное поле',
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

	return children
}

export default memo(LocaleProvider)
