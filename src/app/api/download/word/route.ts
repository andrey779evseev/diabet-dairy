import dayjs from 'dayjs'
import type { DateRange } from 'react-day-picker'
import { NextResponse } from 'next/server'
import { getRecordsByUserIdAndDateRange } from '@/lib/api/record/queries'
import { getUserAuth } from '@/lib/auth'
import { groupBy } from '@/lib/utils'
import { RecordType } from '@/types/Record'
import { getLocales } from '@/localization/locales'

const { Document, Packer, Paragraph, TextRun } = require('docx')

export async function GET(req: Request) {
	const session = await getUserAuth()

	if (!session) return new Response('Unauthorized', { status: 401 })

	const url = new URL(req.url)
	const from = url.searchParams.get('from')
	const to = url.searchParams.get('to')
	const type = url.searchParams.get('type') as RecordType | 'all' | null
	const locale = url.searchParams.get('locale')

	if (
		type === null ||
		((from === null || from === 'undefined') &&
			(to === null || to === 'undefined'))
	)
		return new Response('Invalid search params provided', { status: 422 })

	const lang = locale === 'ru' ? 'ru' : 'en'

	const locales = await getLocales(lang)

	const range: DateRange = {
		from:
			from !== null && from !== 'undefined' ? new Date(from) : new Date(to!),
		to:
			from !== null && to !== null && to !== 'undefined'
				? new Date(to)
				: undefined,
	}

	const data = await getRecordsByUserIdAndDateRange(range, session.user.id)

	const records = data.filter(
		(record) => type === 'all' || record.data.type === type,
	)

	const groups = groupBy(records, (record) =>
		dayjs(record.time).format('DD.MM.YYYY'),
	)

	const doc = new Document({
		sections: [
			{
				properties: {},
				children: groups
					.sort((a, b) => {
						const parsedA = a.value.split('.')
						const parsedB = b.value.split('.')
						return parsedA[1] === parsedB[1]
							? parsedB[0].localeCompare(parsedA[0])
							: parsedB[1].localeCompare(parsedA[1])
					})
					.map(
						(group, j) =>
							new Paragraph({
								children: [
									new TextRun({
										text: group.value,
										bold: true,
										break: j !== 0 ? 1 : 0,
										font: 'Arial',
										size: 24,
									}),
									...group.items
										.map((record, i) => {
											return [
												new TextRun({
													text: `${dayjs(record.time).format('HH:mm')} - `,
													break: i === 0 ? 2 : 1,
													font: 'Arial',
													size: 22,
												}),
												new TextRun({
													text: locales.table.data.type[record.data.type],
													font: 'Arial',
													italics: true,
													size: 24,
												}),
												new TextRun({
													text: `${
														(record.data.type === 'glucose' ||
															record.data.type === 'insulin') &&
														record.data.relativeToFood !== undefined &&
														record.data.relativeToFood !== 'none'
															? ` (${
																	locales.table.data.relativeToFood[
																		record.data.relativeToFood
																	]
															  })`
															: ''
													} - `,
													font: 'Arial',
													size: 22,
												}),
												new TextRun({
													text:
														record.data.type === 'glucose'
															? `${record.data.glucose} ${locales.units.glucose}`
															: '',
													font: 'Arial',
													size: 22,
													highlight: 'yellow',
												}),
												new TextRun({
													text:
														record.data.type === 'insulin' &&
														record.data.dose?.actrapid !== undefined
															? `${locales.table.data.insulin.actrapid}: ${record.data.dose.actrapid}`
															: '',
													font: 'Arial',
													size: 22,
												}),
												new TextRun({
													text:
														record.data.type === 'insulin' &&
														record.data.dose?.actrapid !== undefined &&
														record.data.dose?.protofan !== undefined
															? ', '
															: '',
													font: 'Arial',
													size: 22,
												}),
												new TextRun({
													text:
														record.data.type === 'insulin' &&
														record.data.dose?.protofan !== undefined
															? `${locales.table.data.insulin.protofan}: ${record.data.dose.protofan}`
															: '',
													font: 'Arial',
													size: 22,
												}),
												new TextRun({
													text:
														record.data.description !== undefined
															? record.data.type !== 'food' &&
															  record.data.type !== 'activity'
																? `, ${record.data.description}`
																: record.data.description
															: '',
													font: 'Arial',
													size: 22,
												}),
											]
										})
										.flat(),
								],
							}),
					),
			},
		],
	})

	const blob = await Packer.toBlob(doc)

	const headers = new Headers()

	headers.set(
		'Content-Type',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	)

	return new NextResponse(blob, { status: 200, statusText: 'OK', headers })
}
