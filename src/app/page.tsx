import HomePageContent from '@/components/client-pages/HomePageContent'
import {
	getRecordsByUserId,
	getRecordsCountByUserId,
} from '@/lib/api/record/queries'
import { getSettingsByUserId } from '@/lib/api/settings/queries'
import { getUserAuth } from '@/lib/auth'

export default async function Home() {
	const { user } = await getUserAuth()

	async function fetchRecords(offset: number = 0, limit: number = 100) {
		'use server'
		return await getRecordsByUserId(user.id, offset, limit)
	}

	const [records, recordsCount, settings] = await Promise.all([
		fetchRecords(),
		getRecordsCountByUserId(user.id),
		getSettingsByUserId(user.id),
	])

	return (
		<HomePageContent
			records={records}
			fetchRecords={fetchRecords}
			recordsCount={recordsCount}
			settings={settings}
		/>
	)
}
