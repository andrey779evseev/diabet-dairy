'use server'

import { db } from '@/lib/db'
import {
	insertSettingsSchema,
	selectSettingsSchema,
	settings,
} from '@/lib/db/schema/settings'
import { NewSettings, Settings } from '@/types/Settings'
import { eq } from 'drizzle-orm'

export async function createSettings(payload: NewSettings) {
	try {
		const newSettings = insertSettingsSchema.parse(payload)
		return (await db
			.insert(settings)
			.values(newSettings)
			.returning()) as unknown as Settings
	} catch (err) {
		const message = (err as Error).message ?? 'Error, please try again'
		console.error(message)
		return message
	}
}

export async function updateSettings(payload: Settings) {
	try {
		const { id, ...newSettings } = selectSettingsSchema.parse(payload)
		await db.update(settings).set(newSettings).where(eq(settings.id, id))
	} catch (err) {
		const message = (err as Error).message ?? 'Error, please try again'
		console.error(message)
		return message
	}
}
