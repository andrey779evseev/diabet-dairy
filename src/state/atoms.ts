import { useAtomValue } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { Locales } from '@/localization/locales'

export const LocalesAtom = atomWithStorage<Locales | undefined>(
	'locales',
	undefined,
)
export const LocaleAtom = atomWithStorage<'en' | 'ru'>('locale', 'en')

export const useLocales = () => useAtomValue(LocalesAtom)
export const useLocale = () => useAtomValue(LocaleAtom)
