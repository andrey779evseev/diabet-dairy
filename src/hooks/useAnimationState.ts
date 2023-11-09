import { useEffect, useState } from 'react'

export const useAnimationState = (value: boolean, duration = 500) => {
	const [internalValue, setInternalValue] = useState(value)

	useEffect(() => {
		if (!value) {
			const timeout = setTimeout(() => setInternalValue(false), duration)
			return () => clearTimeout(timeout)
		} else setInternalValue(true)
	}, [value, setInternalValue, duration])

	return internalValue
}
