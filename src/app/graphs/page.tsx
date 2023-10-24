import dayjs from 'dayjs'
import { DateRange } from 'react-day-picker'
import dynamic from 'next/dynamic'
import { getRecordForStatistic } from '@/lib/api/record/queries'
import { getUserAuth } from '@/lib/auth'

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
		from: dayjs(now).add(-30, 'day').toDate(),
		to: now,
	})
	return <GraphsPageContent records={records} fetchRecords={fetchRecords} />
}
