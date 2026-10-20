import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '@/app/chatgpt-auth';
import { selfHosted, siteOrigin } from './self-auth';
import { applyPlatformImport } from './platform-content';
import { applyDialect } from './dialect';
import { seed, type SiteData } from './content';
export function db(){ if(!env.DB) throw new Error('قاعدة البيانات غير متاحة'); return env.DB; }
export async function getContent(){const row=await db().prepare('SELECT data, version FROM content WHERE id = ?').bind('site').first<{data:string;version:number}>();const data=row?JSON.parse(row.data) as SiteData:structuredClone(seed);data.home={...seed.home,...data.home};data.achievements??=structuredClone(seed.achievements);applyPlatformImport(data);applyDialect(data);return {data,version:row?.version||0};}
export async function admin(){ const user=await getChatGPTUser();if(!user)return null;if(selfHosted())return user;const row=await db().prepare('SELECT id FROM admins WHERE user_id = ?').bind(user.userId).first();return row?user:null; }
// Behind a reverse proxy the worker sees its local address, so SITE_ORIGIN names the public origin.
export function sameOrigin(req:Request){ const origin=req.headers.get('origin');return !!origin && (origin===new URL(req.url).origin||(!!siteOrigin()&&origin===siteOrigin())); }
export async function audit(action:string,email:string){await db().prepare('INSERT INTO activity (id, action, email, created_at) VALUES (?, ?, ?, ?)').bind(crypto.randomUUID(),action,email,new Date().toISOString()).run();}
export function error(message:string,status=400){return Response.json({error:message},{status});}
