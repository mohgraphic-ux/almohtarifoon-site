import {sessionCookie} from '@/lib/self-auth';
// Clears the self-hosted admin session.
export async function GET(){return new Response(null,{status:303,headers:{Location:'/','Set-Cookie':sessionCookie('',0)}})}
export const POST=GET;
