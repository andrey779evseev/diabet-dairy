'use client'

import { LocaleAtom, LocalesAtom } from '@/state/atoms'
import { useAtom } from 'jotai'
import {
	AreaChart,
	Home,
	LifeBuoy,
	LogOut,
	Menu,
	Moon,
	Sun,
	Wifi,
	WifiOff,
} from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import { useNetworkStatus } from '@/hooks/useNetworkStatus'
import { getLocales } from '@/localization/locales'

export default function Header() {
	const { resolvedTheme: theme, setTheme } = useTheme()
	const router = useRouter()
	const { isOnline } = useNetworkStatus()
	const { data: session } = useSession()
	const [locales, setLocales] = useAtom(LocalesAtom)
	const [locale, setLocale] = useAtom(LocaleAtom)

	const logout = async () => {
		await signOut()
		router.push('/')
	}

	const changeLanguage = async (lang: 'ru' | 'en') => {
		setLocale(lang)
		const res = await getLocales(lang)
		setLocales(res)
	}

	return (
		<div className='mb-2 flex items-center justify-between'>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant='outline' size='icon'>
						<Menu />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className='w-56' align='start'>
					<DropdownMenuLabel className='flex items-center gap-2'>
						<Avatar>
							<AvatarImage
								src={session?.user.image ?? undefined}
								alt='profile image'
								width={16}
								height={16}
							/>
							<AvatarFallback>M</AvatarFallback>
						</Avatar>
						{session?.user.name}
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuLabel>
						{locales?.header.dropdown.languages.label}
					</DropdownMenuLabel>
					<DropdownMenuRadioGroup>
						<DropdownMenuCheckboxItem
							checked={locale === 'en'}
							onCheckedChange={() => changeLanguage('en')}
						>
							{locales?.header.dropdown.languages.english}
						</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem
							checked={locale === 'ru'}
							onCheckedChange={() => changeLanguage('ru')}
						>
							{locales?.header.dropdown.languages.russian}
						</DropdownMenuCheckboxItem>
					</DropdownMenuRadioGroup>
					<DropdownMenuSeparator />
					<DropdownMenuItem onSelect={() => router.push('/')}>
						<Home className='mr-2 h-4 w-4' />
						<span>{locales?.header.dropdown.home}</span>
					</DropdownMenuItem>
					<DropdownMenuItem onSelect={() => router.push('/graphs')}>
						<AreaChart className='mr-2 h-4 w-4' />
						<span>{locales?.header.dropdown.graphs}</span>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<LifeBuoy className='mr-2 h-4 w-4' />
						<span>{locales?.header.dropdown.support}</span>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem onSelect={() => logout()}>
						<LogOut className='mr-2 h-4 w-4' />
						<span>{locales?.header.dropdown.support}</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

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
