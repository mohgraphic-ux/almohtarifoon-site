import {requireChatGPTUser} from '@/app/chatgpt-auth';
import {admin,db} from '@/lib/server';
import Dashboard from '@/components/dashboard';
export const dynamic='force-dynamic';
export const metadata={title:'لوحة الإدارة | المحترفون',robots:{index:false,follow:false}};
export default async function Admin(){const user=await requireChatGPTUser('/admin');const allowed=await admin();const configured=!!await db().prepare('SELECT id FROM admins LIMIT 1').first();return <Dashboard authorized={!!allowed} configured={configured} displayName={user.displayName}/>}
