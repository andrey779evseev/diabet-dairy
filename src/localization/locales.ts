'use server'

const locales = {
	en: () => import('./en.json').then((module) => module.default),
	ru: () => import('./ru.json').then((module) => module.default),
}

export const getLocales = async (locale: 'ru' | 'en') => locales[locale]()

export type Locales = Awaited<ReturnType<typeof getLocales>>
