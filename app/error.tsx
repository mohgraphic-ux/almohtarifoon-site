'use client';
export default function ErrorPage({reset}:{reset:()=>void}){return <main className="admin-setup"><div className="confirm-modal"><h1>تعذّر تحميل الصفحة</h1><p>حدث خطأ مؤقت. حاول مرة أخرى.</p><button className="button green" onClick={reset}>إعادة المحاولة</button><p><a href="/">العودة إلى الرئيسية</a></p></div></main>}
