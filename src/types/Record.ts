import z from 'zod'
import { recordIdSchema } from '@/lib/db/schema/record'

const RecordTypeEnum = z.enum(['food', 'insulin', 'glucose', 'activity'])
const RecordRelativeToFoodEnum = z.enum(['before', 'after', 'none'])

const GlucoseSchema = z.object({
	type: z.literal(RecordTypeEnum.enum.glucose),
	glucose: z.number().min(1).nonnegative(),
	relativeToFood: RecordRelativeToFoodEnum.optional(),
	description: z.string().max(200).optional(),
})

const FoodSchema = z.object({
	type: z.literal(RecordTypeEnum.enum.food),
	description: z.string().min(5).max(500),
})

const InsulinSchema = z.object({
	type: z.literal(RecordTypeEnum.enum.insulin),
	relativeToFood: RecordRelativeToFoodEnum.optional(),
	shortInsulin: z.number().nonnegative().optional(),
	longInsulin: z.number().nonnegative().optional(),
	description: z.string().max(200).optional(),
})

const ActivitySchema = z.object({
	type: z.literal(RecordTypeEnum.enum.activity),
	description: z.string().min(5).max(200),
})

export const RecordDataSchema = z.discriminatedUnion('type', [
	FoodSchema,
	GlucoseSchema,
	InsulinSchema,
	ActivitySchema,
])

export const NewRecordSchema = z
	.object({
		time: z.date(),
	})
	.and(RecordDataSchema)
	.superRefine((data, ctx) => {
		if (
			data.type === 'insulin' &&
			data.shortInsulin === undefined &&
			data.longInsulin === undefined
		) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				params: { i18n: 'sheet_insulin_error' },
				path: ['shortInsulin'],
			})
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				params: { i18n: 'sheet_insulin_error' },
				path: ['longInsulin'],
			})
		}
		return z.NEVER
	})

export const RecordSchema = z
	.object({
		id: z.string().max(50),
		userId: z.string().min(1),
	})
	.and(NewRecordSchema)

export type Record = z.infer<typeof RecordSchema>
export type NewRecord = z.infer<typeof NewRecordSchema>
export type RecordDataType = z.infer<typeof RecordDataSchema>
export type RecordType = z.infer<typeof RecordTypeEnum>
export type RecordRelativeToFoodType = z.infer<typeof RecordRelativeToFoodEnum>
export type RecordId = z.infer<typeof recordIdSchema>['id']
