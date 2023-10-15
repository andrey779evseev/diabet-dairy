'use client'

import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	useReactTable,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ScrollArea } from '@/components/ui/ScrollArea'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/Select'
import { Skeleton } from '@/components/ui/Skeleton'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/Table'
import { useMounted } from '@/hooks/useMounted'

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
	fetchNext: () => Promise<void>
	showObserver: boolean
}

export function DataTable<TData, TValue>(props: DataTableProps<TData, TValue>) {
	const { columns, data, fetchNext, showObserver } = props
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
		{ id: 'data', value: 'all' },
	])
	const table = useReactTable({
		data,
		columns,
		state: {
			columnFilters,
		},
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		enableFilters: true,
	})
	const isMounted = useMounted()
	const bottomAnchor = useRef(null)

	const bottomAnchorCallback = useCallback(
		async (entries: IntersectionObserverEntry[]) => {
			if (fetchNext && entries[0].isIntersecting) await fetchNext()
		},
		[fetchNext]
	)

	useEffect(() => {
		const anchor = bottomAnchor.current
		const observer = new IntersectionObserver(bottomAnchorCallback, {
			root: null,
			rootMargin: '0px',
			threshold: 0.5,
		})
		if (anchor) observer.observe(anchor)
		return () => {
			if (anchor) observer.unobserve(anchor)
			observer.disconnect()
		}
	}, [bottomAnchorCallback])

	const { rows } = table.getRowModel()

	const parentRef = useRef<HTMLDivElement>(null)

	const virtualizer = useVirtualizer({
		count: rows.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 20,
	})

	const items = virtualizer.getVirtualItems()

	return (
		<>
			<Select
				defaultValue={
					(table.getColumn('data')!.getFilterValue() as string) ?? 'all'
				}
				onValueChange={(value) =>
					table.getColumn('data')!.setFilterValue(value)
				}
			>
				<SelectTrigger className='w-full !ring-0 !ring-transparent'>
					<SelectValue placeholder='Select a type' />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectItem value='all'>All</SelectItem>
						<SelectItem value='glucose'>Glucose</SelectItem>
						<SelectItem value='insulin'>Insulin</SelectItem>
						<SelectItem value='food'>Food</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
			<ScrollArea
				className='mt-2 h-full w-full rounded-md border'
				style={{ contain: 'strict' }}
				ref={parentRef}
			>
				<Table
					className='relative w-full'
					style={{ height: virtualizer.getTotalSize() }}
				>
					<TableBody
						className='absolute left-0 top-0 w-full'
						style={{
							transform: `translateY(${items[0]?.start ?? 0}px)`,
						}}
					>
						{isMounted ? (
							items.length ? (
								items.map((virtualRow) => {
									const row = rows[virtualRow.index]
									return (
										<TableRow
											key={virtualRow.key}
											data-state={row.getIsSelected() && 'selected'}
											ref={virtualizer.measureElement}
											data-index={virtualRow.index}
											className={'w-full'}
										>
											{row.getVisibleCells().map((cell) => (
												<TableCell
													key={cell.id}
													className={
														cell.column.columnDef.size === 100
															? 'w-full'
															: undefined
													}
												>
													{flexRender(
														cell.column.columnDef.cell,
														cell.getContext()
													)}
												</TableCell>
											))}
										</TableRow>
									)
								})
							) : (
								<TableRow>
									<TableCell className='w-screen text-center'>
										No results.
									</TableCell>
								</TableRow>
							)
						) : (
							new Array(5).fill(null).map((_, i) => (
								<TableRow key={i} className='flex w-full items-center'>
									<TableCell className='flex flex-col items-center gap-1'>
										<Skeleton className='h-4 w-16 rounded-sm' />
										<Skeleton className='h-4 w-16 rounded-sm' />
									</TableCell>
									<TableCell className='flex w-full flex-col items-start gap-1'>
										<Skeleton className='h-4 w-16 rounded-sm' />
										<Skeleton className='h-16 w-full rounded-sm' />
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
				{showObserver ? (
					<div className='h-px w-full' ref={bottomAnchor} />
				) : null}
			</ScrollArea>
		</>
	)
}
