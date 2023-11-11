'use client'

import { useLocale, useLocales } from '@/state/atoms'
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
import { memo, useCallback, useMemo, useState } from 'react'
import { DateRange } from 'react-day-picker'
import { useRouter } from 'next/navigation'
import { DataTable } from '@/components/DataTable'
import DateFilter from '@/components/DateFilter'
import { iDB } from '@/components/IndexedDBWrapper'
import MultiActionButton from '@/components/MultiActionButton'
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
import { useNetworkStatus } from '@/hooks/useNetworkStatus'
import { toast } from '@/hooks/useToast'
import type {
	Record,
	RecordDataType,
	RecordId,
	RecordType,
} from '@/types/Record'

type PropsType = {
	records: Record[]
	recordsCount: number
	fetchRecords: (offset: number, limit?: number) => Promise<Record[]>
}

function HomePageContent(props: PropsType) {
	const { records: recordsBase, fetchRecords, recordsCount } = props
	const [date, setDate] = useState<DateRange | undefined>(() => {
		const now = new Date()
		now.setHours(0, 0, 0, 0)
		return {
			from: now,
			to: undefined,
		}
	})
	const { isOnline } = useNetworkStatus()
	const [combinedRecords, setCombinedRecords] = useState(recordsBase)
	const [deletingRecordId, setDeletingRecordId] = useState<string | null>(null)
	const [isOpenDeleteAlert, setIsOpenDeleteAlert] = useState(false)
	const [editRecord, setEditRecord] = useState<Record | undefined>(undefined)
	const [isOpenRecordSheet, setIsOpenRecordSheet] = useState(false)
	const [type, setType] = useState<RecordType | 'all'>('all')
	const locales = useLocales()
	const locale = useLocale()
	const router = useRouter()

	const records = useMemo(() => {
		return combinedRecords.filter(
			(x) =>
				date !== undefined &&
				((date.from !== undefined &&
					date.to === undefined &&
					dayjs(x.time).isSame(date.from, 'day')) ||
					(date.from === undefined &&
						date.to !== undefined &&
						dayjs(x.time).isSame(date.to, 'day')) ||
					(date.from !== undefined &&
						date.to !== undefined &&
						dayjs(x.time).isBetween(date.from, date.to, 'day', '[]'))),
		)
	}, [combinedRecords, date])

	const fetchNext = async () => {
		const res = await fetchRecords(combinedRecords.length)
		setCombinedRecords((prev) => [...prev, ...res])
	}

	const prepareForRemoveRecord = useCallback(
		(id: RecordId) => {
			if (deletingRecordId !== null) {
				toast({
					title: locales?.toast.delete.online.error.title,
					description: locales?.toast.delete.online.error.description,
					variant: 'destructive',
				})
				return
			}
			setIsOpenDeleteAlert(true)
			setDeletingRecordId(id)
		},
		[deletingRecordId, locales],
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
		if (isOnline) {
			await deleteRecord(deletingRecordId!)
				.then(() => {
					setCombinedRecords((prev) =>
						prev.filter((x) => x.id !== deletingRecordId),
					)
				})
				.catch((error: string) => {
					toast({
						title: locales?.toast.delete.online.error.title,
						description: error,
						variant: 'destructive',
					})
				})
				.finally(() => {
					setDeletingRecordId(null)
				})
		} else {
			await iDB!
				.add('deleteRecords', {
					id: deletingRecordId!,
				})
				.then(() => {
					setCombinedRecords((prev) =>
						prev.filter((x) => x.id !== deletingRecordId),
					)
					toast({
						title: locales?.toast.delete.online.info.title,
						description: locales?.toast.delete.online.info.description,
						variant: 'default',
					})
				})
				.catch((error: string) => {
					toast({
						title: locales?.toast.delete.online.error.title,
						description: error,
						variant: 'destructive',
					})
				})
				.finally(() => {
					setDeletingRecordId(null)
				})
		}
	}, [setCombinedRecords, deletingRecordId, isOnline, locales])

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
				id: 'data',
				accessorKey: 'data',
				cell: ({ row }) => {
					const data = row.getValue('data') as RecordDataType
					return (
						<div className='flex w-full flex-col gap-1'>
							<span className='text-base'>
								{locales?.table.data.type[data.type]}
								{(data.type === 'glucose' || data.type === 'insulin') &&
								data.relativeToFood !== undefined &&
								data.relativeToFood !== 'none'
									? ` ${locales?.table.data.relativeToFood[
											data.relativeToFood
									  ]} ${locales?.table.data.type.food}`
									: null}
							</span>

							{data.type === 'glucose' && data.glucose !== undefined ? (
								<span className='text-sm text-zinc-400'>{`${data.glucose} ${locales?.units.glucose}`}</span>
							) : null}
							{data.type === 'insulin' ? (
								<span className='text-sm text-zinc-400'>
									{data.dose.actrapid !== undefined
										? `${locales?.table.data.insulin.actrapid}: ${data.dose.actrapid}`
										: ''}
									{data.dose.protofan !== undefined
										? `${data.dose.actrapid !== undefined ? ', ' : ''}${locales
												?.table.data.insulin.protofan}: ${data.dose.protofan}`
										: ''}
								</span>
							) : null}
							{data.description !== undefined ? (
								<span className='text-sm text-zinc-400'>
									{data.description}
								</span>
							) : null}
						</div>
					)
				},
				filterFn: (row, columnId, filterValue) => {
					const { type } = row.getValue(columnId) as RecordDataType
					return filterValue === 'all' || type === filterValue
				},
				size: 100,
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
									<span>{locales?.table.actions.edit}</span>
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
									<span>{locales?.table.actions.delete}</span>
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
			locales,
		],
	)

	const addRecord = (record: Record) => {
		setCombinedRecords((prev) =>
			[record, ...prev].toSorted((a, b) => b.time.getTime() - a.time.getTime()),
		)
	}

	const updateRecord = (record: Record) => {
		setCombinedRecords((prev) =>
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
					const url = `/api/download/word?from=${date.from}&to=${date.to}&type=${type}&locale=${locale}`
					const fileName = `${dayjs(date.from).format('DD.MM.YYYY')}${
						date.to !== undefined
							? `~${dayjs(date.to).format('DD.MM.YYYY')}`
							: ''
					} (${locales?.filters.type.options[type]}).docx`
					if ('canShare' in navigator) {
						const res = await fetch(
							`/api/download/word?from=${date.from}&to=${date.to}&type=${type}&locale=${locale}`,
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
		[date, type, locale, locales, router],
	)

	return (
		<>
			<DateFilter date={date} setDate={setDate} />
			<div className='mt-2 h-[calc(100vh-160px)]'>
				<DataTable
					columns={columns}
					data={records}
					fetchNext={fetchNext}
					showObserver={combinedRecords.length < recordsCount}
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
				/>
			) : null}
			<MultiActionButton actions={actions} />
			<AlertDialog open={isOpenDeleteAlert} onOpenChange={setIsOpenDeleteAlert}>
				<AlertDialogContent className='w-[90%]'>
					<AlertDialogHeader>
						<AlertDialogTitle>{locales?.alerts.delete.title}</AlertDialogTitle>
						<AlertDialogDescription>
							{locales?.alerts.delete.description}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => cancelRemoveRecord()}>
							{locales?.alerts.delete.actions.cancel}
						</AlertDialogCancel>
						<AlertDialogAction onClick={() => removeRecord()}>
							{locales?.alerts.delete.actions.continue}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}

export default memo(HomePageContent)
