'use client'

import { useButton } from '@react-aria/button'
import { DateValue, useDatePicker } from '@react-aria/datepicker'
import { useInteractOutside } from '@react-aria/interactions'
import {
	DatePickerStateOptions,
	useDatePickerState,
} from '@react-stately/datepicker'
import { CalendarIcon } from 'lucide-react'
import React, { useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/Popover'
import { cn } from '@/lib/utils'
import { useForwardedRef } from '@/hooks/useForwardedRef'
import { Calendar } from './Calendar'
import { DateField } from './DateField'
import { TimeField } from './TimeField'

const DateTimePicker = React.forwardRef<
	HTMLDivElement,
	DatePickerStateOptions<DateValue>
>((props, forwardedRef) => {
	const ref = useForwardedRef(forwardedRef)
	const buttonRef = useRef<HTMLButtonElement | null>(null)
	const contentRef = useRef<HTMLDivElement | null>(null)

	const [open, setOpen] = useState(false)

	const state = useDatePickerState(props)
	const {
		groupProps,
		fieldProps,
		buttonProps: _buttonProps,
		dialogProps,
		calendarProps,
	} = useDatePicker(props, state, ref)
	const { buttonProps } = useButton(_buttonProps, buttonRef)
	useInteractOutside({
		ref: contentRef,
		onInteractOutside: (e) => {
			setOpen(false)
		},
	})

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<div
					{...groupProps}
					ref={ref}
					className={cn(
						groupProps.className,
						'flex items-center rounded-md ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
					)}
				>
					<DateField {...fieldProps} />
					<Button
						{...buttonProps}
						variant='outline'
						className='rounded-l-none'
						disabled={props.isDisabled}
						onClick={() => setOpen(true)}
					>
						<CalendarIcon className='h-5 w-5' />
					</Button>
				</div>
			</PopoverTrigger>
			<PopoverContent ref={contentRef} className='w-full' align='start'>
				<div {...dialogProps} className='space-y-3'>
					<Calendar {...calendarProps} />
					{!!state.hasTime && (
						<TimeField
							value={state.timeValue}
							onChange={state.setTimeValue}
							hideTimeZone
						/>
					)}
				</div>
			</PopoverContent>
		</Popover>
	)
})

DateTimePicker.displayName = 'DateTimePicker'

export { DateTimePicker }
