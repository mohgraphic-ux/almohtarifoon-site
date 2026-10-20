'use client';
import {useState} from 'react';
import {ArrowLeft,ArrowUpLeft,Link2,Check,Newspaper} from 'lucide-react';
import {type Item,byDate,entityOf,formatDate} from '@/lib/content';
import {IconNews,IconCalendar,EntityIcon} from './icons';
import PageHero from './page-hero';
import {type T,entityKey} from '@/lib/copy';

const day=(d?:string)=>d?String(Number(d.slice(8,10))).padStart(2,'0'):'—';
const tag=(x:Item,t:T)=><span className={'nw-tag '+entityOf(x.category)}><EntityIcon entity={entityOf(x.category)} size={14}/>{t(entityKey[entityOf(x.category)])}</span>;
const excerpt=(t:string,n=150)=>{const s=t.replace(/\s+/g,' ').trim();return s.length>n?s.slice(0,n).replace(/\s\S*$/,'')+'…':s};

// Home: three stories as an expanding front-page index. Hovering (or focusing) a row opens it.
export function HomeNews({title,news,t}:{title:string;news:Item[];t:T}){
 const items=[...news].sort(byDate).slice(0,3),[open,setOpen]=useState(0);
 if(!items.length)return null;
 return <section className="nw-home"><div className="nw-home-in">
  <header className="nw-home-head"><span className="px-eyebrow"><IconNews size={18}/>{t('c_home_news_eyebrow')}</span><h2>{title}</h2><p>{t('c_home_news_text')}</p><a className="px-btn px-btn-green" href="/news">{t('c_home_news_all')}<ArrowLeft size={18}/></a></header>
  <ol className="nw-index">{items.map((x,i)=><li key={x.id} className={i===open?'open':''} onMouseEnter={()=>setOpen(i)}>
   <a href={'/news/'+x.id} onFocus={()=>setOpen(i)}>
    <span className="nw-day"><b>{day(x.date)}</b><small>{formatDate(x.date,'month')}</small></span>
    <span className="nw-copy">{tag(x,t)}<h3>{x.title}</h3><p>{excerpt(x.text,120)}</p></span>
    <span className="nw-thumb">{x.image&&<img src={x.image} alt="" loading="lazy"/>}</span>
    <span className="nw-go"><ArrowUpLeft size={22}/></span>
   </a>
   {x.demo&&<span className="px-demo nw-demo">مثال توضيحي</span>}
  </li>)}</ol>
 </div></section>;
}

// News index: lead story, then a filterable editorial grid.
export function NewsIndex({title,image,news,t}:{title:string;image?:string;news:Item[];t:T}){
 const sorted=[...news].sort(byDate),[filter,setFilter]=useState<string>('all');
 const sections=Array.from(new Set(sorted.map(x=>entityOf(x.category))));
 const list=sorted.filter(x=>filter==='all'||entityOf(x.category)===filter),lead=list[0],rest=list.slice(1);
 return <>
  <PageHero image={image} eyebrow={t('c_news_eyebrow')} icon={<IconNews size={18}/>} title={title} text={t('c_news_text')} crumbs={[{href:'/news',label:t('c_news_eyebrow')}]} actions={sections.length>1?<div className="nw-filter" role="group" aria-label="تصفية الأخبار">{['all',...sections].map(x=><button key={x} aria-pressed={filter===x} className={filter===x?'on':''} onClick={()=>setFilter(x)}>{x==='all'?t('c_news_all'):t(entityKey[x as keyof typeof entityKey])}</button>)}</div>:undefined}/>
  <section className="nw-list">
   {lead&&<a className="nw-lead" href={'/news/'+lead.id}><span className="nw-lead-media">{lead.image&&<img src={lead.image} alt=""/>}<span className="nw-latest">{t('c_news_latest')}</span></span><span className="nw-lead-copy"><span className="nw-meta">{tag(lead,t)}<time dateTime={lead.date}><IconCalendar size={15}/>{formatDate(lead.date)}</time>{lead.demo&&<span className="px-demo">مثال توضيحي</span>}</span><h2>{lead.title}</h2>{lead.subtitle&&<p className="nw-sub">{lead.subtitle}</p>}<p>{excerpt(lead.text,220)}</p><span className="nw-read">{t('c_news_read')}<ArrowLeft size={18}/></span></span></a>}
   {rest.length>0&&<div className="nw-grid">{rest.map(x=><a key={x.id} className="nw-card" href={'/news/'+x.id}><span className="nw-card-media">{x.image?<img src={x.image} alt="" loading="lazy"/>:<Newspaper size={36}/>}<span className="nw-date"><b>{day(x.date)}</b><small>{formatDate(x.date,'month')}</small></span></span><span className="nw-card-copy"><span className="nw-meta">{tag(x,t)}{x.demo&&<span className="px-demo">مثال توضيحي</span>}</span><h3>{x.title}</h3><p>{excerpt(x.text)}</p><span className="nw-read">{t('c_news_read')}<ArrowLeft size={16}/></span></span></a>)}</div>}
   {!list.length&&<div className="px-empty"><Newspaper size={36}/><h2>{t('c_news_empty_title')}</h2><p>{t('c_news_empty_text')}</p></div>}
  </section>
 </>;
}

// Single article with reading layout, share actions and related stories.
export function NewsArticle({item,news,t}:{item:Item;news:Item[];t:T}){
 const [copied,setCopied]=useState(false);
 const related=[...news].filter(x=>x.id!==item.id).sort((a,b)=>Number(entityOf(b.category)===entityOf(item.category))-Number(entityOf(a.category)===entityOf(item.category))||byDate(a,b)).slice(0,3);
 const copy=async()=>{try{await navigator.clipboard.writeText(location.href);setCopied(true);setTimeout(()=>setCopied(false),2000)}catch{setCopied(false)}};
 return <article className="nw-article">
  <PageHero image={item.image} tone={entityOf(item.category)} eyebrow={formatDate(item.date)||'خبر'} icon={<IconCalendar size={18}/>} title={item.title} text={item.subtitle} crumbs={[{href:'/news',label:t('c_news_eyebrow')}]} actions={<span className="nw-meta ph-meta">{tag(item,t)}{item.demo&&<span className="px-demo">مثال توضيحي</span>}</span>}/>
  <div className="nw-article-body"><div className="nw-text">{item.text.split(/\n+/).filter(Boolean).map((p,i)=><p key={i}>{p}</p>)}</div>
   <aside className="nw-share"><span>{t('c_news_share')}</span><a href={'https://wa.me/?text='+encodeURIComponent(item.title)} onClick={e=>{e.currentTarget.href='https://wa.me/?text='+encodeURIComponent(item.title+' '+location.href)}} target="_blank" rel="noopener noreferrer">{t('c_news_whatsapp')}</a><button onClick={copy}>{copied?<><Check size={16}/>{t('c_news_copied')}</>:<><Link2 size={16}/>{t('c_news_copy')}</>}</button></aside></div>
  {related.length>0&&<section className="nw-related"><h2>{t('c_news_related')}</h2><div className="nw-grid">{related.map(x=><a key={x.id} className="nw-card" href={'/news/'+x.id}><span className="nw-card-media">{x.image?<img src={x.image} alt="" loading="lazy"/>:<Newspaper size={36}/>}<span className="nw-date"><b>{day(x.date)}</b><small>{formatDate(x.date,'month')}</small></span></span><span className="nw-card-copy"><span className="nw-meta">{tag(x,t)}</span><h3>{x.title}</h3></span></a>)}</div></section>}
 </article>;
}
