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

export default async function SettingsProfilePage() {
	const session = await getUserAuth()
	const settings = await getSettings(session.user.id)
	return (
		<Card>
			<CardHeader>
				<CardTitle>Profile</CardTitle>
				<CardDescription>This is personal account preferences.</CardDescription>
			</CardHeader>
			<CardContent>
				<ProfileForm settings={settings} />
			</CardContent>
			<CardFooter className='flex justify-between'>
				<Button type='submit' form='settings-profile-form'>
					Save
				</Button>
			</CardFooter>
		</Card>
		// <div className='space-y-6'>
		// 	<div>
		// 		<h3 className='text-lg font-medium'>Profile</h3>
		// 		<p className='text-sm text-muted-foreground'>
		// 			This is personal account preferences.
		// 		</p>
		// 	</div>
		// 	<Separator />
		// </div>
	)
}
