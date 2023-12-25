'use client'

import { buttonVariants } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'

type PropsType = {
	items: {
		href: string
		title: string
	}[]
} & React.HTMLAttributes<HTMLElement>

export default function SidebarNav(props: PropsType) {
	const { className, items, ...rest } = props
	const pathname = usePathname()
	const { lang } = useParams()

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
					href={`/${lang}/${item.href}`}
					className={cn(
						buttonVariants({ variant: 'ghost' }),
						`/${pathname.split('/').filter(Boolean)[1]}` === item.href
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
