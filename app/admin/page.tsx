import {requireChatGPTUser} from '@/app/chatgpt-auth';
import {admin,db} from '@/lib/server';
import {selfHosted} from '@/lib/self-auth';
import Dashboard from '@/components/dashboard';
export const dynamic='force-dynamic';
export const metadata={title:'لوحة الإدارة | المحترفون',robots:{index:false,follow:false}};
export default async function Admin(){const user=await requireChatGPTUser('/admin');const allowed=await admin();const self=selfHosted();const configured=self||!!await db().prepare('SELECT id FROM admins LIMIT 1').first();return <Dashboard authorized={!!allowed} configured={configured} displayName={user.displayName} signOutHref={self?'/api/admin/logout':'/signout-with-chatgpt?return_to=/'}/>}
