'use client';
import {useEffect,type CSSProperties} from 'react';

// Splits a heading into words (never letters, so Arabic joining stays intact) for the staggered rise.
export function Words({text,from=0}:{text:string;from?:number}){
 let n=from;
 return <>{text.split(/(\s+)/).map((w,i)=>/^\s+$/.test(w)||!w?w:<span key={i} className="m-word" style={{'--w':n++} as CSSProperties}>{w}</span>)}</>;
}
export const wordCount=(text:string)=>text.split(/\s+/).filter(Boolean).length;

// What reveals on scroll: [selector, style]. Siblings that match the same selector are staggered.
const REVEAL:[string,'up'|'mask'|'zoom'|'stage'][]=[
 ['.px-gates-head','up'],['.px-door','mask'],
 ['.px-platform-copy>:not(h2)','up'],['.px-platform h2','stage'],['.px-platform ul','stage'],['.px-phone-wrap','stage'],
 ['.ha-head','up'],['.ha-item','up'],
 ['.hg-head','up'],['.hg-tile','mask'],
 ['.nw-home-head','up'],['.nw-index>li','up'],
 ['.nw-lead','up'],['.nw-card','up'],
 ['.gl-occasion','up'],['.gl-photos>button','mask'],
 ['.px-gpage-chips','up'],['.tl-filter','up'],
 ['.detail-blocks article','up'],['.team-card','up'],['.faq-section>div','up'],
 ['.px-contact-intro','up'],['.px-ccard','up'],['.px-contact form','zoom'],
 ['.px-ach-cta','up'],['.px-strip','up'],['.px-privacy','up'],
];

// Scroll motion for the public site: reveals, hero shrink, count-up, door tilt and shared-image page transitions.
// Content stays visible without JS or with reduced motion: hiding only starts once data-motion is set.
export default function Motion(){
 useEffect(()=>{
  const root=document.querySelector<HTMLElement>('.public-site.pro');
  if(!root||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  root.dataset.motion='on';
  const off:(()=>void)[]=[];

  const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const el=e.target as HTMLElement;el.dataset.in='';io.unobserve(el);if(el.matches('dd'))count(el)}),{rootMargin:'0px 0px -8% 0px',threshold:.08});
  const tag=()=>{
   for(const [sel,kind] of REVEAL)root.querySelectorAll<HTMLElement>(sel).forEach(el=>{
    if(el.dataset.m)return;
    const sibs=Array.from(el.parentElement?.children||[]).filter(x=>x.matches(sel));
    el.dataset.m=kind;el.style.setProperty('--mi',String(Math.min(sibs.indexOf(el),6)));io.observe(el);
   });
   root.querySelectorAll<HTMLElement>('.px-ach-stats dd:not([data-count])').forEach(el=>{const n=Number(el.textContent);if(!Number.isFinite(n)||n<2)return;el.dataset.count=String(n);el.textContent='0';io.observe(el)});
  };
  const count=(el:HTMLElement)=>{const n=Number(el.dataset.count),t0=performance.now(),d=1200;const step=(t:number)=>{const p=Math.min(1,(t-t0)/d);el.textContent=String(Math.round(n*(1-Math.pow(1-p,3))));if(p<1)requestAnimationFrame(step)};requestAnimationFrame(step)};
  tag();
  let queued=0;const mo=new MutationObserver(()=>{cancelAnimationFrame(queued);queued=requestAnimationFrame(tag)});
  mo.observe(root,{childList:true,subtree:true});off.push(()=>{io.disconnect();mo.disconnect()});

  // Home hero: as you scroll away the film pulls back into a rounded frame and the copy drifts up.
  const hero=root.querySelector<HTMLElement>('.px-hero');
  if(hero){let raf=0;const upd=()=>{raf=0;const p=Math.max(0,Math.min(1,-hero.getBoundingClientRect().top/hero.offsetHeight));hero.style.setProperty('--hp',p.toFixed(3))};
   const onScroll=()=>{if(!raf)raf=requestAnimationFrame(upd)};upd();addEventListener('scroll',onScroll,{passive:true});off.push(()=>removeEventListener('scroll',onScroll))}

  // Platform: the phone drifts with the scroll and turns toward the pointer.
  const plat=root.querySelector<HTMLElement>('.px-platform'),phone=plat?.querySelector<HTMLElement>('.px-phone-wrap');
  if(plat&&phone){let raf=0;const upd=()=>{raf=0;const r=plat.getBoundingClientRect();plat.style.setProperty('--pp',((innerHeight-r.top)/(innerHeight+r.height)-.5).toFixed(3))};
   const onScroll=()=>{if(!raf)raf=requestAnimationFrame(upd)};upd();addEventListener('scroll',onScroll,{passive:true});off.push(()=>removeEventListener('scroll',onScroll));
   if(matchMedia('(hover: hover) and (pointer: fine)').matches){
    const move=(e:PointerEvent)=>{const r=phone.getBoundingClientRect();phone.style.setProperty('--tx',Math.max(-1,Math.min(1,(e.clientX-r.left-r.width/2)/(r.width*1.5))).toFixed(3));phone.style.setProperty('--ty',Math.max(-1,Math.min(1,(e.clientY-r.top-r.height/2)/r.height)).toFixed(3))};
    const leave=()=>{phone.style.setProperty('--tx','0');phone.style.setProperty('--ty','0')};
    plat.addEventListener('pointermove',move);plat.addEventListener('pointerleave',leave);off.push(()=>{plat.removeEventListener('pointermove',move);plat.removeEventListener('pointerleave',leave)});
   }
  }

  // Gateways: the card leans toward the pointer and the photo drifts against it (mouse only).
  if(matchMedia('(hover: hover) and (pointer: fine)').matches){
   const move=(e:PointerEvent)=>{const d=(e.target as Element).closest<HTMLElement>('.px-door');if(!d)return;const r=d.getBoundingClientRect();d.style.setProperty('--mx',(((e.clientX-r.left)/r.width)*2-1).toFixed(3));d.style.setProperty('--my',(((e.clientY-r.top)/r.height)*2-1).toFixed(3))};
   const leave=(e:PointerEvent)=>{const d=(e.target as Element).closest<HTMLElement>('.px-door');if(d&&!d.contains(e.relatedTarget as Node)){d.style.setProperty('--mx','0');d.style.setProperty('--my','0')}};
   root.addEventListener('pointermove',move);root.addEventListener('pointerout',leave);off.push(()=>{root.removeEventListener('pointermove',move);root.removeEventListener('pointerout',leave)});
  }

  // Page transitions: the photo you clicked grows into the next page's hero.
  const click=(e:MouseEvent)=>{
   if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
   const a=(e.target as Element).closest<HTMLAnchorElement>('a[href]');
   if(!a||a.target||a.origin!==location.origin||a.pathname===location.pathname)return;
   const img=a.querySelector<HTMLImageElement>('img');if(!img)return;
   root.querySelectorAll<HTMLElement>('.ph-media img').forEach(x=>x.style.viewTransitionName='none');
   img.style.viewTransitionName='hero-img';
  };
  const reset=(e:PageTransitionEvent)=>{if(e.persisted)root.querySelectorAll<HTMLElement>('img').forEach(x=>x.style.viewTransitionName='')};
  root.addEventListener('click',click);addEventListener('pageshow',reset);off.push(()=>{root.removeEventListener('click',click);removeEventListener('pageshow',reset)});

  return()=>{off.forEach(f=>f());delete root.dataset.motion};
 },[]);
 return null;
}

// Same-page morph (e.g. opening a gallery album): runs the state update inside a view transition.
export function morph(update:()=>void,shared?:Element|null){
 const d=document as Document&{startViewTransition?:(cb:()=>void)=>unknown};
 if(!d.startViewTransition||matchMedia('(prefers-reduced-motion: reduce)').matches){update();return}
 const hero=document.querySelector<HTMLElement>('.ph-media img');
 if(shared){if(hero)hero.style.viewTransitionName='none';(shared as HTMLElement).style.viewTransitionName='hero-img'}
 d.startViewTransition(()=>{update();if(hero)hero.style.viewTransitionName=''});
}
