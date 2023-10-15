'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { getLocalTimeZone, parseAbsolute } from '@internationalized/date'
import { v4 } from 'uuid'
import z from 'zod'
import { Loader2, Plus } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
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
	SheetTrigger,
} from '@/components/ui/Sheet'
import { Textarea } from '@/components/ui/Textarea'
import { createRecord } from '@/lib/api/record/mutations'
import { useNetworkStatus } from '@/hooks/useNetworkStatus'
import { toast } from '@/hooks/useToast'
import { Record, RecordDataSchema } from '@/types/Record'

const FormSchema = z.intersection(
	RecordDataSchema,
	z.object({
		time: z.date(),
	})
)

type PropsType = {
	addRecord: (record: Record) => void
}

export default function AddRecord(props: PropsType) {
	const { addRecord } = props
	const { data: session } = useSession()
	const [isOpen, setIsOpen] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const { isOnline } = useNetworkStatus()
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			time: new Date(),
			type: 'glucose',
			relativeToFood: 'none',
		},
	})

	const type = form.watch('type')

	const onSubmit = async (values: z.infer<typeof FormSchema>) => {
		setIsLoading(true)
		const { time, ...rest } = values
		const record = {
			id: v4(),
			time: time,
			userId: session!.user.id,
			data: rest,
		}
		if (isOnline) {
			await createRecord(record)
				.then(() => {
					addRecord(record)
					setIsOpen(false)
					form.reset()
				})
				.catch((error: string) => {
					toast({
						title: 'Error while creating record',
						description: error,
						variant: 'destructive',
					})
				})
				.finally(() => {
					setIsLoading(false)
				})
		} else {
			await iDB!
				.add('addRecords', record)
				.then(() => {
					addRecord(record)
					setIsOpen(false)
					form.reset()
					toast({
						title: 'Info about record',
						description:
							'Because site is currently in offline mode, record was added only locally, it will be saved on the servers when internet connection will be established.',
						variant: 'default',
					})
				})
				.catch((error: string) => {
					toast({
						title: 'Error while creating record',
						description: error,
						variant: 'destructive',
					})
				})
				.finally(() => {
					setIsLoading(false)
				})
		}
	}

	return (
		<>
			<Sheet open={isOpen} onOpenChange={setIsOpen}>
				<SheetTrigger asChild>
					<Button
						size='icon'
						variant='default'
						className='fixed bottom-5 right-5 rounded-full'
					>
						<Plus />
					</Button>
				</SheetTrigger>
				<SheetContent side='bottom'>
					<SheetHeader>
						<SheetTitle>Create record</SheetTitle>
						<SheetDescription>
							Create a comprehensive record form to track insulin intake, food
							consumption, and glucose levels for effective health monitoring.
						</SheetDescription>
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
										<FormLabel>Type</FormLabel>
										<Select
											defaultValue={field.value}
											onValueChange={field.onChange}
										>
											<FormControl>
												<SelectTrigger className='w-full'>
													<SelectValue placeholder='Select a type' />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectGroup>
													<SelectItem value='glucose'>Glucose</SelectItem>
													<SelectItem value='insulin'>Insulin</SelectItem>
													<SelectItem value='food'>Food</SelectItem>
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
										<FormLabel htmlFor='time'>Time</FormLabel>
										<FormControl>
											<DateTimePicker
												granularity='minute'
												value={
													!!field.value
														? parseAbsolute(
																field.value.toISOString(),
																getLocalTimeZone()
														  )
														: null
												}
												onChange={(date) => {
													field.onChange(
														!!date ? date.toDate(getLocalTimeZone()) : null
													)
												}}
												hideTimeZone
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
											<FormLabel>Relative to food</FormLabel>
											<Select
												value={field.value}
												onValueChange={field.onChange}
											>
												<FormControl>
													<SelectTrigger className='w-full'>
														<SelectValue placeholder='Choose a time' />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectGroup>
														<SelectItem value='before'>Before food</SelectItem>
														<SelectItem value='after'>After food</SelectItem>
														<SelectItem value='none'>None</SelectItem>
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
											<FormLabel>Glucose</FormLabel>
											<FormControl>
												<Input
													placeholder='Enter glucose index'
													type='number'
													{...field}
													onChange={(e) =>
														field.onChange(parseFloat(e.target.value))
													}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							) : null}
							{type === 'food' ? (
								<FormField
									control={form.control}
									name='description'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Description</FormLabel>
											<FormControl>
												<Textarea
													placeholder='Enter description food in details'
													{...field}
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
												<FormLabel>Actrapid</FormLabel>
												<FormControl>
													<Input
														type='number'
														placeholder='Enter actrapid dose'
														{...field}
														onChange={(e) =>
															field.onChange(parseInt(e.target.value))
														}
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
												<FormLabel>Protofan</FormLabel>
												<FormControl>
													<Input
														placeholder='Enter protofan dose'
														type='number'
														{...field}
														onChange={(e) =>
															field.onChange(parseInt(e.target.value))
														}
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
							<Button type='submit' className='w-full'>
								{isLoading ? <Loader2 className='animate-spin' /> : 'Create'}
							</Button>
						</form>
					</Form>
				</SheetContent>
			</Sheet>
		</>
	)
}
