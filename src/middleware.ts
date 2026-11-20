import { NextResponse, type NextRequest } from 'next/server';
import { REFRESH_COOKIE, TOKEN_COOKIE, isTokenExpired } from './lib/authToken';

// Runs before /studio-7f3c9a is rendered: no usable token → login page.
// A valid refresh token is enough to load the shell; the API client refreshes
// the short-lived access token on the first request.
export function middleware(req: NextRequest) {
  const accessToken = req.cookies.get(TOKEN_COOKIE)?.value;
  const refreshToken = req.cookies.get(REFRESH_COOKIE)?.value;

  if (isTokenExpired(accessToken) && isTokenExpired(refreshToken)) {
    const url = req.nextUrl.clone();
    url.pathname = '/studio-7f3c9a/login';
    url.search = '';
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

// everything under /studio-7f3c9a except the login page itself
export const config = {
  matcher: ['/studio-7f3c9a', '/studio-7f3c9a/((?!login).*)'],
};
