import { desc, eq, sql } from 'drizzle-orm'
import { DateRange } from 'react-day-picker'
import { db } from '@/lib/db'
import { records } from '@/lib/db/schema/record'

export const getRecords = async () => {
	return await db.select().from(records)
}

export const getRecordsByUserId = async (
	userId: string,
	offset: number,
	limit: number,
) => {
	return await db.query.records.findMany({
		where: eq(records.userId, userId),
		offset,
		limit,
		orderBy: [desc(records.time)],
	})
}

export const getRecordsCountByUserId = async (userId: string) => {
	const [res] = await db
		.select({ count: sql<number>`count(*)` })
		.from(records)
		.where(eq(records.userId, userId))
	return res.count
}

export const getRecordForStatistic = async (date: DateRange) => {
	return await db.query.records.findMany({
		where: (records, { gte, lte, and }) =>
			date.to === undefined
				? gte(records.time, date.from ?? new Date())
				: and(
						gte(records.time, date.from ?? new Date()),
						lte(records.time, date.to),
				  ),
	})
}
