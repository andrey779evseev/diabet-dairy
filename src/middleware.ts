import { withAuth } from 'next-auth/middleware'

export default withAuth({
	pages: {
		signIn: '/auth/sign-in',
	},
})

export const config = {
	// matcher: '/((?!api|_next|.*\\..*).*)',
	matcher: ['/', '/graphs', '/settings/:path*'],
}
