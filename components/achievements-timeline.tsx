'use client';
import {useEffect,useRef,useState,type CSSProperties} from 'react';
import {ArrowLeft,Phone,Trophy,Medal} from 'lucide-react';
import {type Item,type Entity,byDate,entityOf,formatDate,telephone} from '@/lib/content';
import {IconWhistle,IconTrophy,IconCalendar,IconSwim,IconPlatform,EntityIcon} from './icons';
import PageHero from './page-hero';
import {type T,entityKey} from '@/lib/copy';

// Achievements across the academy, club, pool and platform on one animated timeline.
export default function AchievementsTimeline({title,text,image,items,logo,phone,onOpen,t}:{title:string;text:string;image?:string;items:Item[];logo:string;phone:string;onOpen:(x:Item)=>void;t:T}){
 const [filter,setFilter]=useState<string>('all'),[fill,setFill]=useState(0),line=useRef<HTMLOListElement>(null);
 const sorted=[...items].sort(byDate),sections=Array.from(new Set(sorted.map(x=>entityOf(x.category))));
 const list=sorted.filter(x=>filter==='all'||entityOf(x.category)===filter);
 const real=items.filter(x=>!x.demo),counts=sections.map(e=>[e,real.filter(x=>entityOf(x.category)===e).length] as const).filter(([,n])=>n>0);
 const crest=(e:Entity)=>e==='academy'||e==='club'?<img src={e==='club'?t('c_club_logo'):logo} alt=""/>:e==='pool'?<IconSwim size={22}/>:e==='platform'?<IconPlatform size={22}/>:<IconTrophy size={20}/>;
 useEffect(()=>{const el=line.current;if(!el)return;
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -12% 0px'});
  el.querySelectorAll('.tl-item,.tl-year').forEach(n=>io.observe(n));
  const onScroll=()=>{const r=el.getBoundingClientRect(),mid=innerHeight*.6;setFill(Math.max(0,Math.min(1,(mid-r.top)/Math.max(1,r.height))))};
  onScroll();addEventListener('scroll',onScroll,{passive:true});return()=>{io.disconnect();removeEventListener('scroll',onScroll)}},[filter]);
 return <>
  <PageHero image={image} tone="club" eyebrow={t('c_ach_eyebrow')} icon={<IconTrophy size={18}/>} title={title} text={text} crumbs={[{href:'/achievements',label:t('c_nav_achievements')}]} aside={counts.length>0?<dl className="px-ach-stats"><div><dt>{t('c_ach_count')}</dt><dd>{real.length}</dd></div>{counts.map(([e,n])=><div key={e}><dt>{t(entityKey[e])}</dt><dd>{n}</dd></div>)}</dl>:undefined}/>
  <section className="tl">
   {sections.length>1&&<div className="tl-filter" role="group" aria-label="اختار الجهة">{['all',...sections].map(x=><button key={x} className={'tl-chip '+x+(filter===x?' on':'')} aria-pressed={filter===x} onClick={()=>setFilter(x)}>{x!=='all'&&<i>{crest(x as Entity)}</i>}{x==='all'?t('c_ach_all'):t(entityKey[x as Entity])}</button>)}</div>}
   {list.length>0?<ol className="tl-line" ref={line} style={{'--tl-fill':fill} as CSSProperties}>
    {list.map((x,i)=>{const e=entityOf(x.category),year=x.date?.slice(0,4)||'',prevYear=list.slice(0,i).reverse().find(y=>y.date)?.date?.slice(0,4)||'';const showYear=year&&year!==prevYear;
     return [showYear&&<li key={'y'+year} className="tl-year"><span>{year}</span></li>,
      <li key={x.id} className={'tl-item '+e+(i%2?' alt':'')}>
       <span className="tl-node" aria-hidden="true">{crest(e)}</span>
       <span className="tl-when">{x.date?<><IconCalendar size={18}/><b>{formatDate(x.date,'month').replace(/\s\d{4}$/,'')}</b><small>{year}</small></>:<b>—</b>}</span>
       <article className="tl-card">
        {x.image&&<button className="tl-media" onClick={()=>onOpen(x)} aria-label={'عرض '+x.title}><img src={x.image} alt="" loading="lazy"/></button>}
        <div className="tl-body"><div className="tl-tags"><span className={'nw-tag '+e}><EntityIcon entity={e} size={14}/>{t(entityKey[e])}</span>{x.subtitle&&<span className="tl-event"><Medal size={15}/>{x.subtitle}</span>}{x.demo&&<span className="px-demo">مثال توضيحي</span>}</div><h3>{x.title}</h3><p>{x.text}</p><time className="tl-date" dateTime={x.date}>{formatDate(x.date)}</time></div>
       </article>
      </li>];})}
    <li className="tl-end" aria-hidden="true"><Trophy size={20}/></li>
   </ol>:<div className="px-empty"><Trophy size={36}/><h2>{t('c_ach_empty_title')}</h2><p>{t('c_ach_empty_text')}</p></div>}
  </section>
  <section className="px-ach-cta"><div><span className="px-eyebrow"><IconWhistle size={18}/>{t('c_ach_cta_eyebrow')}</span><h2>{t('c_ach_cta_1')}<br/><span className="px-accent">{t('c_ach_cta_2')}</span></h2></div><div className="px-hero-actions"><a className="px-btn px-btn-gold" href="/contact">{t('c_ach_cta_btn')}<ArrowLeft size={18}/></a><a className="px-btn px-btn-ghost" href={telephone(phone)}><Phone size={17}/><span dir="ltr">{phone}</span></a></div></section>
 </>;
}
