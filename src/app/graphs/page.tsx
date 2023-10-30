import { DateRange } from 'react-day-picker'
import dynamic from 'next/dynamic'
import { getRecordsByUserIdAndDateRange } from '@/lib/api/record/queries'
import { getUserAuth } from '@/lib/auth'

const GraphsPageContent = dynamic(
	() => import('@/components/client-pages/GraphsPageContent'),
	{ ssr: false },
)

export default async function GraphsPage() {
	const { user } = await getUserAuth()

	async function fetchRecords(date: DateRange) {
		'use server'
		return await getRecordsByUserIdAndDateRange(date, user.id)
	}

	const now = new Date()
	now.setHours(0, 0, 0, 0)
	const records = await getRecordsByUserIdAndDateRange(
		{
			from: now,
			to: undefined,
		},
		user.id,
	)
	return <GraphsPageContent records={records} fetchRecords={fetchRecords} />
}
