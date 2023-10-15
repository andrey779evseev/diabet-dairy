'use client'

import { LogOut, Moon, Sun, Wifi, WifiOff } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { useNetworkStatus } from '@/hooks/useNetworkStatus'

export default function Header() {
	const { resolvedTheme: theme, setTheme } = useTheme()
	const router = useRouter()
	const { isOnline } = useNetworkStatus()

	const logout = async () => {
		await signOut()
		router.push('/')
	}
	return (
		<div className='mb-2 flex items-center justify-between'>
			<Button variant='outline' size='icon' onClick={logout}>
				<LogOut />
			</Button>

			<div className='flex h-10 w-10 items-center justify-center rounded-md border border-input'>
				{isOnline ? <Wifi /> : <WifiOff />}
			</div>

			<Button
				variant='outline'
				size='icon'
				onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
			>
				{(theme ?? 'dark') === 'dark' ? <Moon /> : <Sun />}
			</Button>
		</div>
	)
}
