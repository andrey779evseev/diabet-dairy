import { relations } from 'drizzle-orm'
import { jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { users } from '@/lib/db/schema/auth'
import { RecordDataType } from '@/types/Record'

export const records = pgTable('records', {
	id: uuid('id').defaultRandom().primaryKey(),
	userId: text('userId')
		.notNull()
		.references(() => users.id),
	time: timestamp('time').notNull().defaultNow(),
	data: jsonb('data').$type<RecordDataType>().notNull(),
})

export const recordsRelations = relations(records, ({ one }) => ({
	author: one(users, {
		fields: [records.userId],
		references: [users.id],
	}),
}))

// Schema for CRUD - used to validate API requests
export const insertRecordSchema = createInsertSchema(records, {
	data: z.custom<RecordDataType>(),
})
export const selectRecordSchema = createSelectSchema(records, {
	data: z.custom<RecordDataType>(),
})
export const recordIdSchema = selectRecordSchema.pick({ id: true })
