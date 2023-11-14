'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { buttonVariants } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

type PropsType = {
	items: {
		href: string
		title: string
	}[]
} & React.HTMLAttributes<HTMLElement>

export default function SidebarNav(props: PropsType) {
	const { className, items, ...rest } = props
	const pathname = usePathname()

	return (
		<nav
			className={cn(
				'flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1',
				className,
			)}
			{...rest}
		>
			{items.map((item) => (
				<Link
					key={item.href}
					href={item.href}
					className={cn(
						buttonVariants({ variant: 'ghost' }),
						'/' + pathname.split('/').filter(Boolean)[0] === item.href
							? 'bg-muted hover:bg-muted'
							: 'hover:bg-transparent hover:underline',
						'justify-start',
					)}
				>
					{item.title}
				</Link>
			))}
		</nav>
	)
}
