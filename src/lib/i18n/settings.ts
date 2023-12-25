export const fallbackLng = 'en'
export const languages = [fallbackLng, 'ru'] as const
export type Languages = (typeof languages)[number]
export const namespaces = ['translation', 'zod'] as const
export type Namespaces = (typeof namespaces)[number]
export const cookieName = 'i18next'
export const defaultNS = 'translation'

export function getOptions(
	lng: Languages = fallbackLng,
	ns: Namespaces = defaultNS,
) {
	return {
		// debug: true,
		supportedLngs: languages,
		fallbackLng,
		lng,
		fallbackNS: defaultNS,
		defaultNS,
		ns,
		keyPrefix: undefined,
	}
}
