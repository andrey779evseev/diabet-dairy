import { desc, eq, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { records } from '@/lib/db/schema/record'

export const getRecords = async () => {
	return await db.select().from(records)
}

export const getRecordsByUserId = async (
	userId: string,
	offset: number,
	limit: number
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
