import translation from '@/lib/i18n/locales/en/translation.json'
import 'i18next'

declare module 'i18next' {
	interface CustomTypeOptions {
		defaultNS: 'en'
		resources: {
			translation: typeof translation
		}
	}
}
