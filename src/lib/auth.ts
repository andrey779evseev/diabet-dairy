import { createSettings } from '@/lib/api/settings/mutations'
import { getSettings } from '@/lib/api/settings/queries'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema/auth'
import { env } from '@/lib/env.mjs'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { NextAuthOptions, Session, getServerSession } from 'next-auth'
import type { Adapter } from 'next-auth/adapters'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions: NextAuthOptions = {
	adapter: DrizzleAdapter(db) as Adapter,
	session: {
		strategy: 'jwt',
	},
	pages: {
		signIn: '/en/auth/sign-in',
	},
	callbacks: {
		async session({ token, session }) {
			if (token) {
				session.user.id = token.id
				session.user.name = token.name
				session.user.email = token.email
				session.user.image = token.picture
				session.user.username = token.username
			}
			return session
		},
		async jwt({ token, user, trigger }) {
			const dbUser = await db.query.users.findFirst({
				where: eq(users.email, token.email),
			})

			if (!dbUser) {
				token.id = user.id
				return token
			}

			if (!dbUser.username) {
				await db
					.update(users)
					.set({
						username: nanoid(10),
					})
					.where(eq(users.id, dbUser.id))
			}

			if (trigger === 'signUp' || trigger === 'signIn') {
				const settings = await getSettings(dbUser.id)
				if (settings === undefined) await createSettings({ userId: dbUser.id })
			}

			return {
				id: dbUser.id,
				name: dbUser.name,
				email: dbUser.email,
				picture: dbUser.image,
				username: dbUser.username,
			}
		},
	},
	providers: [
		GoogleProvider({
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
		}),
	],
}

export const getUserAuth = async () => {
	const session = (await getServerSession(authOptions)) as Session
	return session
}
