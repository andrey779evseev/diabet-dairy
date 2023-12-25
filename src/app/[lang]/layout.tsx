import { Languages, fallbackLng, languages } from '@/lib/i18n/settings'
import '@/styles/globals.css'
import { redirect } from 'next/navigation'
import { PropsWithChildren } from 'react'

type Props = {
	params: {
		lang: Languages
	}
} & PropsWithChildren

export default async function LangLayout(props: Props) {
	const {
		children,
		params: { lang },
	} = props

	if (!languages.includes(lang)) redirect(`/${fallbackLng}`)

	return <>{children}</>
}
