'use client';
import {useState} from 'react';
import {ArrowLeft,Users} from 'lucide-react';
import {type Item,type SiteData,live} from '@/lib/content';

// About page mirroring https://almohtaref.app/ar/about: hero, the academy/club family, team by group, mission and vision.
const count=(n:number)=>n===1?'عضو واحد':n===2?'عضوان':n<=10?n+' أعضاء':n+' عضواً';
const groupNotes:Record<string,string>={'الجهاز الفني والمدربون':'خبرة تدريبية تقود التقييم الفني وتطوير الأداء البدني والذهني للاعبين.'};

export default function AboutPage({page,data}:{page:Item;data:SiteData}){
 const team=live(data.team),blocks=page.blocks||[],roots=blocks.filter(x=>x.group==='roots'),purpose=blocks.filter(x=>x.group==='purpose');
 const chair=team.filter(x=>x.category==='رئيس مجلس الإدارة'),board=team.filter(x=>x.category==='مجلس الإدارة');
 const departments=Array.from(new Set(team.map(x=>x.category||'فريق العمل'))).filter(x=>!['رئيس مجلس الإدارة','مجلس الإدارة'].includes(x));
 const [department,setDepartment]=useState(departments[0]||''),current=departments.includes(department)?department:departments[0];
 const [first,...headline]=(page.subtitle||page.title).split('\n');
 const member=(x:Item)=><article className="ab-person" key={x.id}><div className="ab-portrait">{x.image?<img src={x.image} alt={x.title} loading="lazy"/>:<Users size={56} aria-hidden="true"/>}</div><div className="ab-person-copy"><h4>{x.title}</h4><p>{x.subtitle}</p></div></article>;
 const group=(label:string,people:Item[],note?:string)=><div className="ab-group"><div className="ab-group-head"><h3>{label}</h3><span>{count(people.length)}</span></div>{note&&<p className="ab-group-note">{note}</p>}<div className={'ab-people'+(people.length===1?' ab-people-solo':'')}>{people.map(member)}</div></div>;
 return <div className="ab-page">
  <section className="ab-hero"><img src={page.image} alt=""/><div className="ab-hero-in"><a className="ab-crumb" href="/">الرئيسية <ArrowLeft size={14}/> {page.title}</a>{page.category&&<span className="ab-kicker">{page.category}</span>}<h1>{headline.length?<><span className="ab-hero-first">{first}</span><span className="ab-hero-line">{headline.join(' ')}</span></>:<span className="ab-hero-line">{first}</span>}</h1><p>{page.text}</p>{team.length>0&&<a className="px-btn px-btn-gold" href="#our-team">{page.ctaLabel||'تعرّف على الفريق'}<ArrowLeft size={18}/></a>}</div></section>
  {roots.length>0&&<section className="ab-section"><div className="ab-title"><span className="px-eyebrow">الأكاديمية والنادي</span><h2>عائلة واحدة في الملعب</h2></div><div className="ab-roots">{roots.map((x,i)=><article key={i} className={i===1?'club':''}><img src={i===0?data.settings.logo:'/media/club-logo.png'} alt={x.title}/><div><span>{i===0?'الأكاديمية':'النادي'}</span><h3>{x.title}</h3><p>{x.text}</p></div></article>)}</div></section>}
  {team.length>0&&<section className="ab-team" id="our-team"><div className="ab-section"><div className="ab-title ab-center"><span className="px-eyebrow">فريق العمل</span><h2>الأشخاص وراء المحترف</h2><p>فريق يجمع الخبرة الكروية والإدارية والتقنية.</p></div>
   <div className="ab-board">{chair.length>0&&group('رئيس مجلس الإدارة',chair)}{board.length>0&&group('أعضاء مجلس الإدارة',board)}</div>
   {departments.length>0&&<><div className="ab-tabs" role="tablist" aria-label="أقسام فريق العمل">{departments.map(x=><button key={x} role="tab" aria-selected={x===current} className={x===current?'on':''} onClick={()=>setDepartment(x)}><b>{x}</b><small>{count(team.filter(m=>(m.category||'فريق العمل')===x).length)}</small></button>)}</div>{group(current,team.filter(x=>(x.category||'فريق العمل')===current),groupNotes[current])}</>}
  </div></section>}
  {purpose.length>0&&<section className="ab-section"><div className="ab-title"><span className="px-eyebrow">لماذا نحن هنا</span><h2>رسالتنا ورؤيتنا</h2></div><div className="ab-purpose">{purpose.map((x,i)=><article key={i}><span>{String(i+1).padStart(2,'0')}</span><h3>{x.title}</h3><p>{x.text}</p></article>)}</div></section>}
 </div>;
}
