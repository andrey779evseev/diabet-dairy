'use client'

import { ChevronUp, LucideIcon } from 'lucide-react'
import { memo, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const styles = [
	[
		'bottom-[170%] right-0 data-[state=open]:animate-slide-in-blurred-bottom',
		'data-[state=closed]:animate-slide-out-blurred-bottom',
	],
	[
		'bottom-0 right-[170%] data-[state=open]:animate-slide-in-blurred-right',
		'data-[state=closed]:animate-slide-out-blurred-right',
	],
	[
		'bottom-[120%] right-[120%] data-[state=open]:animate-slide-in-blurred-br',
		'data-[state=closed]:animate-slide-out-blurred-br',
	],
]

type PropsType = {
	/**
	 * object must be {icon, action} or {el}
	 */
	actions: {
		icon?: LucideIcon
		action?: () => void
		el?: JSX.Element
	}[]
}

function MultiActionButton(props: PropsType) {
	const { actions } = props
	const [isOpen, setIsOpen] = useState(false)
	const [deferredIsOpen, setDeferredIsOpen] = useState(false)
	const timeoutId = useRef<NodeJS.Timeout | null>(null)

	useEffect(() => {
		if (isOpen) setDeferredIsOpen(isOpen)
		else {
			timeoutId.current = setTimeout(() => {
				setDeferredIsOpen(isOpen)
			}, 1500)
			return () => {
				if (timeoutId.current) clearTimeout(timeoutId.current)
			}
		}
	}, [isOpen])

	return (
		<div className='relative h-fit w-fit'>
			{actions.map((action, i) => (
				<Button
					size='icon'
					variant='outline'
					className={cn(styles[i][0], 'absolute h-16 w-16 rounded-full', {
						[styles[i][1]]: deferredIsOpen,
						invisible: !deferredIsOpen,
					})}
					data-state={isOpen ? 'open' : 'closed'}
					key={i}
					onClick={() => {
						if (action.action) {
							action.action()
							setIsOpen(false)
						}
					}}
				>
					{action.el !== undefined ? action.el : null}
					{action.icon === undefined ? null : (
						<action.icon className='h-8 w-8' />
					)}
				</Button>
			))}
			<Button
				size='icon'
				variant={isOpen ? 'outline' : 'default'}
				className='h-16 w-16 touch-none rounded-full animate-in fade-in'
				onClick={() => setIsOpen(!isOpen)}
			>
				<ChevronUp className='h-8 w-8' />
			</Button>
		</div>
	)
}

export default memo(MultiActionButton)
