'use client'

import { useLocales } from '@/state/atoms'
import dayjs from 'dayjs'
import { Bar, BarChart, Tooltip, YAxis } from 'recharts'
import { memo, useMemo, useState } from 'react'
import { DateRange } from 'react-day-picker'
import DateFilter from '@/components/DateFilter'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/Select'
import type { Record } from '@/types/Record'

type PropsType = {
	records: Record[]
	fetchRecords: (date: DateRange) => Promise<Record[]>
}

function GraphsPageContent(props: PropsType) {
	const { records: initialRecords, fetchRecords } = props
	const [date, setDate] = useState<DateRange | undefined>(() => {
		const now = new Date()
		now.setHours(0, 0, 0, 0)
		return {
			from: now,
			to: undefined,
		}
	})
	const [type, setType] = useState<'glucose' | 'insulin'>('glucose')
	const [records, setRecords] = useState(initialRecords)
	const locales = useLocales()

	const data = useMemo(() => {
		return records
			.filter((record) => record.data.type === type)
			.map((record) => {
				if (record.data.type === 'glucose')
					return {
						time: record.time,
						glucose: record.data.glucose,
					}
				else if (record.data.type === 'insulin')
					return {
						time: record.time,
						actrapid: record.data.dose.actrapid ?? 0,
						protofan: record.data.dose.protofan ?? 0,
					}
			})
	}, [records, type])

	const updateDate = async (date: DateRange | undefined) => {
		setDate(date)
		if (date === undefined) {
			setRecords([])
			return
		}
		const res = await fetchRecords(date)
		setRecords(res)
	}

	return (
		<div className='flex flex-col gap-2'>
			<DateFilter date={date} setDate={(e) => updateDate(e)} />
			<Select
				onValueChange={(e) => setType(e as 'glucose' | 'insulin')}
				defaultValue='glucose'
			>
				<SelectTrigger>
					<SelectValue placeholder={locales?.filters.type.placeholder} />
				</SelectTrigger>
				<SelectContent position='popper'>
					<SelectItem value='glucose'>
						{locales?.filters.type.options.glucose}
					</SelectItem>
					<SelectItem value='insulin'>
						{locales?.filters.type.options.insulin}
					</SelectItem>
				</SelectContent>
			</Select>
			<Card className='w-full'>
				<CardHeader>
					<CardTitle>Graphs</CardTitle>
				</CardHeader>
				<CardContent className='h-[550px] w-full overflow-x-auto p-2'>
					<BarChart data={data} height={550} width={data.length * 30}>
						<Tooltip
							content={<CustomMultipleValueTooltip />}
							cursor={{ fill: '#ffffff', fillOpacity: '0.5' }}
						/>
						<YAxis
							stroke='#888888'
							fontSize={12}
							tickMargin={16}
							tickLine={false}
							axisLine={false}
							tickFormatter={(value) =>
								`${value} ${type === 'glucose' ? locales?.units.glucose : ''}`
							}
							width={type === 'glucose' ? 80 : 30}
						/>
						{type === 'glucose' ? (
							<Bar dataKey='glucose' fill='#E11D48' radius={[4, 4, 0, 0]} />
						) : (
							<>
								<Bar dataKey='actrapid' fill='#2464EB' radius={[4, 4, 0, 0]} />
								<Bar dataKey='protofan' fill='#17A44A' radius={[4, 4, 0, 0]} />
							</>
						)}
					</BarChart>
				</CardContent>
			</Card>
		</div>
	)
}

const CustomMultipleValueTooltip = ({
	active,
	payload,
}: {
	active?: boolean
	payload?: any[]
	label?: number
}) => {
	const locales = useLocales()
	if (active && payload && payload.length > 0) {
		const data = payload[0].payload
		return (
			<div className='z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95'>
				<div className='flex flex-col items-center gap-1'>
					<span className='font-semibold'>
						{dayjs(data.time).format('HH:mm')}
					</span>
					<span>{dayjs(data.time).format('DD.MM.YYYY')}</span>
					{data.glucose !== undefined ? (
						<span>
							{data.glucose} {locales?.units.glucose}
						</span>
					) : (
						<>
							<span>Actrapid: {data.actrapid}</span>
							<span>Protofan: {data.protofan}</span>
						</>
					)}
				</div>
			</div>
		)
	}
	return null
}

export default memo(GraphsPageContent)
