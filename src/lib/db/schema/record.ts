import { relations } from 'drizzle-orm'
import {
	pgEnum,
	pgTable,
	real,
	smallint,
	text,
	timestamp,
	uuid,
} from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { users } from '@/lib/db/schema/auth'

export const typeEnum = pgEnum('type', [
	'insulin',
	'activity',
	'food',
	'glucose',
])
export const relativeToFoodEnum = pgEnum('relativeToFood', [
	'before',
	'after',
	'none',
])

export const records = pgTable('records', {
	id: uuid('id').defaultRandom().primaryKey(),
	time: timestamp('time').notNull().defaultNow(),
	type: typeEnum('type'),
	glucose: real('glucose'),
	relativeToFood: relativeToFoodEnum('relative_to_food'),
	description: text('description'),
	shortInsulin: smallint('shortInsulin'),
	longInsulin: smallint('longInsulin'),
	userId: text('userId')
		.notNull()
		.references(() => users.id),
})

export const recordsRelations = relations(records, ({ one }) => ({
	author: one(users, {
		fields: [records.userId],
		references: [users.id],
	}),
}))

// Schema for CRUD - used to validate API requests
export const insertRecordSchema = createInsertSchema(records)
export const selectRecordSchema = createSelectSchema(records)
export const recordIdSchema = selectRecordSchema.pick({ id: true })
