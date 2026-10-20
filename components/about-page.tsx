'use client';
import {useEffect,useRef,useState,type KeyboardEvent,type ReactNode} from 'react';
import {ArrowLeft,X} from 'lucide-react';
import {type Item,type SiteData,live} from '@/lib/content';
import {IconShield,IconTeam,IconWhistle,IconStar,IconBriefcase,IconCone,IconGear} from './icons';
import {makeT} from '@/lib/copy';

// About page modelled on almohtaref.app/ar/about: broadcast-style video hero, the academy/club family,
// an org chart (chair → board → departments as tabs) with a person dialog, then mission and vision.
const CHAIR='رئيس مجلس الإدارة',BOARD='مجلس الإدارة';
const deptIcon:Record<string,ReactNode>={'الجهاز الفني والمدربون':<IconCone size={15}/>,'الإدارة والعمليات':<IconGear size={15}/>};
const levelOf=(x:Item)=>x.category===CHAIR?{label:CHAIR,icon:<IconStar size={15}/>}:x.category===BOARD?{label:BOARD,icon:<IconBriefcase size={15}/>}:{label:x.category||'فريق العمل',icon:deptIcon[x.category||'']||<IconGear size={15}/>};
const count=(n:number)=>n===1?'عضو واحد':n===2?'عضوان':n<=10?n+' أعضاء':n+' عضواً';

function Silhouette(){return <svg className="ab-silhouette" viewBox="0 0 120 140" aria-hidden="true"><circle cx="60" cy="50" r="24"/><path d="M14 140c4-34 22-52 46-52s42 18 46 52z"/></svg>}

export default function AboutPage({page,data}:{page:Item;data:SiteData}){
 const t=makeT(data.home),departmentInfo:Record<string,{text:string;banner:string}>={'الجهاز الفني والمدربون':{text:t('c_about_dept_tech_text'),banner:t('c_about_dept_tech_image')},'الإدارة والعمليات':{text:t('c_about_dept_ops_text'),banner:t('c_about_dept_ops_image')}};
 const team=live(data.team),blocks=page.blocks||[],roots=blocks.filter(x=>x.group==='roots'),purpose=blocks.filter(x=>x.group==='purpose');
 const chair=team.filter(x=>x.category===CHAIR),board=team.filter(x=>x.category===BOARD);
 const departments=Array.from(new Set(team.map(x=>x.category||'فريق العمل'))).filter(x=>x!==CHAIR&&x!==BOARD);
 const [tab,setTab]=useState(0),[person,setPerson]=useState<Item|null>(null);
 const root=useRef<HTMLDivElement>(null),video=useRef<HTMLVideoElement>(null),dialog=useRef<HTMLDialogElement>(null),opener=useRef<HTMLButtonElement|null>(null),tabs=useRef<(HTMLButtonElement|null)[]>([]);
 const [first,...rest]=(page.subtitle||page.title).split('\n');
 const src=data.home.tourVideo,poster=data.home.tourPoster||page.image;

 useEffect(()=>{const el=root.current;if(!el)return;el.classList.add('reveal-ready');const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -10% 0px'});el.querySelectorAll('[data-reveal]').forEach(n=>io.observe(n));return()=>io.disconnect()},[]);
 useEffect(()=>{const v=video.current;if(!v)return;const motion=matchMedia('(prefers-reduced-motion: reduce)');const apply=()=>{if(motion.matches)v.pause();else void v.play().catch(()=>{})};apply();motion.addEventListener('change',apply);return()=>motion.removeEventListener('change',apply)},[]);
 useEffect(()=>{const d=dialog.current;if(!d)return;if(person&&!d.open)d.showModal();if(!person&&d.open)d.close()},[person]);

 const open=(x:Item,btn:HTMLButtonElement)=>{opener.current=btn;setPerson(x)};
 const close=()=>{setPerson(null);opener.current?.focus()};
 const onTabKey=(e:KeyboardEvent<HTMLButtonElement>,i:number)=>{const n=departments.length;const next=e.key==='ArrowLeft'?(i+1)%n:e.key==='ArrowRight'?(i-1+n)%n:e.key==='Home'?0:e.key==='End'?n-1:-1;if(next<0)return;e.preventDefault();setTab(next);tabs.current[next]?.focus()};
 const card=(x:Item,big=false)=><button key={x.id} type="button" className={'ab-card'+(big?' ab-card-big':'')} onClick={e=>open(x,e.currentTarget)} aria-haspopup="dialog">
  <span className="ab-photo">{x.image?<img src={x.image} alt="" loading="lazy"/>:<Silhouette/>}</span>
  <span className="ab-card-copy"><b>{x.title}</b><span>{x.subtitle}</span><span className="ab-level">{levelOf(x).icon}{levelOf(x).label}</span></span>
 </button>;
 const current=departments[Math.min(tab,departments.length-1)],members=team.filter(x=>(x.category||'فريق العمل')===current),info=departmentInfo[current||''];

 return <div className="ab" ref={root}>
  <section className="ab-hero" aria-labelledby="ab-title">
   <div className="ab-hero-media" aria-hidden="true">{src?<video ref={video} src={src} poster={poster} autoPlay muted loop playsInline preload="metadata" tabIndex={-1}/>:<img src={poster} alt=""/>}</div>
   <div className="ab-hero-in">
    <span className="ab-onair"><i aria-hidden="true"/>{page.category}</span>
    <h1 id="ab-title"><span>{first}</span>{rest.length>0&&<em>{rest.join(' ')}</em>}</h1>
    <span className="ab-meter" aria-hidden="true">{Array.from({length:7},(_,i)=><i key={i}/>)}</span>
    <p>{page.text}</p>
    {team.length>0&&<a className="px-btn px-btn-gold" href="#team" onClick={e=>{e.preventDefault();document.getElementById('team')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})}}>{page.ctaLabel||'تعرّف على الفريق'}<ArrowLeft size={18}/></a>}
   </div>
  </section>

  {roots.length>0&&<section className="ab-band" aria-labelledby="ab-family" data-reveal><div className="ab-wrap">
   <div className="ab-title"><span className="px-eyebrow"><IconShield size={18}/>{t('c_about_family_eyebrow')}</span><h2 id="ab-family">{t('c_about_family_title')}</h2></div>
   <div className="ab-family">{roots.map((x,i)=><article key={i} className={i===1?'club':'academy'}><span className="ab-logo"><img src={i===0?data.settings.logo:t('c_club_logo')} alt={x.title}/></span><div><span className="ab-pill">{i===0?t('c_about_tag_academy'):t('c_about_tag_club')}</span><h3>{x.title}</h3><p>{x.text}</p></div></article>)}</div>
  </div></section>}

  <section className="ab-band ab-team" id="team" aria-labelledby="ab-team-title" data-reveal><div className="ab-wrap">
   <div className="ab-title ab-center"><span className="px-eyebrow"><IconTeam size={18}/>{t('c_about_team_eyebrow')}</span><h2 id="ab-team-title">{t('c_about_team_title')}</h2><p>{t('c_about_team_text')}</p></div>
   {team.length===0?<p className="ab-empty">{t('c_about_team_empty')}</p>:<div className="ab-chart">
    <img className="ab-watermark" src={data.settings.logo} alt="" aria-hidden="true"/>
    {chair.length>0&&<div className="ab-tier ab-tier-chair">{chair.map(x=>card(x,true))}</div>}
    {board.length>0&&<div className="ab-tier ab-tier-board"><span className="ab-tier-label">{t('c_about_board')} · {count(board.length)}</span><div className="ab-row">{board.map(x=>card(x))}</div></div>}
    {departments.length>0&&<div className="ab-tier ab-tier-depts">
     <div className="ab-tabs" role="tablist" aria-label="أقسام فريق العمل">{departments.map((d,i)=><button key={d} ref={el=>{tabs.current[i]=el}} type="button" role="tab" id={'ab-tab-'+i} aria-controls={'ab-panel-'+i} aria-selected={d===current} tabIndex={d===current?0:-1} className={d===current?'on':''} onClick={()=>setTab(i)} onKeyDown={e=>onTabKey(e,i)}><span className="ab-tab-icon">{deptIcon[d]||<IconGear size={15}/>}</span><b>{d}</b><small>{count(team.filter(x=>(x.category||'فريق العمل')===d).length)}</small></button>)}</div>
     <div className="ab-panel" role="tabpanel" id={'ab-panel-'+departments.indexOf(current)} aria-labelledby={'ab-tab-'+departments.indexOf(current)} key={current}>
      {info&&<div className="ab-banner"><img src={info.banner} alt="" loading="lazy"/><p>{info.text}</p></div>}
      <div className="ab-row">{members.map(x=>card(x))}</div>
     </div>
    </div>}
   </div>}
  </div></section>

  {purpose.length>0&&<section className="ab-band ab-purpose-band" aria-labelledby="ab-purpose" data-reveal><div className="ab-wrap">
   <div className="ab-title"><span className="px-eyebrow"><IconWhistle size={18}/>{t('c_about_purpose_eyebrow')}</span><h2 id="ab-purpose">{t('c_about_purpose_title')}</h2></div>
   <div className="ab-statements">{purpose.map((x,i)=><blockquote key={i}><span>{String(i+1).padStart(2,'0')}</span><h3>{x.title}</h3><p>{x.text}</p></blockquote>)}</div>
  </div></section>}

  <dialog ref={dialog} className="ab-dialog" aria-labelledby="ab-dialog-name" onClose={close} onClick={e=>{if(e.target===dialog.current)close()}}>
   {person&&<div className="ab-dialog-in">
    <button type="button" className="ab-dialog-close" onClick={close} aria-label="إغلاق"><X size={20}/></button>
    <span className="ab-photo ab-photo-lg">{person.image?<img src={person.image} alt={person.title}/>:<Silhouette/>}</span>
    <div><span className="ab-level">{levelOf(person).icon}{levelOf(person).label}</span><h3 id="ab-dialog-name">{person.title}</h3><p className="ab-role">{person.subtitle}</p>{person.text?<p>{person.text}</p>:<p className="ab-muted">{t('c_about_bio_empty')}</p>}</div>
   </div>}
  </dialog>
 </div>;
}
