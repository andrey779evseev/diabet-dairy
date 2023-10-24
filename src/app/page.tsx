import HomePageContent from '@/components/client-pages/HomePageContent'
import {
	getRecordsByUserId,
	getRecordsCountByUserId,
} from '@/lib/api/record/queries'
import { getUserAuth } from '@/lib/auth'

export default async function Home() {
	const { user } = await getUserAuth()

	async function fetchRecords(offset: number = 0, limit: number = 100) {
		'use server'

		return await getRecordsByUserId(user.id, offset, limit)
	}

	const records = await fetchRecords()
	const recordsCount = await getRecordsCountByUserId(user.id)

	return (
		<HomePageContent
			records={records}
			fetchRecords={fetchRecords}
			recordsCount={recordsCount}
		/>
	)
}
