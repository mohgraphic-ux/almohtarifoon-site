import {getContent} from '@/lib/server';
import {publicData} from '@/lib/content';
import {notFound} from 'next/navigation';
import PublicSite from '@/components/public-site';
export const dynamic='force-dynamic';
export async function generateMetadata({params}:{params:Promise<{id:string}>}){const {id}=await params;const data=publicData((await getContent()).data);const item=data.news.find(x=>x.id===id);return {title:(item?.title||'الأخبار')+' | المحترفون',description:item?.text.slice(0,160)||data.settings.description};}
export default async function Article({params}:{params:Promise<{id:string}>}){const {id}=await params;const data=publicData((await getContent()).data);if(!data.news.some(x=>x.id===id))notFound();return <PublicSite data={data} slug="news" article={id}/>}
