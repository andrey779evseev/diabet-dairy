'use client'

import dayjs from 'dayjs'
import { ColumnDef } from '@tanstack/react-table'
import {
	Forward,
	Loader2,
	MoreHorizontal,
	Pencil,
	Plus,
	RotateCcw,
	Trash,
} from 'lucide-react'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { DateRange } from 'react-day-picker'
import { Session } from 'next-auth'
import dynamic from 'next/dynamic'
import { useParams, useRouter } from 'next/navigation'
import { DataTable } from '@/components/DataTable'
import DateFilter from '@/components/DateFilter'
import RecordSheet from '@/components/RecordSheet'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/AlertDialog'
import { Button } from '@/components/ui/Button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import { deleteRecord } from '@/lib/api/record/mutations'
import { getRecords, getRecordsCount } from '@/lib/api/record/queries'
import { useTranslation } from '@/lib/i18n/client'
import { getClearNow } from '@/lib/utils'
import { toast } from '@/hooks/useToast'
import type {
	Record,
	RecordId,
	RecordRelativeToFoodType,
	RecordType,
} from '@/types/Record'
import { Settings } from '@/types/Settings'

const MultiActionButton = dynamic(
	() => import('@/components/MultiActionButton'),
	{
		ssr: false,
	},
)

type PropsType = {
	session: Session
	settings: Settings
	records: Record[]
	recordsCount: number
}

function HomePageContent(props: PropsType) {
	const {
		records: recordsBase,
		recordsCount: recordsCountBase,
		settings,
		session,
	} = props
	const [date, setDate] = useState<DateRange | undefined>(() => {
		return {
			from: getClearNow(),
			to: undefined,
		}
	})
	const [records, setRecords] = useState(recordsBase)
	const [deletingRecordId, setDeletingRecordId] = useState<string | null>(null)
	const [isOpenDeleteAlert, setIsOpenDeleteAlert] = useState(false)
	const [editRecord, setEditRecord] = useState<Record | undefined>(undefined)
	const [isOpenRecordSheet, setIsOpenRecordSheet] = useState(false)
	const [type, setType] = useState<RecordType | 'all'>('all')
	const [recordsCount, setRecordsCount] = useState(recordsCountBase)
	const { t } = useTranslation()
	const router = useRouter()
	const { lang } = useParams()

	useEffect(() => {
		;(async () => {
			if (!date || !session) return
			const [recs, count] = await Promise.all([
				getRecords(date, session.user.id),
				getRecordsCount(date, session.user.id),
			])
			setRecords(recs)
			setRecordsCount(count)
		})()
	}, [date, session])

	const fetchNext = async () => {
		if (!date || !session) return
		const res = await getRecords(date, session.user.id, records.length)
		setRecords((prev) => [...prev, ...res])
	}

	const prepareForRemoveRecord = useCallback(
		(id: RecordId) => {
			if (deletingRecordId !== null) {
				toast({
					title: t('toast.delete.error.title'),
					description: t('toast.delete.error.description'),
					variant: 'destructive',
				})
				return
			}
			setIsOpenDeleteAlert(true)
			setDeletingRecordId(id)
		},
		[deletingRecordId, t],
	)

	const prepareForEditRecord = useCallback(
		(id: RecordId) => {
			const record = records.find((x) => x.id === id)!
			setEditRecord(record)
			setIsOpenRecordSheet(true)
		},
		[records, setEditRecord],
	)

	const cancelRemoveRecord = () => {
		setIsOpenDeleteAlert(false)
		setDeletingRecordId(null)
	}

	const removeRecord = useCallback(async () => {
		await deleteRecord(deletingRecordId!)
			.then(() => {
				setRecords((prev) => prev.filter((x) => x.id !== deletingRecordId))
			})
			.catch((error: string) => {
				toast({
					title: t('toast.delete.error.title'),
					description: error,
					variant: 'destructive',
				})
			})
			.finally(() => {
				setDeletingRecordId(null)
			})
	}, [setRecords, deletingRecordId, t])

	const columns: ColumnDef<Record>[] = useMemo(
		() => [
			{
				id: 'time',
				accessorKey: 'time',
				cell: ({ row }) => {
					const time = row.getValue('time') as Date
					const formatted = dayjs(time).format('DD.MM.YY-HH:mm')
					return (
						<div className='flex w-[52px] flex-col items-center gap-1 text-lg font-medium'>
							<span>{formatted.split('-')[1]}</span>
							<span className='text-sm font-normal text-zinc-400'>
								{formatted.split('-')[0]}
							</span>
						</div>
					)
				},
			},
			{
				id: 'type',
				accessorKey: 'type',
				cell: ({ row }) => {
					const type = row.getValue('type') as RecordType
					const relativeToFood = row.getValue('relativeToFood') as
						| RecordRelativeToFoodType
						| undefined
						| null
					const glucose = row.getValue('glucose') as number | undefined | null
					const shortInsulin = row.getValue('shortInsulin') as
						| number
						| undefined
						| null
					const longInsulin = row.getValue('longInsulin') as
						| number
						| undefined
						| null
					const description = row.getValue('description') as
						| string
						| undefined
						| null
					return (
						<div className='flex w-full flex-col gap-1'>
							<span className='text-base'>
								{t(`table.data.type.${type}`)}
								{(type === 'glucose' || type === 'insulin') &&
								!!relativeToFood &&
								relativeToFood !== 'none'
									? ` ${`table.data.relativeToFood.${relativeToFood}`} ${t(
											'table.data.type.food',
									  )}`
									: null}
							</span>
							{type === 'glucose' && !!glucose ? (
								<span className='text-sm text-zinc-400'>
									{`${glucose} ${t('units.glucose')}`}
								</span>
							) : null}
							{type === 'insulin' ? (
								<span className='text-sm text-zinc-400'>
									{!!shortInsulin
										? `${
												settings.shortInsulin ?? t('table.data.insulin.short')
										  }: ${shortInsulin}`
										: ''}
									{!!longInsulin
										? `${!!shortInsulin ? ', ' : ''}${
												settings.longInsulin ?? t('table.data.insulin.long')
										  }: ${longInsulin}`
										: ''}
								</span>
							) : null}
							{!!description ? (
								<span className='text-sm text-zinc-400'>{description}</span>
							) : null}
						</div>
					)
				},
				filterFn: (row, columnId, filterValue) => {
					const type = row.getValue(columnId) as RecordType
					return filterValue === 'all' || type === filterValue
				},
				size: 100,
			},
			{
				id: 'relativeToFood',
				accessorKey: 'relativeToFood',
			},
			{
				id: 'glucose',
				accessorKey: 'glucose',
			},
			{
				id: 'shortInsulin',
				accessorKey: 'shortInsulin',
			},
			{
				id: 'longInsulin',
				accessorKey: 'longInsulin',
			},
			{
				id: 'description',
				accessorKey: 'description',
			},
			{
				id: 'actions',
				enableHiding: false,
				cell: ({ row }) => {
					const id = row.original.id
					return (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant='ghost' size='icon'>
									<MoreHorizontal />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className='w-56' align='end'>
								<DropdownMenuItem
									onClick={() => prepareForEditRecord(id)}
									className='flex items-center gap-2'
								>
									<Pencil className='h-4 w-4' />
									<span>{t('table.actions.edit')}</span>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={() => prepareForRemoveRecord(id)}
									className='flex items-center gap-2'
								>
									{deletingRecordId === id && !isOpenDeleteAlert ? (
										<Loader2 className='h-4 w-4 animate-spin' />
									) : (
										<Trash className='h-4 w-4' />
									)}
									<span>{t('table.actions.delete')}</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					)
				},
			},
		],
		[
			prepareForRemoveRecord,
			prepareForEditRecord,
			isOpenDeleteAlert,
			deletingRecordId,
			t,
			settings,
		],
	)

	const addRecord = (record: Record) => {
		setRecords((prev) =>
			[record, ...prev].toSorted((a, b) => b.time.getTime() - a.time.getTime()),
		)
	}

	const updateRecord = (record: Record) => {
		setRecords((prev) =>
			[record, ...prev.filter((x) => x.id !== record.id)].toSorted(
				(a, b) => b.time.getTime() - a.time.getTime(),
			),
		)
		setEditRecord(undefined)
	}

	const actions = useMemo(
		() => [
			{
				icon: Plus,
				action: () => setIsOpenRecordSheet(true),
			},
			{
				icon: Forward,
				action: async () => {
					if (date === undefined) {
						toast({
							description: 'Before export to file, please select a date range',
							variant: 'destructive',
						})
						return
					}
					const url = `/api/download/word?from=${date.from}&to=${date.to}&type=${type}&locale=${lang}`
					const fileName = `${dayjs(date.from).format('DD.MM.YYYY')}${
						date.to !== undefined
							? `~${dayjs(date.to).format('DD.MM.YYYY')}`
							: ''
					} (${t(`filters.type.options.${type}`)}).docx`
					if ('canShare' in navigator) {
						const res = await fetch(
							`/api/download/word?from=${date.from}&to=${date.to}&type=${type}&locale=${lang}`,
							{
								method: 'GET',
							},
						)
						const blob = await res.blob()
						const file = new File([blob], fileName, {
							type: blob.type,
						})
						const data = {
							title: fileName,
							files: [file],
						}

						if (navigator.canShare(data)) {
							await navigator.share(data)
							return
						}
					}
					const a = document.createElement('a')
					a.style.display = 'none'
					a.href = url
					a.download = fileName
					document.body.appendChild(a)
					a.click()
					document.body.removeChild(a)
				},
			},
			{
				icon: RotateCcw,
				action: () => router.refresh(),
			},
		],
		[date, type, t, lang, router],
	)

	return (
		<>
			<DateFilter date={date} setDate={setDate} />
			<div className='mt-2 h-[calc(100vh-160px)]'>
				<DataTable
					columns={columns}
					data={records}
					fetchNext={fetchNext}
					showObserver={records.length < recordsCount}
					onChangeTypeFilter={setType}
				/>
			</div>
			{isOpenRecordSheet ? (
				<RecordSheet
					addRecord={addRecord}
					record={editRecord}
					updateRecord={updateRecord}
					cancelEdit={() => setEditRecord(undefined)}
					isOpen={isOpenRecordSheet}
					setIsOpen={setIsOpenRecordSheet}
					settings={settings}
					session={session}
				/>
			) : null}
			<MultiActionButton actions={actions} />
			<AlertDialog open={isOpenDeleteAlert} onOpenChange={setIsOpenDeleteAlert}>
				<AlertDialogContent className='w-[90%]'>
					<AlertDialogHeader>
						<AlertDialogTitle>{t('alerts.delete.title')}</AlertDialogTitle>
						<AlertDialogDescription>
							{t('alerts.delete.description')}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => cancelRemoveRecord()}>
							{t('alerts.delete.actions.cancel')}
						</AlertDialogCancel>
						<AlertDialogAction onClick={() => removeRecord()}>
							{t('alerts.delete.actions.continue')}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}

export default memo(HomePageContent)
