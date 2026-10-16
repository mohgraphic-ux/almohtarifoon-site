import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '@/app/chatgpt-auth';
import { seed, type SiteData } from './content';
export function db(){ if(!env.DB) throw new Error('قاعدة البيانات غير متاحة'); return env.DB; }
export async function getContent(){const row=await db().prepare('SELECT data, version FROM content WHERE id = ?').bind('site').first<{data:string;version:number}>();return {data:row?JSON.parse(row.data) as SiteData:structuredClone(seed),version:row?.version||0};}
export async function admin(){ const user=await getChatGPTUser();if(!user)return null;const row=await db().prepare('SELECT id FROM admins WHERE user_id = ?').bind(user.userId).first();return row?user:null; }
export function sameOrigin(req:Request){ const origin=req.headers.get('origin');return !!origin && origin===new URL(req.url).origin; }
export async function audit(action:string,email:string){await db().prepare('INSERT INTO activity (id, action, email, created_at) VALUES (?, ?, ?, ?)').bind(crypto.randomUUID(),action,email,new Date().toISOString()).run();}
export function error(message:string,status=400){return Response.json({error:message},{status});}
