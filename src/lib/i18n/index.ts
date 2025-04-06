import { Namespace, createInstance } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { initReactI18next } from 'react-i18next/initReactI18next'
import enTranslation from 'zod-i18n-map/locales/en/zod.json'
import ruTranslation from 'zod-i18n-map/locales/ru/zod.json'
import { type Languages, type Namespaces, getOptions } from './settings'

const initI18next = async (lng: Languages, ns: Namespaces) => {
	const i18nInstance = createInstance()
	await i18nInstance
		.use(initReactI18next)
		.use(
			resourcesToBackend(
				(language: string, namespace: string) =>
					import(`./locales/${language}/${namespace}.json`),
			),
		)
		.init({
			...getOptions(lng, ns),
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
	return i18nInstance
}

export async function getTranslation(
	lng: Languages,
	ns: Namespaces = 'translation',
) {
	const i18nextInstance = await initI18next(lng, ns)
	return {
		t: i18nextInstance.getFixedT(lng, ns as Namespace),
		i18n: i18nextInstance,
	}
}
