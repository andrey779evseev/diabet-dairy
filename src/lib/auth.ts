import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { getServerSession, NextAuthOptions, Session } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema/auth'
import { env } from '@/lib/env.mjs'

export const authOptions: NextAuthOptions = {
	adapter: DrizzleAdapter(db),
	session: {
		strategy: 'jwt',
	},
	pages: {
		signIn: '/auth/sign-in',
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
		async jwt({ token, user }) {
			const dbUser = await db.query.users.findFirst({
				where: eq(users.email, token.email!),
			})

			if (!dbUser) {
				token.id = user!.id
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

			return {
				id: dbUser.id,
				name: dbUser.name,
				email: dbUser.email,
				picture: dbUser.image,
				username: dbUser.username,
			}
		},
		redirect() {
			return '/'
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