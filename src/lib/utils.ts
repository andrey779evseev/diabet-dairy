import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function getRandomInt(min: number, max: number) {
	return (
		Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) +
		Math.ceil(min)
	)
}

export const groupBy = <T>(data: T[], fn: (value: T) => string) => {
	const groups = data.reduce((map, item) => {
		const key = fn(item)
		const arr = map.get(key) ?? []
		arr.push(item)
		map.set(key, arr)
		return map
	}, new Map<string, T[]>())

	return Object.keys(Object.fromEntries(groups)).map((date) => {
		return {
			value: date,
			items: groups.get(date) ?? [],
		}
	})
}

export const getClearNow = () => {
	const now = new Date()
	now.setHours(0, 0, 0, 0)
	return now
}
