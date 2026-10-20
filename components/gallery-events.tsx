'use client';
import {useEffect,useState} from 'react';
import {ArrowLeft,ArrowRight,X,Images} from 'lucide-react';
import {type Item,byDate,entityOf,entityNames,formatDate,type Entity} from '@/lib/content';

type Occasion={key:string;title:string;entity:Entity;date?:string;photos:Item[]};

// Gallery page: choose a section, then an occasion (e.g. graduation of a class), then browse its photos.
export default function GalleryEvents({title,gallery,initialAlbum}:{title:string;gallery:Item[];initialAlbum?:string}){
 const occasions:Occasion[]=[];
 for(const x of [...gallery].sort(byDate)){const entity=entityOf(x.category),name=x.subtitle?.trim()||'صور '+entityNames[entity],key=entity+'|'+name;let o=occasions.find(y=>y.key===key);if(!o){o={key,title:name,entity,date:x.date,photos:[]};occasions.push(o)}o.photos.push(x);if((x.date||'')>(o.date||''))o.date=x.date}
 occasions.sort((a,b)=>(b.date||'').localeCompare(a.date||''));
 const sections=Array.from(new Set(occasions.map(o=>o.entity)));
 const [section,setSection]=useState<string>('all'),[openKey,setOpenKey]=useState<string|null>(initialAlbum||null),[shot,setShot]=useState<number|null>(null);
 const current=occasions.find(o=>o.key===openKey);
 const go=(key:string|null)=>{setOpenKey(key);setShot(null);const u=new URL(location.href);if(key)u.searchParams.set('album',key);else u.searchParams.delete('album');history.replaceState(null,'',u);window.scrollTo({top:0})};
 useEffect(()=>{if(shot===null||!current)return;const n=current.photos.length;const fn=(e:KeyboardEvent)=>{if(e.key==='Escape')setShot(null);if(e.key==='ArrowLeft')setShot(s=>s===null?s:(s+1)%n);if(e.key==='ArrowRight')setShot(s=>s===null?s:(s-1+n)%n)};document.addEventListener('keydown',fn);const old=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.removeEventListener('keydown',fn);document.body.style.overflow=old}},[shot,current]);
 const meta=(o:Occasion)=><span className="gl-meta"><span className={'nw-tag '+o.entity}>{entityNames[o.entity]}</span>{o.date&&<time dateTime={o.date}>{formatDate(o.date,'month')}</time>}<span>{o.photos.length===1?'صورة وحدة':o.photos.length===2?'صورتين':o.photos.length+(o.photos.length<=10?' صور':' صورة')}</span></span>;
 return <>
  <section className="px-gpage-hero"><a className="breadcrumb" href="/">الرئيسية <ArrowLeft size={14}/></a><span className="px-eyebrow">المعرض</span><h1>{current?current.title:title}</h1>{current?meta(current):<p>كل قسم إلو صوره، وكل مناسبة إلها ألبوم.</p>}</section>
  <section className="px-gpage">
   {current?<>
    <button className="gl-back" onClick={()=>go(null)}><ArrowRight size={18}/>كل المناسبات</button>
    <div className="gl-photos">{current.photos.map((x,i)=><button key={x.id} onClick={()=>setShot(i)} aria-label={'عرض '+x.title}><img src={x.image} alt={x.title} loading="lazy"/><span>{x.title}{x.demo?' · صورة توضيحية':''}</span></button>)}</div>
   </>:<>
    {sections.length>1&&<div className="px-album-tabs px-gpage-chips" role="group" aria-label="اختار القسم">{['all',...sections].map(x=><button key={x} className={section===x?'on':''} aria-pressed={section===x} onClick={()=>setSection(x)}>{x==='all'?'كل الأقسام':entityNames[x as Entity]}</button>)}</div>}
    <div className="gl-occasions">{occasions.filter(o=>section==='all'||o.entity===section).map(o=><button key={o.key} className={'gl-occasion '+o.entity} onClick={()=>go(o.key)}>
     <span className="gl-stack">{o.photos.slice(0,3).reverse().map((p,i,arr)=><img key={p.id} src={p.image} alt="" loading="lazy" className={'gl-layer-'+(arr.length-1-i)}/>)}</span>
     <span className="gl-occasion-copy">{meta(o)}<b>{o.title}</b><span className="gl-open">افتح الألبوم<ArrowLeft size={16}/></span></span>
    </button>)}</div>
    {!occasions.length&&<div className="px-empty"><Images size={36}/><h2>صور جديدة جاية قريب</h2></div>}
   </>}
  </section>
  {current&&shot!==null&&current.photos[shot]&&<div className="gl-lightbox" role="dialog" aria-modal="true" aria-label={current.photos[shot].title} onClick={()=>setShot(null)}>
   <button className="gl-close" onClick={()=>setShot(null)} aria-label="إغلاق" autoFocus><X/></button>
   <figure onClick={e=>e.stopPropagation()}><img src={current.photos[shot].image} alt={current.photos[shot].title}/><figcaption><b>{current.photos[shot].title}</b><span>{shot+1} / {current.photos.length}</span></figcaption></figure>
   {current.photos.length>1&&<><button className="gl-prev" onClick={e=>{e.stopPropagation();setShot((shot-1+current.photos.length)%current.photos.length)}} aria-label="الصورة السابقة"><ArrowRight/></button><button className="gl-next" onClick={e=>{e.stopPropagation();setShot((shot+1)%current.photos.length)}} aria-label="الصورة التالية"><ArrowLeft/></button></>}
  </div>}
 </>;
}
