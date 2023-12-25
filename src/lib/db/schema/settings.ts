import { users } from '@/lib/db/schema/auth'
import { selectRecordSchema } from '@/lib/db/schema/record'
import { relations } from 'drizzle-orm'
import { pgTable, text, uuid } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const settings = pgTable('settings', {
	id: uuid('id').defaultRandom().primaryKey(),
	shortInsulin: text('shortInsulin'),
	longInsulin: text('longInsulin'),
	userId: text('userId')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
})

export const settingsRelations = relations(settings, ({ one }) => ({
	user: one(users, {
		fields: [settings.userId],
		references: [users.id],
	}),
}))

export const insertSettingsSchema = createInsertSchema(settings)
export const selectSettingsSchema = createSelectSchema(settings)
export const settingsIdSchema = selectRecordSchema.pick({ id: true })
