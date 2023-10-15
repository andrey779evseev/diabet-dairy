'use client'

import dayjs from 'dayjs'
import { ColumnDef } from '@tanstack/react-table'
import { Loader2, Trash } from 'lucide-react'
import { memo, useCallback, useMemo, useState } from 'react'
import { DateRange } from 'react-day-picker'
import AddRecord from '@/components/AddRecord'
import { DataTable } from '@/components/DataTable'
import DateFilter from '@/components/DateFilter'
import { iDB } from '@/components/IndexedDBWrapper'
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
import { deleteRecord } from '@/lib/api/record/mutations'
import { useNetworkStatus } from '@/hooks/useNetworkStatus'
import { toast } from '@/hooks/useToast'
import type { Record, RecordDataType, RecordId } from '@/types/Record'

type PropsType = {
	records: Record[]
	recordsCount: number
	fetchRecords: (offset: number, limit?: number) => Promise<Record[]>
}

function Content(props: PropsType) {
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
						dayjs(x.time).isBetween(date.from, date.to, 'day', '[]')))
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
					title: 'Delete error',
					description: "You can't delete two records at the same time.",
					variant: 'destructive',
				})
				return
			}
			setIsOpenDeleteAlert(true)
			setDeletingRecordId(id)
		},
		[deletingRecordId]
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
						prev.filter((x) => x.id !== deletingRecordId)
					)
				})
				.catch((error: string) => {
					toast({
						title: 'Delete error',
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
						prev.filter((x) => x.id !== deletingRecordId)
					)
					toast({
						title: 'Info about record',
						description:
							'Because site is currently in offline mode, record was deleted only locally, it will be deleted from servers on internet connection.',
						variant: 'default',
					})
				})
				.catch((error: string) => {
					toast({
						title: 'Delete error',
						description: error,
						variant: 'destructive',
					})
				})
				.finally(() => {
					setDeletingRecordId(null)
				})
		}
	}, [setCombinedRecords, deletingRecordId, isOnline])

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
				header: 'Time',
			},
			{
				id: 'data',
				accessorKey: 'data',
				cell: ({ row }) => {
					const data = row.getValue('data') as RecordDataType
					return (
						<div className='flex w-full flex-col gap-1'>
							<span className='text-base'>
								{data.type.charAt(0).toUpperCase() + data.type.slice(1)}
								{(data.type === 'glucose' || data.type === 'insulin') &&
								data.relativeToFood !== undefined &&
								data.relativeToFood !== 'none'
									? ` ${data.relativeToFood} Food`
									: null}
							</span>
							<span className='text-sm text-zinc-400'>
								{data.type === 'food' && data.description !== undefined
									? data.description
									: null}
								{data.type === 'glucose' && data.glucose !== undefined
									? `${data.glucose} mmol/L`
									: null}
								{data.type === 'insulin'
									? `${
											data.dose.actrapid !== undefined
												? `Actrapid: ${data.dose.actrapid}`
												: ''
									  }${
											data.dose.protofan !== undefined
												? `${
														data.dose.actrapid !== undefined ? ', ' : ''
												  }Protofan: ${data.dose.protofan}`
												: ''
									  }`
									: null}
							</span>
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
						<Button
							variant='ghost'
							size='icon'
							onClick={() => prepareForRemoveRecord(id)}
						>
							{deletingRecordId === id && !isOpenDeleteAlert ? (
								<Loader2 className='animate-spin' />
							) : (
								<Trash />
							)}
						</Button>
					)
				},
			},
		],
		[prepareForRemoveRecord, isOpenDeleteAlert, deletingRecordId]
	)

	const addRecord = (record: Record) => {
		setCombinedRecords((prev) =>
			[record, ...prev].toSorted((a, b) => b.time.getTime() - a.time.getTime())
		)
	}

	return (
		<>
			<DateFilter date={date} setDate={setDate} />
			<div className='h-[calc(100vh-160px)]'>
				<DataTable
					columns={columns}
					data={records}
					fetchNext={fetchNext}
					showObserver={combinedRecords.length < recordsCount}
				/>
			</div>
			<AddRecord addRecord={addRecord} />
			<AlertDialog open={isOpenDeleteAlert} onOpenChange={setIsOpenDeleteAlert}>
				<AlertDialogContent className='w-[90%]'>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete your
							record and remove this data from our servers.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => cancelRemoveRecord()}>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction onClick={() => removeRecord()}>
							Continue
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}

export default memo(Content)
