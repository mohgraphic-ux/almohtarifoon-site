import {getContent} from '@/lib/server';
import {publicData} from '@/lib/content';
import PublicSite from '@/components/public-site';
export const dynamic='force-dynamic';
export async function generateMetadata(){const {data}=await getContent();return {title:data.settings.seoTitle,description:data.settings.description};}
export default async function Home(){return <PublicSite data={publicData((await getContent()).data)} slug="home"/>}
