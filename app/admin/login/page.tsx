import {notFound} from 'next/navigation';
import {selfHosted,configured} from '@/lib/self-auth';
export const dynamic='force-dynamic';
export const metadata={title:'دخول الإدارة | المحترفون',robots:{index:false,follow:false}};
// Admin sign-in page, only on self-hosted servers (ChatGPT Sites uses its own sign-in).
export default async function AdminLogin({searchParams}:{searchParams:Promise<{error?:string;return_to?:string}>}){
 if(!selfHosted())notFound();
 const {error,return_to}=await searchParams;const back=return_to&&return_to.startsWith('/')&&!return_to.startsWith('//')?return_to:'/admin';
 return <main className="admin-setup"><a href="/" className="brand"><img src="/media/academy-logo.png" alt=""/><span><b>المحترفون</b><small>لوحة الإدارة</small></span></a>
  <form method="post" action="/api/admin/login"><h1>تسجيل الدخول</h1><p>ادخل بإيميل وكلمة سر مدير الموقع</p>
   {!configured()&&<p role="alert" className="error-text">حساب الإدارة غير مُعدّ على السيرفر بعد. راجع ملف الإعداد deploy/README.md</p>}
   {error&&<p role="alert" className="error-text">{error==='rate'?'محاولات كثيرة. جرّب بعد شوي':'الإيميل أو كلمة السر غير صحيحة'}</p>}
   <input type="hidden" name="return_to" value={back}/>
   <label>الإيميل<input name="email" type="email" required autoComplete="username" dir="ltr"/></label>
   <label>كلمة السر<input name="password" type="password" required autoComplete="current-password" dir="ltr"/></label>
   <button className="button green" type="submit">دخول</button>
   <a href="/">رجوع للموقع</a>
  </form></main>;
}
