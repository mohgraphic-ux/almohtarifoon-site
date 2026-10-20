import type {ReactNode} from 'react';
import {ArrowLeft} from 'lucide-react';

export type HeroTone='academy'|'club'|'pool'|'platform'|'general';

// Shared hero for every inner page: full-bleed photo with a slow zoom, section tint and a slanted gold-edged base.
export default function PageHero({image,eyebrow,icon,title,text,crumbs=[],tone='general',actions,aside,align='start'}:{image?:string;eyebrow?:string;icon?:ReactNode;title:ReactNode;text?:string;crumbs?:{href:string;label:string}[];tone?:HeroTone;actions?:ReactNode;aside?:ReactNode;align?:'start'|'center'}){
 return <section className={'ph ph-'+tone+(align==='center'?' ph-center':'')+(image?'':' ph-plain')}>
  {image&&<div className="ph-media" aria-hidden="true"><img src={image} alt="" fetchPriority="high"/></div>}
  <div className="ph-in">
   <div className="ph-copy">
    <nav className="ph-crumbs" aria-label="مسار الصفحة"><a href="/">الرئيسية</a>{crumbs.map(c=><span key={c.href}><ArrowLeft size={13}/><a href={c.href}>{c.label}</a></span>)}</nav>
    {eyebrow&&<span className="ph-eyebrow">{icon}{eyebrow}</span>}
    <h1>{title}</h1>
    {text&&<p>{text}</p>}
    {actions&&<div className="ph-actions">{actions}</div>}
   </div>
   {aside&&<div className="ph-aside">{aside}</div>}
  </div>
 </section>;
}
