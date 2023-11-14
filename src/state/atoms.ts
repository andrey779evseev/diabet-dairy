import { useAtomValue } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { Locales } from '@/localization/locales'

//atoms
export const LocalesAtom = atomWithStorage<Locales | undefined>(
	'locales',
	undefined,
)
export const LocaleAtom = atomWithStorage<'en' | 'ru'>('locale', 'en')

//hooks
export const useLocales = () => useAtomValue(LocalesAtom)
export const useLocale = () => useAtomValue(LocaleAtom)
