import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '@/app/chatgpt-auth';
import {db,sameOrigin,error,audit} from '@/lib/server';
export async function POST(req:Request){
 if(!sameOrigin(req))return error('طلب غير مسموح',403);
 const user=await getChatGPTUser();if(!user)return error('سجّل الدخول أولاً',401);
 const {key}=await req.json() as {key:string};
 const expected=(env as unknown as {ADMIN_SETUP_KEY?:string}).ADMIN_SETUP_KEY;
 if(!expected || typeof key!=='string' || key.length>200)return error('رمز التفعيل غير صحيح',403);
 const a=new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(key)));const b=new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(expected)));let mismatch=0;for(let i=0;i<a.length;i++)mismatch|=a[i]^b[i];if(mismatch)return error('رمز التفعيل غير صحيح',403);
 const result=await db().prepare('INSERT OR IGNORE INTO admins (id,user_id,email) VALUES (?,?,?)').bind('owner',user.userId,user.email).run();
 if(!result.meta.changes)return error('تم تفعيل حساب الإدارة مسبقاً. استخدم الحساب المعتمد.',409);
 await audit('تفعيل حساب مدير الموقع',user.email);return Response.json({ok:true});
}
