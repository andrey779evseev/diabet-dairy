'use client'

import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/Form'
import { Input } from '@/components/ui/Input'
import { Switch } from '@/components/ui/Switch'
import { toast } from '@/hooks/useToast'
import { updateSettings } from '@/lib/api/settings/mutations'
import { useTranslation } from '@/lib/i18n/client'
import { Settings } from '@/types/Settings'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const ProfileFormSchema = z
	.object({
		customShortInsulin: z.boolean(),
		customLongInsulin: z.boolean(),
		shortInsulin: z.string(),
		longInsulin: z.string(),
	})
	.refine(
		(data) =>
			!data.customShortInsulin ||
			(data.customShortInsulin && data.shortInsulin !== ''),
		{
			path: ['shortInsulin'],
			params: {
				i18n: 'required',
			},
		},
	)
	.refine(
		(data) =>
			!data.customLongInsulin ||
			(data.customLongInsulin && data.longInsulin !== ''),
		{
			path: ['longInsulin'],
			params: {
				i18n: 'required',
			},
		},
	)

type ProfileFormValues = z.infer<typeof ProfileFormSchema>

type PropsType = {
	settings: Settings
}

export default function ProfileForm(props: PropsType) {
	const { settings } = props
	const form = useForm<ProfileFormValues>({
		resolver: zodResolver(ProfileFormSchema),
		defaultValues: {
			customLongInsulin: settings.longInsulin !== null,
			customShortInsulin: settings.shortInsulin !== null,
			longInsulin: settings.longInsulin ?? '',
			shortInsulin: settings.shortInsulin ?? '',
		},
	})
	const { t } = useTranslation()

	const customShortInsulin = form.watch('customShortInsulin')
	const customLongInsulin = form.watch('customLongInsulin')

	const onSubmit = async (data: ProfileFormValues) => {
		try {
			await updateSettings({
				id: settings.id,
				userId: settings.userId,
				shortInsulin: data.customShortInsulin ? data.shortInsulin : null,
				longInsulin: data.customLongInsulin ? data.longInsulin : null,
			})
		} catch (error) {
			toast({
				title: t('toast.settings.profile.save.error.title'),
				description: error as string,
				variant: 'destructive',
			})
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='space-y-8'
				id='settings-profile-form'
			>
				<div className='space-y-4 rounded-lg border p-4'>
					<FormField
						control={form.control}
						name='customShortInsulin'
						render={({ field }) => (
							<FormItem className='flex flex-row items-center justify-between gap-4'>
								<div className='space-y-0.5'>
									<FormLabel className='text-base'>
										{t('settings.profile.inputs.shortInsulin.label')}
									</FormLabel>
									<FormDescription>
										{t('settings.profile.inputs.shortInsulin.description')}
									</FormDescription>
								</div>
								<FormControl>
									<Switch
										checked={field.value}
										onCheckedChange={(value) => {
											if (!value) form.resetField('shortInsulin')
											field.onChange(value)
										}}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name={'shortInsulin'}
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input
										placeholder='Short Insulin'
										{...field}
										disabled={!customShortInsulin}
										autoComplete='off'
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className='space-y-4 rounded-lg border p-4'>
					<FormField
						control={form.control}
						name='customLongInsulin'
						render={({ field }) => (
							<FormItem className='flex flex-row items-center justify-between gap-4'>
								<div className='space-y-0.5'>
									<FormLabel className='text-base'>
										{t('settings.profile.inputs.longInsulin.label')}
									</FormLabel>
									<FormDescription>
										{t('settings.profile.inputs.longInsulin.description')}
									</FormDescription>
								</div>
								<FormControl>
									<Switch
										checked={field.value}
										onCheckedChange={(value) => {
											if (!value) form.resetField('shortInsulin')
											field.onChange(value)
										}}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='longInsulin'
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input
										placeholder='Long Insulin'
										{...field}
										disabled={!customLongInsulin}
										autoComplete='off'
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
			</form>
		</Form>
	)
}
