'use client'

import { ChevronUp, LucideIcon } from 'lucide-react'
import {
	createRef,
	memo,
	RefObject,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { useAgentDetect } from '@/hooks/useAgentDetect'
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
	const containerRef = useRef<HTMLDivElement>(null)
	const { isMobile } = useAgentDetect()
	const [animatedPointerOver, setAnimatedPointedOver] = useState(pointerOver)

	useEffect(() => {
		if (pointerOver === 0) {
			const timeout = setTimeout(() => setAnimatedPointedOver(pointerOver), 300)
			return () => clearTimeout(timeout)
		} else setAnimatedPointedOver(pointerOver)
	}, [pointerOver, setAnimatedPointedOver])

	const cancelTimeout = () => {
		if (timeoutId.current) clearTimeout(timeoutId.current)
		// @ts-ignore
		timeoutId.current = null
	}

	const end = useCallback(() => {
		cancelTimeout()
		if (!isPointerDown && pointerOver !== 0 && pointerOver !== null) {
			actions[pointerOver! - 1].action()
			setIsOpen(false)
			setPointerOver(null)
		}

		if (pointerOver === null || !isPointerDown) return

		if (new Date().getTime() - startedAt!.getTime() < 300)
			setIsOpen((prev) => !prev)
		else {
			if (pointerOver !== 0) actions[pointerOver! - 1].action()
			setIsOpen(false)
		}

		setIsPointerDown(false)
		setPointerOver(null)
	}, [actions, isPointerDown, pointerOver, startedAt])

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
		}, 300)
		setPointerOver(0)
	}

	const onTouchMove = (e: React.TouchEvent<HTMLButtonElement>) => {
		const touch = e.touches[0] || e.changedTouches[0]
		const el = document.elementFromPoint(touch.pageX, touch.pageY)
		const ref = refs.current.find(
			(ref) => ref.current === el || ref.current?.contains(el),
		)
		if (ref !== undefined && ref.current !== null && !!ref.current.id)
			setPointerOver(parseInt(ref.current.id))
		else if (
			containerRef.current !== null &&
			containerRef.current !== el &&
			!containerRef.current.contains(el)
		)
			setPointerOver(null)
		else setPointerOver(0)
	}

	useEffect(() => {
		const el = containerRef.current
		if (isMobile) {
			el?.addEventListener('touchend', end)

			return () => {
				el?.removeEventListener('touchend', end)
			}
		} else {
			const set = () => {
				setPointerOver(null)
			}
			el?.addEventListener('pointerup', end)
			el?.addEventListener('pointerleave', set)

			return () => {
				el?.removeEventListener('pointerup', end)
				el?.removeEventListener('pointerleave', set)
			}
		}
	}, [isMobile, end])

	return (
		<div
			className='fixed bottom-5 right-5 flex h-[172px] w-[172px] touch-none select-none items-end justify-end'
			ref={containerRef}
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
					variant={pointerOver === i + 1 ? 'default' : 'outline'}
					className={cn(
						styles[i][0],
						'absolute h-16 w-16 touch-none select-none rounded-full',
						{
							[styles[i][1]]: animatedIsOpen,
							invisible: !animatedIsOpen,
						},
					)}
					style={{
						scale: pointerOver === i + 1 ? '1.2' : '1',
						transition: 'scale 0.3s ease',
					}}
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
				variant={animatedPointerOver === 0 || !isOpen ? 'default' : 'outline'}
				className='h-16 w-16 touch-none select-none rounded-full animate-in fade-in'
				onPointerDown={start}
				onTouchStart={start}
				onTouchMove={onTouchMove}
				style={{
					scale: animatedPointerOver === 0 ? '1.2' : '1',
					transition: 'scale 0.3s ease',
				}}
			>
				<ChevronUp className='h-8 w-8' />
			</Button>
		</div>
	)
}

export default memo(MultiActionButton)
