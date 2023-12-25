'use client'

import { Button } from '@/components/ui/Button'
import { Calendar } from '@/components/ui/Calendar'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/Popover'
import { useTranslation } from '@/lib/i18n/client'
import { cn } from '@/lib/utils'
import dayjs from 'dayjs'
import { Calendar as CalendarIcon } from 'lucide-react'
import { useParams } from 'next/navigation'
import TimePicker from './TimePicker'

type PropsType = {
	value: Date | undefined
	onChange: (value: Date | undefined) => void
}

export default function DateTimePicker(props: PropsType) {
	const { onChange, value: date } = props
	const { t } = useTranslation()
	const { lang } = useParams<{ lang: string }>()

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					className={cn(
						'w-full justify-start text-left font-normal',
						!date && 'text-muted-foreground',
					)}
					type='button'
				>
					<CalendarIcon className='mr-2 h-4 w-4' />
					{date ? (
						dayjs(date).locale(lang).format('MMMM DD, YYYY HH:mm')
					) : (
						<span>{t('filters.date.placeholder')}</span>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-auto p-0' portal={false} align='start'>
				<Calendar
					mode='single'
					selected={date}
					onSelect={onChange}
					initialFocus
				/>
				<div className='border-t border-border p-3'>
					<TimePicker setDate={onChange} date={date} />
				</div>
			</PopoverContent>
		</Popover>
	)
}
