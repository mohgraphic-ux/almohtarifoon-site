import {getContent} from '@/lib/server';
import {publicData} from '@/lib/content';
import {notFound} from 'next/navigation';
import PublicSite from '@/components/public-site';
export const dynamic='force-dynamic';
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const {data}=await getContent();const item=[...data.pages,...data.departments].find(x=>x.slug===slug&&x.status==='published');return {title:(item?.title||({contact:'تواصل معنا',gallery:'معرض الصور',news:'الأخبار',privacy:'الخصوصية',achievements:'الإنجازات'} as Record<string,string>)[slug]||data.settings.name)+' | المحترفون',description:item?.text||data.settings.description};}
export default async function Page({params,searchParams}:{params:Promise<{slug:string}>;searchParams:Promise<{album?:string}>}){const {slug}=await params;const {album}=await searchParams;const data=publicData((await getContent()).data);if(!['contact','gallery','news','privacy','achievements'].includes(slug)&&![...data.pages,...data.departments].some(x=>x.slug===slug))notFound();return <PublicSite data={data} slug={slug} album={slug==='gallery'&&typeof album==='string'?album:undefined}/>}
