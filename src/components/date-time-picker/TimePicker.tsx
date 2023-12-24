'use client'

import { Clock } from 'lucide-react'
import * as React from 'react'
import { Label } from '@/components/ui/Label'
import TimePickerInput from './TimePickerInput'
import { useTranslation } from '@/lib/i18n/client'

type PropsType = {
	date: Date | undefined
	setDate: (date: Date | undefined) => void
}

export default function TimePicker(props: PropsType) {
	const { date, setDate } = props
	const minuteRef = React.useRef<HTMLInputElement>(null)
	const hourRef = React.useRef<HTMLInputElement>(null)
  const {t} = useTranslation()

	return (
		<div className='flex items-end gap-2'>
			<div className='grid gap-1 text-center'>
				<Label htmlFor='hours' className='text-xs'>
					{t('sheet.form.time.hours')}
				</Label>
				<TimePickerInput
					picker='hours'
					date={date}
					setDate={setDate}
					ref={hourRef}
					onRightFocus={() => minuteRef.current?.focus()}
				/>
			</div>
			<div className='grid gap-1 text-center'>
				<Label htmlFor='minutes' className='text-xs'>
        {t('sheet.form.time.minutes')}
				</Label>
				<TimePickerInput
					picker='minutes'
					date={date}
					setDate={setDate}
					ref={minuteRef}
					onLeftFocus={() => hourRef.current?.focus()}
				/>
			</div>
			<div className='flex h-10 items-center'>
				<Clock className='ml-2 h-4 w-4' />
			</div>
		</div>
	)
}
