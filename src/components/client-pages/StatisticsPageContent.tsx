'use client'

import { Stats, StatsByDates } from '@/app/statistics/page'
import { useLocales } from '@/state/atoms'
import { memo } from 'react'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/Card'
import { ScrollArea, ScrollBar } from '@/components/ui/ScrollArea'

type PropsType = {
	stats: Stats
}

function StatisticsPageContent(props: PropsType) {
	const { stats } = props
	const locales = useLocales()
	return (
		<div className='flex h-full w-full flex-col gap-4'>
			<CardRowStats
				stats={stats.glucose}
				title={locales?.statistics.glucose.title}
				description={locales?.statistics.glucose.description}
			/>
			<CardRowStats
				stats={stats.dailyInsulin}
				title={locales?.statistics.dailyInsulin.title}
				description={locales?.statistics.dailyInsulin.description}
			/>
		</div>
	)
}

type CardRowStatsPropsType = {
	stats: StatsByDates
	title?: string
	description?: string
}

function CardRowStats(props: CardRowStatsPropsType) {
	const { stats, title, description } = props
	const locales = useLocales()
	return (
		<Card className='h-fit w-full max-w-full'>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent>
				<ScrollArea className='-mb-3 w-full max-w-full'>
					<div className='flex w-fit items-start gap-4 pb-3'>
						{Object.entries(stats).map(([label, value], i) => (
							<div className='flex flex-col items-center gap-2' key={i}>
								<div className='flex h-16 w-16 items-center justify-center rounded-full border bg-transparent'>
									{Number.isInteger(value) ? value : value.toFixed(2)}
								</div>
								<span className='whitespace-nowrap text-center text-sm text-accent-foreground'>
									{locales?.statistics.periods[label as 'today']}
								</span>
							</div>
						))}
					</div>
					<ScrollBar orientation='horizontal' />
				</ScrollArea>
			</CardContent>
		</Card>
	)
}

export default memo(StatisticsPageContent)
