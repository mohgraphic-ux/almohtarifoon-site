import {getContent} from '@/lib/server';
import {publicData} from '@/lib/content';
export async function GET(){return Response.json(publicData((await getContent()).data),{headers:{'Cache-Control':'no-store'}});}
