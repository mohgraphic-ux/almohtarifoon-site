'use client';
import {useEffect,useRef,useState,type ReactNode} from 'react';
import {Play,Pause,X,Volume2} from 'lucide-react';

// Full-bleed cinematic hero: silent looping tour in the background, full tour with sound in a dialog.
export default function HeroFilm({src,poster,children}:{src:string;poster:string;children:(openTour:(()=>void)|null)=>ReactNode}){
 const video=useRef<HTMLVideoElement>(null),dialog=useRef<HTMLDialogElement>(null);
 const [ready,setReady]=useState(false),[playing,setPlaying]=useState(false),[load,setLoad]=useState(false),[open,setOpen]=useState(false),[failed,setFailed]=useState(false);
 useEffect(()=>{const motion=matchMedia('(prefers-reduced-motion: reduce)');const update=()=>{if(motion.matches)video.current?.pause();else setLoad(true)};update();motion.addEventListener('change',update);return()=>motion.removeEventListener('change',update)},[]);
 useEffect(()=>{if(load&&video.current)void video.current.play().catch(()=>setPlaying(false))},[load,src]);
 useEffect(()=>{if(!open)return;dialog.current?.showModal();video.current?.pause();const old=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.body.style.overflow=old;void video.current?.play().catch(()=>{})}},[open]);
 function close(){dialog.current?.close();setOpen(false)}
 async function toggle(){if(!video.current)return;if(playing)video.current.pause();else{setLoad(true);try{await video.current.play()}catch{setPlaying(false)}}}
 const hasVideo=!!src&&!failed;
 return <section className="px-hero">
  <div className="px-hero-media" aria-hidden="true">
   <img src={poster} alt="" fetchPriority="high"/>
   {hasVideo&&<video ref={video} className={ready?'ready':''} src={load?src:undefined} poster={poster} muted loop playsInline preload="none" onCanPlay={()=>setReady(true)} onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onError={()=>setFailed(true)}/>}
  </div>
  {children(hasVideo?()=>setOpen(true):null)}
  {hasVideo&&<button className="px-hero-toggle" onClick={toggle} aria-label={playing?'إيقاف حركة الفيديو':'تشغيل حركة الفيديو'}>{playing?<Pause size={14}/>:<Play size={14}/>}</button>}
  {open&&<dialog ref={dialog} className="tour-dialog" onCancel={e=>{e.preventDefault();close()}} onClick={e=>{if(e.target===dialog.current)close()}}><div className="tour-dialog-heading"><div><span>جولة في مرافقنا</span><h2>تعرّف على المحترفون</h2></div><button onClick={close} aria-label="إغلاق الفيديو" autoFocus><X/></button></div><video src={src} poster={poster} controls autoPlay playsInline aria-label="فيديو مرافق المحترفون"/><p><Volume2 size={15}/>يمكنك التحكم بالصوت والتشغيل من مشغّل الفيديو.</p></dialog>}
 </section>;
}
