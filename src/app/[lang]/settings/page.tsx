import ProfileForm from '@/components/settings/ProfileForm'
import { Button } from '@/components/ui/Button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/Card'
import { getSettings } from '@/lib/api/settings/queries'
import { getUserAuth } from '@/lib/auth'
import { getTranslation } from '@/lib/i18n'
import { Languages } from '@/lib/i18n/settings'

type Props = {
	params: {
		lang: Languages
	}
}

export default async function SettingsProfilePage(props: Props) {
	const {
		params: { lang },
	} = props
	const session = await getUserAuth()
	const settings = await getSettings(session.user.id)
	const { t } = await getTranslation(lang)
	return (
		<Card>
			<CardHeader>
				<CardTitle>{t('settings.profile.title')}</CardTitle>
				<CardDescription>{t('settings.profile.description')}</CardDescription>
			</CardHeader>
			<CardContent>
				<ProfileForm settings={settings} />
			</CardContent>
			<CardFooter className='flex justify-between'>
				<Button type='submit' form='settings-profile-form'>
					{t('common.save')}
				</Button>
			</CardFooter>
		</Card>
	)
}
