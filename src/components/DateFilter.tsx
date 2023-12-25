'use client'

import { Button } from '@/components/ui/Button'
import { Calendar } from '@/components/ui/Calendar'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/Popover'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/Select'
import { useTranslation } from '@/lib/i18n/client'
import { cn, getClearNow } from '@/lib/utils'
import dayjs from 'dayjs'
import { CalendarIcon } from 'lucide-react'
import { useParams } from 'next/navigation'
import { memo, useMemo } from 'react'
import { DateRange } from 'react-day-picker'

type PropsType = {
	date: DateRange | undefined
	setDate: (date: DateRange | undefined) => void
}

function DateFilter(props: PropsType) {
	const { date, setDate } = props
	const { lang } = useParams<{ lang: string }>()
	const { t } = useTranslation()

	const dateRangeOptions = useMemo(
		() => [
			{
				label: t('filters.date.select.options.today'),
				value: 0,
			},
			{
				label: t('filters.date.select.options.yesterday'),
				value: 1,
			},
			{
				label: t('filters.date.select.options.last3Days'),
				value: 2,
			},
			{
				label: t('filters.date.select.options.lastWeek'),
				value: 6,
			},
			{
				label: t('filters.date.select.options.last2Weeks'),
				value: 13,
			},
			{
				label: t('filters.date.select.options.lastMonth'),
				value: 30,
			},
		],
		[t],
	)

	const handleSelect = (range: DateRange | undefined) => {
		if (
			range !== undefined &&
			range.from !== undefined &&
			range.to === undefined
		)
			setDate({
				from: range.from,
				to: range.from,
			})
		else setDate(range)
	}

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					id='date'
					variant='outline'
					className={cn(
						'w-full justify-start text-left font-normal',
						!date && 'text-muted-foreground',
					)}
				>
					<CalendarIcon className='mr-2 h-4 w-4' />
					{date?.from ? (
						date.to ? (
							<>
								{dayjs(date.from).locale(lang).format('MMMM DD, YYYY')} -{' '}
								{dayjs(date.to).locale(lang).format('MMMM DD, YYYY')}
							</>
						) : (
							dayjs(date.from).locale(lang).format('MMMM DD, YYYY')
						)
					) : (
						<span>{t('filters.date.placeholder')}</span>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className='flex w-auto flex-col space-y-2 p-2'
				align='start'
			>
				<Select
					onValueChange={(value) => {
						const now = getClearNow()
						setDate({
							from:
								value === '0'
									? now
									: dayjs(now).add(-parseInt(value), 'day').toDate(),
							to:
								value === '0'
									? undefined
									: value === '1'
									  ? dayjs(now).add(-parseInt(value), 'day').toDate()
									  : now,
						})
					}}
				>
					<SelectTrigger>
						<SelectValue placeholder={t('filters.date.select.placeholder')} />
					</SelectTrigger>
					<SelectContent position='popper'>
						{dateRangeOptions.map((o, i) => (
							<SelectItem value={o.value.toString()} key={i}>
								{o.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<div className='rounded-md border'>
					<Calendar
						initialFocus
						mode='range'
						defaultMonth={date?.from}
						selected={date}
						onSelect={handleSelect}
						numberOfMonths={1}
					/>
				</div>
			</PopoverContent>
		</Popover>
	)
}

export default memo(DateFilter)
