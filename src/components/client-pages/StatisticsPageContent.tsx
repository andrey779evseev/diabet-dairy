'use client'

import { Stats, StatsByDates } from '@/app/[lang]/statistics/page'
import { memo } from 'react'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/Card'
import { ScrollArea, ScrollBar } from '@/components/ui/ScrollArea'
import { useTranslation } from '@/lib/i18n/client'

type PropsType = {
	stats: Stats
}

function StatisticsPageContent(props: PropsType) {
	const { stats } = props
	const {t} = useTranslation()
	return (
		<div className='flex h-full w-full flex-col gap-4'>
			<CardRowStats
				stats={stats.glucose}
				title={t('statistics.glucose.title')}
				description={t('statistics.glucose.description')}
			/>
			<CardRowStats
				stats={stats.dailyInsulin}
				title={t('statistics.dailyInsulin.title')}
				description={t('statistics.dailyInsulin.description')}
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
	const {t} = useTranslation()
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
									{t(`statistics.periods.${label as 'today'}`)}
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
