'use client'

import { useLocales } from '@/state/atoms'
import { zodResolver } from '@hookform/resolvers/zod'
import { getLocalTimeZone, parseAbsolute } from '@internationalized/date'
import { v4 } from 'uuid'
import z from 'zod'
import { Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useMemo, useState } from 'react'
import { FieldError, useForm } from 'react-hook-form'
import { DateTimePicker } from '@/components/date-time-picker/DateTimePicker'
import { iDB } from '@/components/IndexedDBWrapper'
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
import { createRecord, updateRecord } from '@/lib/api/record/mutations'
import { useNetworkStatus } from '@/hooks/useNetworkStatus'
import { toast } from '@/hooks/useToast'
import { Record, RecordDataSchema } from '@/types/Record'

const FormSchema = z.intersection(
	RecordDataSchema,
	z.object({
		time: z.date(),
	}),
)

type PropsType = {
	addRecord: (record: Record) => void
	record?: Record
	updateRecord: (record: Record) => void
	cancelEdit: () => void
	isOpen: boolean
	setIsOpen: (value: boolean) => void
}

export default function RecordSheet(props: PropsType) {
	const {
		addRecord,
		record,
		updateRecord: updateRecordInTable,
		cancelEdit,
		isOpen,
		setIsOpen,
	} = props
	const { data: session } = useSession()
	const [isLoading, setIsLoading] = useState(false)
	const { isOnline } = useNetworkStatus()
	const locales = useLocales()
	const editRecord = useMemo(() => {
		if (!record) return undefined
		const { id: _id, userId: _userId, data, ...rest } = record
		return {
			...rest,
			...data,
		}
	}, [record])
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			time: new Date(),
			type: 'glucose',
			relativeToFood: 'none',
		},
		values: editRecord,
	})

	const type = form.watch('type')

	const onSubmit = async (values: z.infer<typeof FormSchema>) => {
		setIsLoading(true)
		const { time, ...rest } = values
		const newRecord = {
			id: record?.id ?? v4(),
			time: time,
			userId: record?.userId ?? session!.user.id,
			data: rest,
		}
		if (editRecord !== undefined) {
			if (isOnline) {
				await updateRecord(newRecord)
					.then(() => {
						updateRecordInTable(newRecord)
						setIsOpen(false)
					})
					.catch((error: string) => {
						toast({
							title: locales?.toast.update.online.error.title,
							description: error,
							variant: 'destructive',
						})
					})
					.finally(() => {
						setIsLoading(false)
					})
			} else {
				await iDB!
					.add('updateRecords', newRecord)
					.then(() => {
						updateRecordInTable(newRecord)
						setIsOpen(false)
						toast({
							title: locales?.toast.update.online.info.title,
							description: locales?.toast.update.online.info.description,
							variant: 'default',
						})
					})
					.catch((error: string) => {
						toast({
							title: locales?.toast.update.online.error.title,
							description: error,
							variant: 'destructive',
						})
					})
					.finally(() => {
						setIsLoading(false)
					})
			}
		} else {
			if (isOnline) {
				await createRecord(newRecord)
					.then(() => {
						addRecord(newRecord)
						setIsOpen(false)
					})
					.catch((error: string) => {
						toast({
							title: locales?.toast.create.online.error.title,
							description: error,
							variant: 'destructive',
						})
					})
					.finally(() => {
						setIsLoading(false)
					})
			} else {
				await iDB!
					.add('addRecords', newRecord)
					.then(() => {
						addRecord(newRecord)
						setIsOpen(false)
						toast({
							title: locales?.toast.create.online.info.title,
							description: locales?.toast.create.online.info.description,
							variant: 'default',
						})
					})
					.catch((error: string) => {
						toast({
							title: locales?.toast.create.online.error.title,
							description: error,
							variant: 'destructive',
						})
					})
					.finally(() => {
						setIsLoading(false)
					})
			}
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
				<SheetContent side='bottom'>
					<SheetHeader>
						<SheetTitle>
							{editRecord !== undefined
								? locales?.sheet.title.update
								: locales?.sheet.title.create}
						</SheetTitle>
						<SheetDescription>{locales?.sheet.description}</SheetDescription>
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
										<FormLabel>{locales?.sheet.form.type.label}</FormLabel>
										<Select
											defaultValue={field.value}
											onValueChange={field.onChange}
										>
											<FormControl>
												<SelectTrigger className='w-full'>
													<SelectValue
														placeholder={locales?.sheet.form.type.placeholder}
													/>
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectGroup>
													<SelectItem value='glucose'>
														{locales?.sheet.form.type.options.glucose}
													</SelectItem>
													<SelectItem value='insulin'>
														{locales?.sheet.form.type.options.insulin}
													</SelectItem>
													<SelectItem value='food'>
														{locales?.sheet.form.type.options.food}
													</SelectItem>
													<SelectItem value='activity'>
														{locales?.sheet.form.type.options.activity}
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
									<FormItem>
										<FormLabel htmlFor='time'>
											{locales?.sheet.form.time.label}
										</FormLabel>
										<FormControl>
											<DateTimePicker
												granularity='minute'
												value={
													!!field.value
														? parseAbsolute(
																field.value.toISOString(),
																getLocalTimeZone(),
														  )
														: null
												}
												onChange={(date) => {
													field.onChange(
														!!date ? date.toDate(getLocalTimeZone()) : null,
													)
												}}
												hideTimeZone
												hourCycle={24}
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
												{locales?.sheet.form.relativeToFood.label}
											</FormLabel>
											<Select
												value={field.value}
												onValueChange={field.onChange}
											>
												<FormControl>
													<SelectTrigger className='w-full'>
														<SelectValue
															placeholder={
																locales?.sheet.form.relativeToFood.placeholder
															}
														/>
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectGroup>
														<SelectItem value='before'>
															{
																locales?.sheet.form.relativeToFood.options
																	.before
															}
														</SelectItem>
														<SelectItem value='after'>
															{locales?.sheet.form.relativeToFood.options.after}
														</SelectItem>
														<SelectItem value='none'>
															{locales?.sheet.form.relativeToFood.options.none}
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
											<FormLabel>{locales?.sheet.form.glucose.label}</FormLabel>
											<FormControl>
												<Input
													placeholder={locales?.sheet.form.glucose.placeholder}
													{...field}
													onChange={(e) => {
														const value = e.target.value
														field.onChange(
															value.replace(',', '.').endsWith('.')
																? value
																: parseFloat(e.target.value) || 0,
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
										name='dose.actrapid'
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													{locales?.sheet.form.actrapid.label}
												</FormLabel>
												<FormControl>
													<Input
														type='number'
														placeholder={
															locales?.sheet.form.actrapid.placeholder
														}
														{...field}
														onChange={(e) =>
															field.onChange(parseInt(e.target.value))
														}
														pattern='[0-9]*'
														inputMode='numeric'
													/>
												</FormControl>
												<FormMessage>
													{(
														(form.formState.errors as any).dose as
															| FieldError
															| undefined
													)?.root?.message !== undefined
														? (
																(form.formState.errors as any).dose as
																	| FieldError
																	| undefined
														  )?.root?.message
														: undefined}
												</FormMessage>
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name='dose.protofan'
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													{locales?.sheet.form.protofan.label}
												</FormLabel>
												<FormControl>
													<Input
														placeholder={
															locales?.sheet.form.protofan.placeholder
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
												<FormMessage>
													{(
														(form.formState.errors as any).dose as
															| FieldError
															| undefined
													)?.root?.message !== undefined
														? (
																(form.formState.errors as any).dose as
																	| FieldError
																	| undefined
														  )?.root?.message
														: undefined}
												</FormMessage>
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
										<FormLabel>
											{locales?.sheet.form.description.label}
										</FormLabel>
										<FormControl>
											<Textarea
												placeholder={
													locales?.sheet.form.description.placeholder
												}
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
									locales?.sheet.form.actions.update
								) : (
									locales?.sheet.form.actions.create
								)}
							</Button>
						</form>
					</Form>
				</SheetContent>
			</Sheet>
		</>
	)
}
