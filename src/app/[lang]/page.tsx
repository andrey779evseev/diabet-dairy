import HomePageContent from '@/components/client-pages/HomePageContent'
import { getRecords, getRecordsCount } from '@/lib/api/record/queries'
import { getSettings } from '@/lib/api/settings/queries'
import { getUserAuth } from '@/lib/auth'
import { getClearNow } from '@/lib/utils'

export default async function Home() {
	const session = await getUserAuth()

	const [records, recordsCount, settings] = await Promise.all([
		getRecords({ from: getClearNow() }, session.user.id),
		getRecordsCount({ from: getClearNow() }, session.user.id),
		getSettings(session.user.id),
	])

	return (
		<HomePageContent
			records={records}
			recordsCount={recordsCount}
			settings={settings}
			session={session}
		/>
	)
}
