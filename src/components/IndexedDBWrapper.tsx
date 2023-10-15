'use client'

import { IDBPDatabase, openDB } from 'idb'
import { useCallback, useEffect, useState } from 'react'
import { ToastAction } from '@/components/ui/Toast'
import { createRecords, deleteRecords } from '@/lib/api/record/mutations'
import { useNetworkStatus } from '@/hooks/useNetworkStatus'
import { toast } from '@/hooks/useToast'
import { Record, RecordId } from '@/types/Record'

export let iDB: IDBPDatabase<unknown> | null = null

export default function DataSynchronizer() {
	const { isOnline } = useNetworkStatus()
	const [initialized, setInitialized] = useState(false)

	useEffect(() => {
		;(async () => {
			iDB = await openDB('diabet-dairy', 1, {
				upgrade(db) {
					db.createObjectStore('deleteRecords', {
						keyPath: 'id',
					})
					db.createObjectStore('addRecords', {
						keyPath: 'id',
					})
				},
			})
			setInitialized(true)
		})()
	}, [])

	const clearAddRecords = async () => {
		await iDB!.clear('addRecords').catch((error) => {
			console.error(error)
		})
	}

	const saveRecords = useCallback(async (records: Record[]) => {
		await createRecords(records)
			.then(async () => {
				await clearAddRecords()
			})
			.catch((error: string) => {
				toast({
					title: 'Error while saving records',
					description:
						'When saving a records from offline mode to server, error happens: ' +
						error,
					variant: 'destructive',
					action: (
						<ToastAction
							altText='Try again'
							onClick={() => saveRecords(records)}
						>
							Try again
						</ToastAction>
					),
				})
			})
	}, [])

	const clearDeleteRecords = async () => {
		await iDB!.clear('deleteRecords').catch((error) => {
			console.error(error)
		})
	}

	const removeRecords = useCallback(async (ids: RecordId[]) => {
		await deleteRecords(ids)
			.then(async () => {
				await clearDeleteRecords()
			})
			.catch((error: string) => {
				toast({
					title: 'Error while deleting records',
					description:
						'When deleting an offline deleted records from server, error happens: ' +
						error,
					variant: 'destructive',
					action: (
						<ToastAction altText='Try again' onClick={() => removeRecords(ids)}>
							Try again
						</ToastAction>
					),
				})
			})
	}, [])

	useEffect(() => {
		if (isOnline && initialized) {
			;(async () => {
				const deleteRecords = await iDB!.getAll('deleteRecords')
				const addRecords = await iDB!.getAll('addRecords')
				const recordsToSave = addRecords.filter(
					(x) => !deleteRecords.some((y) => x.id === y.id)
				)
				const recordsToDelete = deleteRecords.filter(
					(x) => !addRecords.some((y) => x.id === y.id)
				)
				if (recordsToSave.length !== 0) await saveRecords(recordsToSave)
				else await clearAddRecords()
				if (recordsToDelete.length !== 0) await removeRecords(recordsToDelete)
				else await clearDeleteRecords()
			})()
		}
	}, [isOnline, initialized, saveRecords, removeRecords])

	return null
}
