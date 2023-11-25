'use client'

import { LocaleAtom, LocalesAtom } from '@/state/atoms'
import { useAtom } from 'jotai'
import {
	AreaChart,
	BarChart3,
	Cog,
	Home,
	LifeBuoy,
	LogOut,
	Menu,
	Moon,
	Sun,
} from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { useMemo } from 'react'
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
import { Skeleton } from '@/components/ui/Skeleton'
import { getLocales } from '@/localization/locales'

export default function Header() {
	const { resolvedTheme: theme, setTheme } = useTheme()
	const router = useRouter()
	const { data: session } = useSession()
	const [locales, setLocales] = useAtom(LocalesAtom)
	const [locale, setLocale] = useAtom(LocaleAtom)

	const routes = useMemo(() => {
		return [
			{
				label: locales?.header.dropdown.home,
				path: '/',
				icon: Home,
			},
			{
				label: locales?.header.dropdown.graphs,
				path: '/graphs',
				icon: AreaChart,
			},
			{
				label: locales?.header.dropdown.statistics,
				path: '/statistics',
				icon: BarChart3,
			},
			{
				label: locales?.header.dropdown.settings,
				path: '/settings',
				icon: Cog,
			},
			{
				label: locales?.header.dropdown.support,
				icon: LifeBuoy,
			},
		]
	}, [locales?.header.dropdown])

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
						{session === undefined ? (
							<>
								<Skeleton className='h-10 w-10 rounded-full' />
								<Skeleton className='h-4 w-24 rounded-sm' />
							</>
						) : (
							<>
								<Avatar>
									<AvatarImage
										src={session?.user.image ?? undefined}
										alt='profile image'
										referrerPolicy='no-referrer'
									/>
									<AvatarFallback>
										{session?.user.name?.charAt(0).toUpperCase()}
									</AvatarFallback>
								</Avatar>
								{session?.user.name}
							</>
						)}
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
					{routes.map((route, i) => (
						<DropdownMenuItem
							onSelect={
								route.path !== undefined
									? () => router.push(route.path)
									: undefined
							}
							key={i}
						>
							<route.icon className='mr-2 h-4 w-4' />
							<span>{route.label}</span>
						</DropdownMenuItem>
					))}
					<DropdownMenuSeparator />
					<DropdownMenuItem onSelect={() => logout()}>
						<LogOut className='mr-2 h-4 w-4' />
						<span>{locales?.header.dropdown.support}</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

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
