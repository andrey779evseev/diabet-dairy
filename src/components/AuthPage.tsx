import { GoogleAuthButton } from '@/components/GoogleAuthButton'
import { buttonVariants } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

type PropsType = {
	isSignIn: boolean
	lang: string
}

export default function AuthPage(props: PropsType) {
	const { isSignIn, lang } = props

	return (
		<div className='container relative flex h-screen flex-col items-center justify-center gap-40'>
			<Link
				href={isSignIn ? `/${lang}/auth/sign-up` : `/${lang}/auth/sign-in`}
				className={cn(
					buttonVariants({ variant: 'ghost' }),
					'absolute right-4 top-4 md:right-8 md:top-8',
				)}
			>
				{isSignIn ? 'Sign up' : 'Sign in'}
			</Link>
			<Image
				src='/assets/logo.svg'
				width={200}
				height={200}
				alt='logo'
				className='rounded-full'
				priority={true}
			/>
			<div className='mx-auto flex w-full max-w-2xl flex-col justify-center space-y-6'>
				<div className='flex flex-col space-y-2 text-center'>
					<h1 className='text-2xl font-semibold tracking-tight'>
						{isSignIn ? 'Create an account' : 'Welcome back'}
					</h1>
				</div>
				<GoogleAuthButton />
				<p className='px-8 text-center text-sm text-muted-foreground'>
					By clicking continue, you agree to our{' '}
					<span className='underline underline-offset-4 hover:text-primary'>
						Terms of Service
					</span>{' '}
					and{' '}
					<span className='underline underline-offset-4 hover:text-primary'>
						Privacy Policy
					</span>
					.
				</p>
			</div>
		</div>
	)
}
