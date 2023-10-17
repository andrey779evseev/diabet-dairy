'use server'

import { eq, inArray } from 'drizzle-orm'
import { db } from '@/lib/db'
import { insertRecordSchema, records } from '@/lib/db/schema/record'
import { NewRecord, RecordId } from '@/types/Record'

export async function createRecord(record: NewRecord) {
	try {
		const newRecord = insertRecordSchema.parse(record)
		await db.insert(records).values(newRecord)
	} catch (err) {
		const message = (err as Error).message ?? 'Error, please try again'
		console.error(message)
		return message
	}
}

export async function createRecords(recs: NewRecord[]) {
	try {
		const newRecords = []
		for (const record in recs) {
			const newRecord = insertRecordSchema.parse(record)
			newRecords.push(newRecord)
		}
		await db.insert(records).values(newRecords)
	} catch (err) {
		const message = (err as Error).message ?? 'Error, please try again'
		console.error(message)
		return message
	}
}

export async function deleteRecord(id: RecordId) {
	try {
		await db.delete(records).where(eq(records.id, id))
	} catch (err) {
		const message = (err as Error).message ?? 'Error, please try again'
		console.error(message)
		return message
	}
}

export async function deleteRecords(ids: RecordId[]) {
	try {
		await db.delete(records).where(inArray(records.id, ids))
	} catch (err) {
		const message = (err as Error).message ?? 'Error, please try again'
		console.error(message)
		return message
	}
}

export async function updateRecord(record: NewRecord) {
	try {
		const { id, ...newRecord } = insertRecordSchema.parse(record)
		await db.update(records).set(newRecord).where(eq(records.id, id!))
	} catch (err) {
		const message = (err as Error).message ?? 'Error, please try again'
		console.error(message)
		return message
	}
}
