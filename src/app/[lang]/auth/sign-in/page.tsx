import AuthPage from '@/components/AuthPage'

type Props = {
	params: {
		lang: string
	}
}

export default function SignInPage(props: Props) {
	const {
		params: { lang },
	} = props
	return <AuthPage isSignIn lang={lang} />
}
