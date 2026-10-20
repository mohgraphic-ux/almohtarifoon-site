import {ArrowLeft,ArrowUpLeft,Medal} from 'lucide-react';
import {type Item,byDate,entityOf,entityNames,formatDate} from '@/lib/content';
import {EntityIcon,IconGallery,IconTrophy,IconCalendar} from './icons';

const albumKey=(x:Item)=>entityOf(x.category)+'|'+(x.subtitle?.trim()||'صور '+entityNames[entityOf(x.category)]);
const albumName=(x:Item)=>x.subtitle?.trim()||'صور '+entityNames[entityOf(x.category)];

// Home gallery: tour video as the lead tile beside a mosaic of the latest occasions.
export function HomeGallery({title,gallery,video,poster}:{title:string;gallery:Item[];video?:string;poster:string}){
 const sorted=[...gallery].sort(byDate),seen=new Set<string>(),lead:Item[]=[];
 for(const x of sorted){const k=albumKey(x);if(!seen.has(k)){seen.add(k);lead.push(x)}}
 const tiles=[...lead,...sorted.filter(x=>!lead.includes(x))].slice(0,video?4:5);
 const albums=lead.slice(0,4),more=gallery.length-tiles.length;
 if(!tiles.length)return null;
 return <section className="hg">
  <div className="hg-head"><div><span className="px-eyebrow"><IconGallery size={18}/>المعرض</span><h2>{title}</h2></div>
   <div className="hg-albums">{albums.map(x=><a key={albumKey(x)} href={'/gallery?album='+encodeURIComponent(albumKey(x))}><EntityIcon entity={entityOf(x.category)} size={16}/>{albumName(x)}</a>)}<a className="hg-all" href="/gallery">كل الألبومات<ArrowUpLeft size={16}/></a></div></div>
  <div className={'hg-grid'+(video?'':' no-video')}>
   {video&&<figure className="hg-tile hg-video"><video src={video} poster={poster} autoPlay muted loop playsInline preload="none" aria-hidden="true"/><figcaption><span className="hg-chip">فيديو</span><b>جولة بالمكان</b><small>الملاعب والمسبح من فوق</small></figcaption></figure>}
   {tiles.map((x,i)=>{const last=i===tiles.length-1&&more>0;return <a key={x.id} className={'hg-tile'+(last?' hg-more':'')} href={last?'/gallery':'/gallery?album='+encodeURIComponent(albumKey(x))}>
    <img src={x.image} alt={x.title} loading="lazy"/>
    {last?<span className="hg-more-label"><b dir="ltr">+{more}</b>صور كمان</span>:<figcaption><span className={'nw-tag '+entityOf(x.category)}><EntityIcon entity={entityOf(x.category)} size={14}/>{entityNames[entityOf(x.category)]}</span><b>{albumName(x)}</b>{x.date&&<small><IconCalendar size={14}/>{formatDate(x.date,'month')}</small>}</figcaption>}
   </a>})}
  </div>
 </section>;
}

// Home achievements: the latest three on a horizontal timeline that mirrors the achievements page.
export function HomeAchievements({title,text,items,logo}:{title:string;text:string;items:Item[];logo:string}){
 const latest=[...items].sort(byDate).slice(0,3);
 if(!latest.length)return null;
 return <section className="ha"><div className="ha-in">
  <div className="ha-head"><div><span className="px-eyebrow"><IconTrophy size={18}/>سجل الإنجازات</span><h2>{title}</h2></div><div className="ha-side"><p>{text}</p><a className="px-btn px-btn-green" href="/achievements">كل الإنجازات<ArrowLeft size={18}/></a></div></div>
  <ol className="ha-track">{latest.map(x=>{const e=entityOf(x.category);return <li key={x.id} className={'ha-item '+e}>
   <span className="ha-when"><IconCalendar size={15}/>{formatDate(x.date,'month')||'—'}</span>
   <span className="ha-node" aria-hidden="true">{e==='academy'||e==='club'?<img src={e==='club'?'/media/club-logo.png':logo} alt=""/>:<EntityIcon entity={e} size={22}/>}</span>
   <a className="ha-card" href="/achievements">
    {x.image&&<img src={x.image} alt="" loading="lazy"/>}
    <span className="ha-card-copy"><span className="ha-tags"><span className={'nw-tag '+e}><EntityIcon entity={e} size={14}/>{entityNames[e]}</span>{x.demo&&<span className="px-demo">مثال توضيحي</span>}</span>{x.subtitle&&<span className="ha-event"><Medal size={15}/>{x.subtitle}</span>}<b>{x.title}</b></span>
   </a>
  </li>})}</ol>
 </div></section>;
}
