'use client';
import {useEffect,useRef,useState,type CSSProperties} from 'react';
import {ArrowLeft,Phone,Trophy,Medal} from 'lucide-react';
import {type Item,type Entity,byDate,entityOf,entityNames,formatDate,telephone} from '@/lib/content';
import {IconWhistle,IconTrophy,IconCalendar,IconSwim,IconPlatform,EntityIcon} from './icons';

// Achievements across the academy, club, pool and platform on one animated timeline.
export default function AchievementsTimeline({title,text,items,logo,phone,onOpen}:{title:string;text:string;items:Item[];logo:string;phone:string;onOpen:(x:Item)=>void}){
 const [filter,setFilter]=useState<string>('all'),[fill,setFill]=useState(0),line=useRef<HTMLOListElement>(null);
 const sorted=[...items].sort(byDate),sections=Array.from(new Set(sorted.map(x=>entityOf(x.category))));
 const list=sorted.filter(x=>filter==='all'||entityOf(x.category)===filter);
 const real=items.filter(x=>!x.demo),counts=sections.map(e=>[e,real.filter(x=>entityOf(x.category)===e).length] as const).filter(([,n])=>n>0);
 const crest=(e:Entity)=>e==='academy'||e==='club'?<img src={e==='club'?'/media/club-logo.png':logo} alt=""/>:e==='pool'?<IconSwim size={22}/>:e==='platform'?<IconPlatform size={22}/>:<IconTrophy size={20}/>;
 useEffect(()=>{const el=line.current;if(!el)return;
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -12% 0px'});
  el.querySelectorAll('.tl-item,.tl-year').forEach(n=>io.observe(n));
  const onScroll=()=>{const r=el.getBoundingClientRect(),mid=innerHeight*.6;setFill(Math.max(0,Math.min(1,(mid-r.top)/Math.max(1,r.height))))};
  onScroll();addEventListener('scroll',onScroll,{passive:true});return()=>{io.disconnect();removeEventListener('scroll',onScroll)}},[filter]);
 return <>
  <section className="px-ach-hero"><div className="px-ach-hero-in"><div><a className="breadcrumb" href="/">الرئيسية <ArrowLeft size={14}/></a><span className="px-eyebrow"><IconTrophy size={18}/>سجل الإنجازات</span><h1>{title}</h1><p>{text}</p></div>{counts.length>0&&<dl className="px-ach-stats"><div><dt>إنجاز موثّق</dt><dd>{real.length}</dd></div>{counts.map(([e,n])=><div key={e}><dt>{entityNames[e]}</dt><dd>{n}</dd></div>)}</dl>}</div><Trophy className="px-ach-mark" aria-hidden="true"/></section>
  <section className="tl">
   {sections.length>1&&<div className="tl-filter" role="group" aria-label="اختار الجهة">{['all',...sections].map(x=><button key={x} className={'tl-chip '+x+(filter===x?' on':'')} aria-pressed={filter===x} onClick={()=>setFilter(x)}>{x!=='all'&&<i>{crest(x as Entity)}</i>}{x==='all'?'كل الجهات':entityNames[x as Entity]}</button>)}</div>}
   {list.length>0?<ol className="tl-line" ref={line} style={{'--tl-fill':fill} as CSSProperties}>
    {list.map((x,i)=>{const e=entityOf(x.category),year=x.date?.slice(0,4)||'',prevYear=list.slice(0,i).reverse().find(y=>y.date)?.date?.slice(0,4)||'';const showYear=year&&year!==prevYear;
     return [showYear&&<li key={'y'+year} className="tl-year"><span>{year}</span></li>,
      <li key={x.id} className={'tl-item '+e+(i%2?' alt':'')}>
       <span className="tl-node" aria-hidden="true">{crest(e)}</span>
       <span className="tl-when">{x.date?<><IconCalendar size={18}/><b>{formatDate(x.date,'month').replace(/\s\d{4}$/,'')}</b><small>{year}</small></>:<b>—</b>}</span>
       <article className="tl-card">
        {x.image&&<button className="tl-media" onClick={()=>onOpen(x)} aria-label={'عرض '+x.title}><img src={x.image} alt="" loading="lazy"/></button>}
        <div className="tl-body"><div className="tl-tags"><span className={'nw-tag '+e}><EntityIcon entity={e} size={14}/>{entityNames[e]}</span>{x.subtitle&&<span className="tl-event"><Medal size={15}/>{x.subtitle}</span>}{x.demo&&<span className="px-demo">مثال توضيحي</span>}</div><h3>{x.title}</h3><p>{x.text}</p><time className="tl-date" dateTime={x.date}>{formatDate(x.date)}</time></div>
       </article>
      </li>];})}
    <li className="tl-end" aria-hidden="true"><Trophy size={20}/></li>
   </ol>:<div className="px-empty"><Trophy size={36}/><h2>عم نوثّق الإنجازات</h2><p>عم نجمع محطات لاعبينا وسبّاحينا. تابعونا قريب</p></div>}
  </section>
  <section className="px-ach-cta"><div><span className="px-eyebrow"><IconWhistle size={18}/>الإنجاز الجاي</span><h2>كل إنجاز هون<br/><span className="px-accent">بلّش بأول تمرين</span></h2></div><div className="px-hero-actions"><a className="px-btn px-btn-gold" href="/contact">بلّش مشوارك معنا<ArrowLeft size={18}/></a><a className="px-btn px-btn-ghost" href={telephone(phone)}><Phone size={17}/><span dir="ltr">{phone}</span></a></div></section>
 </>;
}
