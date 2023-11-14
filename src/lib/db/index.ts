import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { env } from '@/lib/env.mjs'
import * as authSchema from './schema/auth'
import * as recordSchema from './schema/record'
import * as settingsSchema from './schema/settings'

const connectionString = env.DATABASE_URL
const client = postgres(connectionString)
export const db = drizzle(client, {
	schema: { ...authSchema, ...recordSchema, ...settingsSchema },
})
