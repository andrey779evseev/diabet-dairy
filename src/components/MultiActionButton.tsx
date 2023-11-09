'use client'

import { ChevronUp, LucideIcon } from 'lucide-react'
import { memo, useRef, useState } from 'react'
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

	const start = (e: React.PointerEvent<HTMLButtonElement>) => {
		e.preventDefault()
		setIsPointerDown(true)
		setStartedAt(new Date())
		// @ts-ignore
		timeoutId.current = setTimeout(() => {
			setIsOpen(true)
		}, 500)
		setPointerOver(0)
	}

	return (
		<div
			className='relative flex h-[172px] w-[172px] items-end justify-end'
			onPointerUp={reset}
			onPointerLeave={reset}
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
					className={cn(styles[i][0], 'absolute h-16 w-16 rounded-full', {
						[styles[i][1]]: animatedIsOpen,
						invisible: !animatedIsOpen,
					})}
					data-state={isOpen ? 'open' : 'closed'}
					key={i}
				>
					<action.icon className='h-8 w-8' />
				</Button>
			))}
			<Button
				size='icon'
				variant={isOpen ? 'outline' : 'default'}
				className='h-16 w-16 touch-none rounded-full animate-in fade-in'
				onPointerDown={start}
			>
				<ChevronUp className='h-8 w-8' />
			</Button>
		</div>
	)
}

export default memo(MultiActionButton)
