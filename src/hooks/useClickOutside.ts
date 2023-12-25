import { useEffect, useLayoutEffect, useRef } from 'react'
import { useAgentDetect } from './useAgentDetect'

type Event = MouseEvent | TouchEvent

export function useClickOutside<T extends HTMLElement>(
	cb: (e?: Event) => void,
) {
	const ref = useRef<T>(null)
	const refCb = useRef(cb)
	const { isMobile } = useAgentDetect()

	useLayoutEffect(() => {
		refCb.current = cb
	})

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const handler = (e: Event) => {
			const element = ref.current
			if (element && !element.contains(e.target as Node | null)) {
				refCb.current(e)
			}
		}

		if (isMobile) {
			document.addEventListener('touchstart', handler)
			return () => {
				document.removeEventListener('touchstart', handler)
			}
		}
		document.addEventListener('mousedown', handler)
		return () => {
			document.removeEventListener('mousedown', handler)
		}
	}, [])

	return ref
}
