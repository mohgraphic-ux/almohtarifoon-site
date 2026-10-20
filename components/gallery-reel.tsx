'use client';
import {useRef,useState} from 'react';
import {ArrowLeft,ArrowRight,ArrowUpLeft} from 'lucide-react';
import type {Item} from '@/lib/content';
import {IconGallery} from './icons';

// Cinematic horizontal gallery: tour video first, then photos as large snap cards.
export default function GalleryReel({title,items,video,poster,label,onOpen}:{title:string;items:Item[];video?:string;poster:string;label:(c?:string)=>string;onOpen:(x:Item)=>void}){
 const track=useRef<HTMLDivElement>(null),[progress,setProgress]=useState(0);
 const move=(dir:number)=>{const t=track.current;if(t)t.scrollBy({left:-dir*t.clientWidth*.75,behavior:'smooth'})};
 const onScroll=()=>{const t=track.current;if(!t)return;const max=t.scrollWidth-t.clientWidth;setProgress(max>0?Math.abs(t.scrollLeft)/max:1)};
 const total=items.length+(video?1:0);
 return <section className="px-reel">
  <div className="px-reel-head"><div><span className="px-eyebrow"><IconGallery size={18}/>المعرض</span><h2>{title}</h2></div><div className="px-reel-nav"><a href="/gallery" className="px-reel-all">كل الصور<ArrowUpLeft size={17}/></a><button onClick={()=>move(-1)} aria-label="السابق"><ArrowRight size={20}/></button><button onClick={()=>move(1)} aria-label="التالي"><ArrowLeft size={20}/></button></div></div>
  <div className="px-reel-track" ref={track} onScroll={onScroll}>
   {video&&<figure className="px-slide px-slide-video"><video src={video} poster={poster} autoPlay muted loop playsInline preload="none" aria-hidden="true"/><figcaption><small>فيديو</small><b>جولة بالمكان</b></figcaption><span className="px-slide-count">01 / {String(total).padStart(2,'0')}</span></figure>}
   {items.map((x,i)=><figure key={x.id} className={'px-slide'+(i%3===0?' px-slide-tall':'')}><button onClick={()=>onOpen(x)} aria-label={'عرض '+x.title}><img src={x.image} alt={x.title} loading="lazy"/></button><figcaption><small>{label(x.category)}{x.demo?' · صورة توضيحية':''}</small><b>{x.title}</b></figcaption><span className="px-slide-count">{String(i+(video?2:1)).padStart(2,'0')} / {String(total).padStart(2,'0')}</span></figure>)}
  </div>
  <div className="px-reel-progress" aria-hidden="true"><i style={{width:(18+82*progress)+'%'}}/></div>
 </section>;
}
