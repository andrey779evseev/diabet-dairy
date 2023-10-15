import z from 'zod'
import {
	insertRecordSchema,
	recordIdSchema,
	selectRecordSchema,
} from '@/lib/db/schema/record'

const RecordTypeEnum = z.enum(['food', 'insulin', 'glucose'])
const RecordRelativeToFoodEnum = z.enum(['before', 'after', 'none'])

const GlucoseSchema = z.object({
	type: z.literal(RecordTypeEnum.enum.glucose),
	glucose: z.number().nonnegative(),
	relativeToFood: RecordRelativeToFoodEnum,
})

const FoodSchema = z.object({
	type: z.literal(RecordTypeEnum.enum.food),
	description: z.string().min(5).max(500),
})

const InsulinSchema = z.object({
	type: z.literal(RecordTypeEnum.enum.insulin),
	relativeToFood: RecordRelativeToFoodEnum,
	dose: z
		.object({
			actrapid: z.number().nonnegative().optional(),
			protofan: z.number().nonnegative().optional(),
		})
		.refine(
			(dose) => !!dose.actrapid || !!dose.protofan,
			'Either actrapid or protofan should be filled in.'
		),
})

export const RecordDataSchema = z.discriminatedUnion('type', [
	FoodSchema,
	GlucoseSchema,
	InsulinSchema,
])

export const RecordSchema = z.object({
	id: z.string().max(50),
	time: z.date(),
	data: RecordDataSchema,
	userId: z.string().min(1),
})

// export type Record = z.infer<typeof RecordSchema>
export type Record = z.infer<typeof selectRecordSchema>
export type NewRecord = z.infer<typeof insertRecordSchema>
export type RecordDataType = z.infer<typeof RecordDataSchema>
export type RecordType = z.infer<typeof RecordTypeEnum>
export type RecordRelativeToFoodType = z.infer<typeof RecordRelativeToFoodEnum>
export type RecordId = z.infer<typeof recordIdSchema>['id']
