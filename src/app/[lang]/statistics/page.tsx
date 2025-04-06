import StatisticsPageContent from '@/components/client-pages/StatisticsPageContent'
import {
	getAvgDayInsulinForPeriod,
	getAvgGlucoseForPeriod,
} from '@/lib/api/record/queries'
import { getUserAuth } from '@/lib/auth'
import { getClearNow } from '@/lib/utils'
import dayjs from 'dayjs'

const now = getClearNow()
const dates = [
	{
		from: now,
	},
	{
		from: dayjs(now).add(-1, 'day').toDate(),
		to: now,
	},
	{
		from: dayjs(now).add(-3, 'day').toDate(),
		to: now,
	},
	{
		from: dayjs(now).add(-1, 'week').toDate(),
		to: now,
	},
	{
		from: dayjs(now).add(-2, 'weeks').toDate(),
		to: now,
	},
	{
		from: dayjs(now).add(-1, 'month').toDate(),
		to: now,
	},
	{
		from: dayjs(now).add(-3, 'months').toDate(),
		to: now,
	},
]

export type Stats = {
	glucose: StatsByDates
	dailyInsulin: StatsByDates
}

export type StatsByDates = {
	today: number
	yesterday: number
	last3Days: number
	lastWeek: number
	last2Weeks: number
	lastMonth: number
	last3Months: number
}

export default async function StatisticsPage() {
	const session = await getUserAuth()

	const res = await Promise.all([
		...dates.map((date) => getAvgGlucoseForPeriod(date, session.user.id)),
		...dates.map((date) => getAvgDayInsulinForPeriod(date, session.user.id)),
	])

	const stats: Stats = {
		glucose: {
			today: res[0],
			yesterday: res[1],
			last3Days: res[2],
			lastWeek: res[3],
			last2Weeks: res[4],
			lastMonth: res[5],
			last3Months: res[6],
		},
		dailyInsulin: {
			today: res[7],
			yesterday: res[8],
			last3Days: res[9],
			lastWeek: res[10],
			last2Weeks: res[11],
			lastMonth: res[12],
			last3Months: res[13],
		},
	}

	return <StatisticsPageContent stats={stats} />
}
