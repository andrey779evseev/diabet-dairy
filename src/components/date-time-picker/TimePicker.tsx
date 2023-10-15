'use client'

import { TimeValue } from '@react-aria/datepicker'
import { TimeFieldStateOptions } from '@react-stately/datepicker'
import React from 'react'
import { TimeField } from './TimeField'

const TimePicker = React.forwardRef<
	HTMLDivElement,
	Omit<TimeFieldStateOptions<TimeValue>, 'locale'>
>((props, forwardedRef) => {
	return <TimeField {...props} />
})

TimePicker.displayName = 'TimePicker'

export { TimePicker }
