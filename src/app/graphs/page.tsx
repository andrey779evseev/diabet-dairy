import { getRecordForStatistic } from '@/lib/api/record/queries'
import { getUserAuth } from '@/lib/auth'
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
		return await getRecordForStatistic(date)
	}

	const now = new Date()
	now.setHours(0, 0, 0, 0)
	const records = await getRecordForStatistic({
		from: now,
		to: undefined,
	})
	return <GraphsPageContent records={records} fetchRecords={fetchRecords} />
}
