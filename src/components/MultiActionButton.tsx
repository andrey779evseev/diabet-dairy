'use client'

import { ChevronUp, LucideIcon } from 'lucide-react'
import { memo, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useMounted } from '@/hooks/useMounted'

const styles = [
	'absolute bottom-[170%] right-0 h-10 w-10 rounded-full data-[state=closed]:animate-slide-out-blurred-bottom data-[state=open]:animate-slide-in-blurred-bottom',
	'absolute bottom-0 right-[170%] h-10 w-10 rounded-full data-[state=closed]:animate-slide-out-blurred-right data-[state=open]:animate-slide-in-blurred-right',
	'absolute bottom-[120%] right-[120%] h-10 w-10 rounded-full data-[state=closed]:animate-slide-out-blurred-br data-[state=open]:animate-slide-in-blurred-br',
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
	const isMounted = useMounted()

	if (!isMounted) return null

	return (
		<div className='relative h-fit w-fit'>
			{actions.map((action, i) => (
				<Button
					size='icon'
					variant='outline'
					className={styles[i]}
					data-state={isOpen ? 'open' : 'closed'}
					key={i}
					onClick={() => {
						action.action()
						setIsOpen(false)
					}}
				>
					<action.icon className='h-5 w-5' />
				</Button>
			))}
			<Button
				size='icon'
				variant={isOpen ? 'outline' : 'default'}
				className='h-10 w-10 touch-none rounded-full'
				onClick={() => setIsOpen(!isOpen)}
			>
				<ChevronUp />
			</Button>
		</div>
	)
}

export default memo(MultiActionButton)
