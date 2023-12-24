'use client'

/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect } from 'react'
import {
	initReactI18next,
	useTranslation as useTranslationOrg,
} from 'react-i18next'
import i18next, { Namespace } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { useParams } from 'next/navigation'
import { getOptions, Languages, Namespaces } from './settings'
import enTranslation from 'zod-i18n-map/locales/en/zod.json'
import ruTranslation from 'zod-i18n-map/locales/ru/zod.json'

i18next
	.use(initReactI18next)
	.use(
		resourcesToBackend(
			(language: string, namespace: string) =>
				import(`./locales/${language}/${namespace}.json`),
		),
	)

i18next.init({
  ...getOptions(),
	partialBundledLanguages: true,
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

export function useTranslation(ns: Namespaces = 'translation', options?: any) {
	const { lang } = useParams<{ lang: Languages }>()
	const ret = useTranslationOrg(ns as Namespace, options)
	const { i18n } = ret
	useEffect(() => {
		if (i18n.language === undefined || i18n.language !== lang)
			i18n.changeLanguage(lang)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [lang])
	return ret
}
