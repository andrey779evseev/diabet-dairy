'use server'

import { db } from '@/lib/db'
import { records } from '@/lib/db/schema/record'
import type { Record } from '@/types/Record'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { and, between, desc, eq, gte, isNotNull, sql } from 'drizzle-orm'
import { DateRange } from 'react-day-picker'

dayjs.extend(utc)

export const getRecords = async (
	date: DateRange,
	userId: string,
	offset = 0,
	limit = 100,
) => {
	return (await db.query.records.findMany({
		where: (records, { gte, and, eq, between }) =>
			and(
				date.to === undefined
					? gte(records.time, date.from ?? new Date())
					: between(
							records.time,
							date.from ?? new Date(),
							dayjs.utc(date.to).add(1, 'day').toDate(),
					  ),
				eq(records.userId, userId),
			),
		offset,
		limit,
		orderBy: [desc(records.time)],
	})) as Record[]
}

export const getRecordsCount = async (date: DateRange, userId: string) => {
	const [res] = await db
		.select({ count: sql<number>`count(*)` })
		.from(records)
		.where(
			and(
				eq(records.userId, userId),
				date.to === undefined
					? gte(records.time, date.from ?? new Date())
					: between(
							records.time,
							date.from ?? new Date(),
							dayjs.utc(date.to).add(1, 'day').toDate(),
					  ),
			),
		)
	return res.count
}

export const getRecordsByDate = async (date: DateRange, userId: string) => {
	return (await db.query.records.findMany({
		where: (records, { gte, and, eq, between }) =>
			and(
				date.to === undefined
					? gte(records.time, date.from ?? new Date())
					: between(
							records.time,
							date.from ?? new Date(),
							dayjs.utc(date.to).add(1, 'day').toDate(),
					  ),
				eq(records.userId, userId),
			),
		orderBy: [desc(records.time)],
	})) as Record[]
}

export const getAvgGlucoseForPeriod = async (
	date: DateRange,
	userId: string,
) => {
	const res = await db
		.select({
			avg: sql<number>`cast(avg(${records.glucose}) as real)`,
		})
		.from(records)
		.where(
			and(
				eq(records.userId, userId),
				isNotNull(records.glucose),
				date.to === undefined
					? gte(records.time, date.from ?? new Date())
					: between(
							records.time,
							date.from ?? new Date(),
							dayjs.utc(date.to).add(1, 'day').toDate(),
					  ),
			),
		)
		.limit(1)
	return res[0].avg
}

export const getAvgDayInsulinForPeriod = async (
	date: DateRange,
	userId: string,
) => {
	const subquery = db
		.select({
			date: sql<Date>`date(${records.time}) as date`,
			sum: sql<number>`sum(coalesce(${records.shortInsulin}, 0) + coalesce(${records.longInsulin}, 0)) as sum`,
		})
		.from(records)
		.where(
			and(
				eq(records.userId, userId),
				date.to === undefined
					? gte(records.time, date.from ?? new Date())
					: between(
							records.time,
							date.from ?? new Date(),
							dayjs.utc(date.to).add(1, 'day').toDate(),
					  ),
			),
		)
		.groupBy(sql`date(${records.time})`)
		.as('sq')
	const res = await db
		.select({
			avg: sql<number>`cast(avg(sq.sum) as int)`,
		})
		.from(subquery)
	return res[0].avg
}
