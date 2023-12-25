import { getRecordsByDate } from '@/lib/api/record/queries'
import { getUserAuth } from '@/lib/auth'
import { getClearNow } from '@/lib/utils'
import dynamic from 'next/dynamic'
import { DateRange } from 'react-day-picker'

const GraphsPageContent = dynamic(
	() => import('@/components/client-pages/GraphsPageContent'),
	{ ssr: false },
)

export default async function GraphsPage() {
	const { user } = await getUserAuth()

	async function fetchRecords(date: DateRange) {
		'use server'
		return await getRecordsByDate(date, user.id)
	}

	const records = await getRecordsByDate(
		{
			from: getClearNow(),
			to: undefined,
		},
		user.id,
	)
	return <GraphsPageContent records={records} fetchRecords={fetchRecords} />
}
