import SidebarNav from '@/components/settings/SidebarNav'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/Card'
import { getTranslation } from '@/lib/i18n'
import { Languages } from '@/lib/i18n/settings'

type PropsType = {
	children: React.ReactNode
  params: {
    lang: Languages
  }
}

export default async function SettingsLayout(props: PropsType) {
	const { children, params: {lang} } = props
  const {t} = await getTranslation(lang)

  const sidebarNavItems = [
    {
      title: t('settings.profile.title'),
      href: '/settings',
    },
  ]

	return (
		<Card>
			<CardHeader>
				<CardTitle className='text-2xl font-bold tracking-tight'>
					{t('settings.title')}
				</CardTitle>
				<CardDescription className='text-muted-foreground'>
          {t('settings.description')}
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
