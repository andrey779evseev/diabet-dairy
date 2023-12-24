import AuthPage from '@/components/AuthPage'

type Props = {
  params: {
    lang: string
  }
}

export default function SignUpPage(props: Props) {
  const {params: {lang}} = props
	return <AuthPage isSignIn={false} lang={lang}/>
}
