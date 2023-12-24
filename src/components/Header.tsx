'use client'

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
import { useTranslation } from '@/lib/i18n/client'
import { languages } from '@/lib/i18n/settings'
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
import { Session } from 'next-auth'
import { signOut } from 'next-auth/react'
import { useTheme } from 'next-themes'
import { usePathname, useRouter } from 'next/navigation'
import { useMemo } from 'react'

type Props = {
	session: Session
}

export default function Header(props: Props) {
	const { session } = props
	const { resolvedTheme: theme, setTheme } = useTheme()
	const router = useRouter()
	const pathname = usePathname()
	const lang = useMemo(() => pathname.split('/')[1], [pathname])
  const {t} = useTranslation()

	const routes = useMemo(() => {
		return [
			{
				label: t('header.dropdown.home'),
				path: '/',
				icon: Home,
			},
			{
				label: t('header.dropdown.graphs'),
				path: '/graphs',
				icon: AreaChart,
			},
			{
				label: t('header.dropdown.statistics'),
				path: '/statistics',
				icon: BarChart3,
			},
			{
				label: t('header.dropdown.settings'),
				path: '/settings',
				icon: Cog,
			},
			{
				label: t('header.dropdown.support'),
				icon: LifeBuoy,
			},
		]
	}, [t])

	const logout = async () => {
		await signOut()
		router.push('/' + pathname.split('/')[1] + '/auth/sign-in')
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
						{t('header.dropdown.languages.label')}
					</DropdownMenuLabel>
					<DropdownMenuRadioGroup>
						{languages.map((l, i) => (
							<DropdownMenuCheckboxItem
								checked={lang === l}
								onCheckedChange={() =>
									router.push(`/${l}/${pathname.split('/').slice(2).join('/')}`)
								}
								key={i}
							>
								{t(`header.dropdown.languages.${l}`)}
							</DropdownMenuCheckboxItem>
						))}
					</DropdownMenuRadioGroup>
					<DropdownMenuSeparator />
					{routes.map((route, i) => (
						<DropdownMenuItem
							onSelect={
								route.path !== undefined
									? () => router.push(`/${lang}/${route.path}`)
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
						<span>{t('header.dropdown.logout')}</span>
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
