'use client'

import { useLocale, useLocales } from '@/state/atoms'
import dayjs from 'dayjs'
import { CalendarIcon } from 'lucide-react'
import { memo } from 'react'
import { DateRange } from 'react-day-picker'
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
import { cn } from '@/lib/utils'

type PropsType = {
	date: DateRange | undefined
	setDate: (date: DateRange | undefined) => void
}

function DateFilter(props: PropsType) {
	const { date, setDate } = props
	const locales = useLocales()
	const locale = useLocale()
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
								{dayjs(date.from).locale(locale).format('MMMM DD, YYYY')} -{' '}
								{dayjs(date.to).locale(locale).format('MMMM DD, YYYY')}
							</>
						) : (
							dayjs(date.from).locale(locale).format('MMMM DD, YYYY')
						)
					) : (
						<span>{locales?.filters.date.placeholder}</span>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className='flex w-auto flex-col space-y-2 p-2'
				align='start'
			>
				<Select
					onValueChange={(value) => {
						const now = new Date()
						now.setHours(0, 0, 0, 0)
						setDate({
							from:
								value === '0'
									? now
									: dayjs(now).add(-parseInt(value), 'day').toDate(),
							to: value === '1' || value === '0' ? undefined : now,
						})
					}}
					defaultValue='0'
				>
					<SelectTrigger>
						<SelectValue
							placeholder={locales?.filters.date.select.placeholder}
						/>
					</SelectTrigger>
					<SelectContent position='popper'>
						<SelectItem value='0'>
							{locales?.filters.date.select.options.today}
						</SelectItem>
						<SelectItem value='1'>
							{locales?.filters.date.select.options.yesterday}
						</SelectItem>
						<SelectItem value='3'>
							{locales?.filters.date.select.options.last3Days}
						</SelectItem>
						<SelectItem value='7'>
							{locales?.filters.date.select.options.lastWeek}
						</SelectItem>
						<SelectItem value='14'>
							{locales?.filters.date.select.options.last2Weeks}
						</SelectItem>
						<SelectItem value='30'>
							{locales?.filters.date.select.options.lastMonth}
						</SelectItem>
					</SelectContent>
				</Select>
				<div className='rounded-md border'>
					<Calendar
						initialFocus
						mode='range'
						defaultMonth={date?.from}
						selected={date}
						onSelect={setDate}
						numberOfMonths={1}
					/>
				</div>
			</PopoverContent>
		</Popover>
	)
}

export default memo(DateFilter)
