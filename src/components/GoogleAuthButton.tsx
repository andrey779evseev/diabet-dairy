'use client'

import { Loader2 } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Icons } from '@/components/Icons'
import { Button } from '@/components/ui/Button'

export function GoogleAuthButton() {
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const searchParams = useSearchParams()
	const callbackUrl = searchParams.get('callbackUrl') ?? '/en'

	return (
		<Button
			variant='outline'
			type='button'
			disabled={isLoading}
			onClick={() => signIn('google', { callbackUrl })}
		>
			{isLoading ? (
				<Loader2 className='mr-2 h-4 w-4 animate-spin' />
			) : (
				<Icons.google className='mr-2 h-4 w-4' />
			)}{' '}
			Google
		</Button>
	)
}
