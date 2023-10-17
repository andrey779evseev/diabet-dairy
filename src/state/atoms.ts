import { atomWithStorage } from 'jotai/utils'
import { Locales } from '@/localization/locales'

export const LocalesAtom = atomWithStorage<Locales | undefined>(
	'locales',
	undefined,
)
export const LocaleAtom = atomWithStorage<'en' | 'ru'>('locale', 'en')
