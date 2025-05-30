'use client'

import DateTimePicker from '@/components/date-time-picker/DateTimePicker'
import { Button } from '@/components/ui/Button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/Form'
import { Input } from '@/components/ui/Input'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/Select'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/Sheet'
import { Textarea } from '@/components/ui/Textarea'
import { toast } from '@/hooks/useToast'
import { createRecord, updateRecord } from '@/lib/api/record/mutations'
import { useTranslation } from '@/lib/i18n/client'
import { NewRecord, NewRecordSchema, Record } from '@/types/Record'
import { Settings } from '@/types/Settings'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Session } from 'next-auth'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { v4 } from 'uuid'

type PropsType = {
	addRecord: (record: Record) => void
	record?: Record
	updateRecord: (record: Record) => void
	cancelEdit: () => void
	isOpen: boolean
	setIsOpen: (value: boolean) => void
	settings: Settings
	session: Session
}

export default function RecordSheet(props: PropsType) {
	const {
		addRecord,
		record,
		updateRecord: updateRecordInTable,
		cancelEdit,
		isOpen,
		setIsOpen,
		settings,
		session,
	} = props
	const [isLoading, setIsLoading] = useState(false)
	const { t } = useTranslation()
	const editRecord = useMemo(() => {
		if (!record) return undefined
		const { id: _id, userId: _userId, ...rest } = record
		const clone = structuredClone(rest)
		Object.keys(clone).forEach((key) => {
			// @ts-expect-error do not remove
			if (!clone[key]) clone[key] = undefined
		})
		return clone
	}, [record])
	const form = useForm<NewRecord>({
		resolver: zodResolver(NewRecordSchema),
		defaultValues: {
			time: new Date(),
			type: 'glucose',
			relativeToFood: 'none',
		},
		values: editRecord,
	})

	const type = form.watch('type')

	const onSubmit = async (values: NewRecord) => {
		setIsLoading(true)
		const newRecord: Record = {
			id: record?.id ?? v4(),
			userId: record?.userId ?? session.user.id,
			...values,
		}
		if (editRecord !== undefined) {
			await updateRecord(newRecord)
				.then(() => {
					updateRecordInTable(newRecord)
					setIsOpen(false)
				})
				.catch((error: string) => {
					toast({
						title: t('toast.update.error.title'),
						description: error,
						variant: 'destructive',
					})
				})
				.finally(() => {
					setIsLoading(false)
				})
		} else {
			await createRecord(newRecord)
				.then(() => {
					addRecord(newRecord)
					setIsOpen(false)
				})
				.catch((error: string) => {
					toast({
						title: t('toast.create.error.title'),
						description: error,
						variant: 'destructive',
					})
				})
				.finally(() => {
					setIsLoading(false)
				})
		}
	}

	const onOpenChange = (value: boolean) => {
		setIsOpen(value)
		if (!value && editRecord !== undefined) {
			cancelEdit()
		}
	}

	return (
		<>
			<Sheet open={isOpen} onOpenChange={onOpenChange}>
				<SheetContent side='bottom' className='max-h-screen overflow-y-auto'>
					<SheetHeader>
						<SheetTitle>
							{editRecord !== undefined
								? t('sheet.title.update')
								: t('sheet.title.create')}
						</SheetTitle>
						<SheetDescription>{t('sheet.description')}</SheetDescription>
					</SheetHeader>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className='grid gap-4 py-4'
						>
							<FormField
								control={form.control}
								name='type'
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t('sheet.form.type.label')}</FormLabel>
										<Select
											defaultValue={field.value}
											onValueChange={field.onChange}
										>
											<FormControl>
												<SelectTrigger className='w-full'>
													<SelectValue
														placeholder={t('sheet.form.type.placeholder')}
													/>
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectGroup>
													<SelectItem value='glucose'>
														{t('sheet.form.type.options.glucose')}
													</SelectItem>
													<SelectItem value='insulin'>
														{t('sheet.form.type.options.insulin')}
													</SelectItem>
													<SelectItem value='food'>
														{t('sheet.form.type.options.food')}
													</SelectItem>
													<SelectItem value='activity'>
														{t('sheet.form.type.options.activity')}
													</SelectItem>
												</SelectGroup>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='time'
								render={({ field }) => (
									<FormItem className='flex flex-col gap-y-2 space-y-0'>
										<FormLabel>{t('sheet.form.time.label')}</FormLabel>
										<FormControl>
											<DateTimePicker
												value={field.value}
												onChange={field.onChange}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{type === 'glucose' || type === 'insulin' ? (
								<FormField
									control={form.control}
									name='relativeToFood'
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												{t('sheet.form.relativeToFood.label')}
											</FormLabel>
											<Select
												value={field.value}
												onValueChange={field.onChange}
											>
												<FormControl>
													<SelectTrigger className='w-full'>
														<SelectValue
															placeholder={t(
																'sheet.form.relativeToFood.placeholder',
															)}
														/>
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectGroup>
														<SelectItem value='before'>
															{t('sheet.form.relativeToFood.options.before')}
														</SelectItem>
														<SelectItem value='after'>
															{t('sheet.form.relativeToFood.options.after')}
														</SelectItem>
														<SelectItem value='none'>
															{t('sheet.form.relativeToFood.options.none')}
														</SelectItem>
													</SelectGroup>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
							) : null}
							{type === 'glucose' ? (
								<FormField
									control={form.control}
									name='glucose'
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t('sheet.form.glucose.label')}</FormLabel>
											<FormControl>
												<Input
													placeholder={t('sheet.form.glucose.placeholder')}
													{...field}
													onChange={(e) => {
														const value = e.target.value.replace(',', '.')
														field.onChange(
															value.endsWith('.')
																? value
																: parseFloat(value) || 0,
														)
													}}
													inputMode='decimal'
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							) : null}
							{type === 'insulin' ? (
								<>
									<FormField
										control={form.control}
										name='shortInsulin'
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													{settings.shortInsulin ??
														t('sheet.form.shortInsulin.label')}
												</FormLabel>
												<FormControl>
													<Input
														type='number'
														placeholder={
															!settings.shortInsulin
																? t('sheet.form.shortInsulin.placeholder')
																: `${t(
																		'sheet.form.shortInsulin.part_placeholder',
																  )} ${settings.shortInsulin}`
														}
														{...field}
														onChange={(e) =>
															field.onChange(parseInt(e.target.value))
														}
														pattern='[0-9]*'
														inputMode='numeric'
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name='longInsulin'
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													{settings.longInsulin ??
														t('sheet.form.longInsulin.label')}
												</FormLabel>
												<FormControl>
													<Input
														placeholder={
															!settings.longInsulin
																? t('sheet.form.longInsulin.placeholder')
																: `${t(
																		'sheet.form.longInsulin.part_placeholder',
																  )} ${settings.longInsulin}`
														}
														type='number'
														{...field}
														onChange={(e) =>
															field.onChange(parseInt(e.target.value))
														}
														pattern='[0-9]*'
														inputMode='numeric'
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</>
							) : null}
							<FormField
								control={form.control}
								name='description'
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t('sheet.form.description.label')}</FormLabel>
										<FormControl>
											<Textarea
												placeholder={t('sheet.form.description.placeholder')}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type='submit' className='w-full'>
								{isLoading ? (
									<Loader2 className='animate-spin' />
								) : record !== undefined ? (
									t('sheet.form.actions.update')
								) : (
									t('sheet.form.actions.create')
								)}
							</Button>
						</form>
					</Form>
				</SheetContent>
			</Sheet>
		</>
	)
}
