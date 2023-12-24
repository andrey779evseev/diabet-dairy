import { fallbackLng, languages } from '@/lib/i18n/settings'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export default async function middleware (req: NextRequest) {
	const pathname = req.nextUrl.pathname
  const token = await getToken({ req })
  const currentLang = pathname.split('/').length > 1 ? pathname.split('/')[1] : null
  
	if (pathname === '/' || !languages.some(l => l === currentLang))
		return NextResponse.redirect(new URL(!!token ? `/${fallbackLng}` : `/${fallbackLng}/auth/sign-in`, req.url))

  if (authPages.some(p => pathname === p))
    return !!token ? NextResponse.redirect(new URL(`/${currentLang}`, req.url)) : NextResponse.next()

	if (token) return NextResponse.next()

	return NextResponse.redirect(new URL(`/${currentLang ?? fallbackLng}/auth/sign-in`, req.url))
}

const authPages = [
  '/en/auth/sign-in',
  '/en/auth/sign-up',
  '/ru/auth/sign-in',
  '/ru/auth/sign-up',
]

export const config = {
	matcher: '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|assets|icons).*)',
}
