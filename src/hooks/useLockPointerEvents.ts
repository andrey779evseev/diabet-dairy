import { useLayoutEffect } from 'react'

export function useLockPointerEvents(condition = true) {
	useLayoutEffect(() => {
    if (condition) {
      const originalStyle = window.getComputedStyle(document.body).pointerEvents
      document.body.style.pointerEvents = 'none'
      return () => {
        document.body.style.pointerEvents = originalStyle
      }
    }
	}, [condition])
}
