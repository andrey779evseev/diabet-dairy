'use client'

import { ChevronUp, LucideIcon } from 'lucide-react'
import { createRef, memo, RefObject, useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { useAnimationState } from '@/hooks/useAnimationState'

const styles = [
	[
		'top-0 right-0 data-[state=open]:animate-slide-in-blurred-bottom',
		'data-[state=closed]:animate-slide-out-blurred-bottom',
	],
	[
		'bottom-0 left-0 data-[state=open]:animate-slide-in-blurred-right',
		'data-[state=closed]:animate-slide-out-blurred-right',
	],
	[
		'top-6 left-6 data-[state=open]:animate-slide-in-blurred-br',
		'data-[state=closed]:animate-slide-out-blurred-br',
	],
]

type PropsType = {
	actions: {
		icon: LucideIcon
		action: () => void
	}[]
}

function MultiActionButton(props: PropsType) {
	const { actions } = props
	const [isOpen, setIsOpen] = useState(false)
	const [pointerOver, setPointerOver] = useState<number | null>(null)
	const animatedIsOpen = useAnimationState(isOpen)
	const [startedAt, setStartedAt] = useState<Date | null>(null)
	const timeoutId = useRef<NodeJS.Timeout>(null)
	const [isPointerDown, setIsPointerDown] = useState(false)
	const refs = useRef<RefObject<HTMLButtonElement>[]>([
		createRef(),
		createRef(),
		createRef(),
	])

	const cancelTimeout = () => {
		if (timeoutId.current) clearTimeout(timeoutId.current)
		// @ts-ignore
		timeoutId.current = null
	}

	const resetPointer = () => {
		cancelTimeout()
		if (!isPointerDown && pointerOver !== 0 && pointerOver !== null) {
			actions[pointerOver! - 1].action()
			setIsOpen(false)
			setPointerOver(null)
		}

		if (pointerOver === null || !isPointerDown) return

		if (new Date().getTime() - startedAt!.getTime() < 500)
			setIsOpen((prev) => !prev)
		else {
			if (pointerOver !== 0) actions[pointerOver! - 1].action()
			setIsOpen(false)
		}

		setIsPointerDown(false)
		setPointerOver(null)
	}

	const start = (
		e:
			| React.PointerEvent<HTMLButtonElement>
			| React.TouchEvent<HTMLButtonElement>,
	) => {
		e.preventDefault()
		setIsPointerDown(true)
		setStartedAt(new Date())
		cancelTimeout()
		// @ts-ignore
		timeoutId.current = setTimeout(() => {
			setIsOpen(true)
		}, 500)
		setPointerOver(0)
	}

	const onTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
		cancelTimeout()
		const changedTouch = e.changedTouches[0]
		const el = document.elementFromPoint(
			changedTouch.clientX,
			changedTouch.clientY,
		)
		const ref = refs.current.find(
			(ref) => ref.current === el || ref.current?.contains(el),
		)
		if (ref !== undefined && ref.current !== null && ref.current.id) {
			actions[parseInt(ref.current!.id) - 1].action()
		}

		setPointerOver(null)
		setIsPointerDown(false)
		setIsOpen(false)
	}

	return (
		<div
			className='fixed bottom-5 right-5 flex h-[172px] w-[172px] touch-none select-none items-end justify-end'
			onPointerUp={resetPointer}
			onPointerLeave={resetPointer}
			onTouchEnd={onTouchEnd}
		>
			{actions.map((action, i) => (
				<Button
					onPointerEnter={() => {
						setPointerOver(i + 1)
					}}
					onPointerLeave={() => {
						setPointerOver(0)
					}}
					size='icon'
					variant='outline'
					className={cn(
						styles[i][0],
						'absolute h-16 w-16 touch-none select-none rounded-full',
						{
							[styles[i][1]]: animatedIsOpen,
							invisible: !animatedIsOpen,
						},
					)}
					data-state={isOpen ? 'open' : 'closed'}
					key={i}
					ref={refs.current[i]}
					id={i + 1 + ''}
				>
					<action.icon className='h-8 w-8' />
				</Button>
			))}
			<Button
				size='icon'
				variant={isOpen ? 'outline' : 'default'}
				className='h-16 w-16 touch-none select-none rounded-full animate-in fade-in'
				onPointerDown={start}
				onTouchStart={start}
			>
				<ChevronUp className='h-8 w-8' />
			</Button>
		</div>
	)
}

export default memo(MultiActionButton)
