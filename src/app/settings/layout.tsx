import SidebarNav from '@/components/settings/SidebarNav'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/Card'

const sidebarNavItems = [
	{
		title: 'Profile',
		href: '/settings',
	},
]

type PropsType = {
	children: React.ReactNode
}

export default function SettingsLayout(props: PropsType) {
	const { children } = props
	return (
		<Card>
			<CardHeader>
				<CardTitle className='text-2xl font-bold tracking-tight'>
					Settings
				</CardTitle>
				<CardDescription className='text-muted-foreground'>
					Manage your account settings.
				</CardDescription>
			</CardHeader>
			<CardContent className='flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0'>
				<aside className='lg:w-1/5'>
					<SidebarNav items={sidebarNavItems} />
				</aside>
				<div className='flex-1 lg:max-w-2xl'>{children}</div>
			</CardContent>
		</Card>
	)
}
