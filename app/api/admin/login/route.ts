import {selfHosted,verifyPassword,createSession,sessionCookie} from '@/lib/self-auth';
import {sameOrigin,error,audit} from '@/lib/server';
// Self-hosted admin sign-in: checks the configured email + password and sets a signed session cookie.
const attempts=new Map<string,{n:number;until:number}>();
const go=(location:string,cookie?:string)=>new Response(null,{status:303,headers:{Location:location,...(cookie?{'Set-Cookie':cookie}:{})}});
export async function POST(req:Request){
 if(!selfHosted())return error('غير متاح',404);
 if(!sameOrigin(req))return error('طلب غير مسموح',403);
 const ip=req.headers.get('x-real-ip')||req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'local';
 const now=Date.now(),seen=attempts.get(ip);
 if(seen&&seen.until>now&&seen.n>=5)return go('/admin/login?error=rate');
 const f=await req.formData();const email=String(f.get('email')||'').slice(0,200),password=String(f.get('password')||'').slice(0,500);
 const back=String(f.get('return_to')||'/admin');const target=back.startsWith('/')&&!back.startsWith('//')?back:'/admin';
 if(!await verifyPassword(email,password)){attempts.set(ip,{n:(seen&&seen.until>now?seen.n:0)+1,until:now+10*60*1000});await new Promise(r=>setTimeout(r,800));return go('/admin/login?error=1&return_to='+encodeURIComponent(target))}
 attempts.delete(ip);await audit('تسجيل دخول الإدارة',email);
 return go(target,sessionCookie(await createSession()));
}
