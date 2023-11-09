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

	const reset = () => {
		if (timeoutId.current) clearTimeout(timeoutId.current)
		// @ts-ignore
		timeoutId.current = null

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
		if (timeoutId.current) clearTimeout(timeoutId.current)
		// @ts-ignore
		timeoutId.current = setTimeout(() => {
			setIsOpen(true)
		}, 500)
		setPointerOver(0)
	}

	return (
		<div
			className='relative flex h-[172px] w-[172px] select-none items-end justify-end'
			onPointerUp={() => {
				console.log('pointer up')
				reset()
			}}
			onPointerLeave={() => {
				console.log('pointer leave')
				reset()
			}}
			onTouchEnd={(e) => {
				console.log('touch end', e)
				const ref = refs.current.find(
					(ref) =>
						ref.current === e.target || ref.current?.contains(e.target as Node),
				)
        console.log('ref', ref, ref !== undefined && ref.current !== null && ref.current.id)

        if(ref !== undefined && ref.current !== null && ref.current.id)
          setPointerOver(parseInt(ref.current.id))
        
				reset()
			}}
		>
			{actions.map((action, i) => (
				<Button
					onPointerEnter={() => {
						console.log('pointer enter', i + 1)
						setPointerOver(i + 1)
					}}
					onPointerLeave={() => {
						console.log('pointer leave', i + 1)
						setPointerOver(0)
					}}
					size='icon'
					variant='outline'
					className={cn(
						styles[i][0],
						'absolute h-16 w-16 select-none rounded-full',
						{
							[styles[i][1]]: animatedIsOpen,
							invisible: !animatedIsOpen,
						},
					)}
					isFocused={pointerOver === i + 1}
					data-state={isOpen ? 'open' : 'closed'}
					key={i}
					ref={refs.current[i]}
					id={i + 1}
				>
					<action.icon className='h-8 w-8' />
				</Button>
			))}
			<Button
				size='icon'
				variant={isOpen ? 'outline' : 'default'}
				className='h-16 w-16 select-none rounded-full animate-in fade-in'
				onPointerDown={(e) => {
					console.log('pointer down')
					start(e)
				}}
				onTouchStart={(e) => {
					console.log('touch start')
					start(e)
				}}
			>
				<ChevronUp className='h-8 w-8' />
			</Button>
		</div>
	)
}

export default memo(MultiActionButton)
