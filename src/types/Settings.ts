import {
	insertSettingsSchema,
	selectSettingsSchema,
	settingsIdSchema,
} from '@/lib/db/schema/settings'
import { z } from 'zod'

// export const NewSettingsSchema = z.object({
//   shortInsulin: z.string().optional(),
//   longInsulin: z.string().optional(),
//   userId: z.string().min(1),
// })

// export const SettingsSchema = NewSettingsSchema.and(z.object({
//   id: z.string().min(1)
// }))

export type NewSettings = z.infer<typeof insertSettingsSchema>
export type Settings = z.infer<typeof selectSettingsSchema>
export type SettingsId = z.infer<typeof settingsIdSchema>['id']
