// Bearer tokens from the backend live in cookies so the Next middleware can
// gate /admin server-side before any admin HTML is sent.

export const TOKEN_COOKIE = 'admin_token';
export const REFRESH_COOKIE = 'admin_refresh_token';

const ACCESS_MAX_AGE = 60 * 15; // 15 minutes — matches the backend access token
const REFRESH_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

/** Reads the JWT `exp` claim. Returns true for anything unreadable — fail closed. */
export function isTokenExpired(token: string | undefined): boolean {
  if (!token) return true;
  const payload = token.split('.')[1];
  if (!payload) return true;
  try {
    const b64 = payload.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(payload.length / 4) * 4, '=');
    const { exp } = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))));
    return typeof exp !== 'number' || exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

function readCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  return document.cookie
    .split('; ')
    .find((c) => c.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

function writeCookie(name: string, value: string, maxAge: number) {
  if (typeof document === 'undefined') return;
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${value}; Path=/; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

function clearCookie(name: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; Path=/; SameSite=Lax; Max-Age=0`;
}

export function getToken(): string | undefined {
  return readCookie(TOKEN_COOKIE);
}

export function getRefreshToken(): string | undefined {
  return readCookie(REFRESH_COOKIE);
}

export function setToken(token: string) {
  writeCookie(TOKEN_COOKIE, token, ACCESS_MAX_AGE);
}

export function setRefreshToken(token: string) {
  writeCookie(REFRESH_COOKIE, token, REFRESH_MAX_AGE);
}

export function setTokens(tokens: { accessToken: string; refreshToken?: string }) {
  setToken(tokens.accessToken);
  if (tokens.refreshToken) setRefreshToken(tokens.refreshToken);
}

export function clearToken() {
  clearCookie(TOKEN_COOKIE);
  clearCookie(REFRESH_COOKIE);
}
