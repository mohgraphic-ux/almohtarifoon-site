import { env } from 'cloudflare:workers';

// Admin sign-in for self-hosted servers (VPS). Enabled with SELF_HOSTED=1; on ChatGPT Sites the
// platform's sign-in is used instead. One admin: ADMIN_EMAIL + ADMIN_PASSWORD_HASH (see
// scripts/hash-password.mjs), sessions are HMAC-signed with SESSION_SECRET.
type SelfEnv = { SELF_HOSTED?: string; SITE_ORIGIN?: string; ADMIN_EMAIL?: string; ADMIN_PASSWORD_HASH?: string; SESSION_SECRET?: string };
const cfg = () => env as unknown as SelfEnv;
export const selfHosted = () => cfg().SELF_HOSTED === '1';
export const siteOrigin = () => cfg().SITE_ORIGIN?.replace(/\/$/, '') || '';
export const SESSION_COOKIE = 'pxa_session';
const SESSION_DAYS = 14;
const enc = new TextEncoder();

const b64u = (bytes: ArrayBuffer | Uint8Array) => btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const fromB64u = (s: string) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4)), c => c.charCodeAt(0));
const same = (a: string, b: string) => { let m = a.length ^ b.length; for (let i = 0; i < Math.max(a.length, b.length); i++) m |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0); return m === 0; };

async function sign(data: string) {
  const key = await crypto.subtle.importKey('raw', enc.encode(cfg().SESSION_SECRET || ''), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return b64u(await crypto.subtle.sign('HMAC', key, enc.encode(data)));
}

export function configured() {
  const c = cfg();
  return !!(c.ADMIN_EMAIL && c.ADMIN_PASSWORD_HASH && c.SESSION_SECRET && c.SESSION_SECRET.length >= 32);
}

// Hash format: pbkdf2-sha256:<iterations>:<salt b64url>:<hash b64url>
export async function verifyPassword(email: string, password: string) {
  if (!configured()) return false;
  const c = cfg();
  const [scheme, iter, salt, hash] = (c.ADMIN_PASSWORD_HASH || '').split(':');
  if (scheme !== 'pbkdf2-sha256' || !salt || !hash) return false;
  const iterations = Math.min(Number(iter) || 0, 100000);
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: fromB64u(salt), iterations }, key, 256);
  const passwordOk = same(b64u(bits), hash);
  const emailOk = same(email.trim().toLowerCase(), (c.ADMIN_EMAIL || '').trim().toLowerCase());
  return passwordOk && emailOk;
}

export async function createSession() {
  const payload = b64u(enc.encode(JSON.stringify({ email: cfg().ADMIN_EMAIL, exp: Date.now() + SESSION_DAYS * 864e5 })));
  return `${payload}.${await sign(payload)}`;
}

export async function readSession(cookieHeader: string | null) {
  if (!configured() || !cookieHeader) return null;
  const raw = cookieHeader.split(/;\s*/).find(p => p.startsWith(SESSION_COOKIE + '='))?.slice(SESSION_COOKIE.length + 1);
  if (!raw) return null;
  const [payload, mac] = raw.split('.');
  if (!payload || !mac || !same(mac, await sign(payload))) return null;
  try {
    const data = JSON.parse(new TextDecoder().decode(fromB64u(payload))) as { email?: string; exp?: number };
    if (!data.exp || data.exp < Date.now() || !data.email || !same(data.email, cfg().ADMIN_EMAIL || '')) return null;
    return data.email;
  } catch { return null; }
}

export const sessionCookie = (value: string, maxAge = SESSION_DAYS * 86400) => `${SESSION_COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
