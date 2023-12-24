import 'i18next'
import translation from '@/lib/i18n/locales/en/translation.json'

declare module 'i18next' {
	interface CustomTypeOptions {
		defaultNS: 'en'
		resources: {
			translation: typeof translation
		}
	}
}
