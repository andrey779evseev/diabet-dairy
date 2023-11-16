'use server'

import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { settings } from '@/lib/db/schema/settings'
import { Settings, SettingsId } from '@/types/Settings'

export const getSettings = async (userId: SettingsId) => {
	const res = await db.query.settings.findFirst({
		where: eq(settings.userId, userId),
	})
	if (res === undefined) {
		console.error('get settings error by userId:', userId)
		return undefined as unknown as Settings
	}
	return res!
}
