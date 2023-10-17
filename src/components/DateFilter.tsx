'use client'

import { LocaleAtom, LocalesAtom } from '@/state/atoms'
import dayjs from 'dayjs'
import { useAtomValue } from 'jotai/react'
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
import { cn } from '@/lib/utils'

type PropsType = {
	date: DateRange | undefined
	setDate: (date: DateRange | undefined) => void
}

function DateFilter(props: PropsType) {
	const { date, setDate } = props
	const locales = useAtomValue(LocalesAtom)
	const locale = useAtomValue(LocaleAtom)
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					id='date'
					variant='outline'
					className={cn(
						'mb-2 w-full justify-start text-left font-normal',
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
			<PopoverContent className='w-auto p-0' align='start'>
				<Calendar
					initialFocus
					mode='range'
					defaultMonth={date?.from}
					selected={date}
					onSelect={setDate}
					numberOfMonths={1}
				/>
			</PopoverContent>
		</Popover>
	)
}

export default memo(DateFilter)
