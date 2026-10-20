import type {SVGProps,ReactNode} from 'react';

// Site icon set: 24px grid, 1.8 stroke, round caps — drawn to sit next to Rubik Arabic.
type P=SVGProps<SVGSVGElement>&{size?:number};
const make=(paths:ReactNode)=>function Icon({size=20,...rest}:P){return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" className="px-icon" {...rest}>{paths}</svg>};

export const IconHome=make(<><path d="M3.5 10.5 12 4l8.5 6.5"/><path d="M5.5 9v10.5h13V9"/><path d="M10 19.5V15a2 2 0 0 1 4 0v4.5"/></>);
export const IconBall=make(<><circle cx="12" cy="12" r="8.5"/><path d="m12 8.2 3.2 2.3-1.2 3.8h-4l-1.2-3.8z"/><path d="M12 3.5v4.7M15.2 10.5l4.4-1.6M14 14.3l2.8 3.9M10 14.3l-2.8 3.9M8.8 10.5 4.4 8.9"/></>);
export const IconShield=make(<><path d="M12 3.5 19 6v5.5c0 4.3-3 7.6-7 9-4-1.4-7-4.7-7-9V6z"/><path d="m12 8.6 1.2 2.4 2.6.4-1.9 1.8.5 2.6L12 14.5l-2.4 1.3.5-2.6-1.9-1.8 2.6-.4z"/></>);
export const IconSwim=make(<><circle cx="16.5" cy="6.5" r="2"/><path d="M4 11.5 9.5 9l3 3.3-2.8 2"/><path d="m12.5 12.3 3-2"/><path d="M3 17.5c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0 3-1 4.5 0"/><path d="M3 21c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0 3-1 4.5 0"/></>);
export const IconPlatform=make(<><rect x="3.5" y="4.5" width="17" height="15" rx="3"/><circle cx="9" cy="10.5" r="2.3"/><path d="M5.8 16.2c.6-1.8 1.8-2.7 3.2-2.7s2.6.9 3.2 2.7"/><path d="M14.5 9h3M14.5 12h3M14.5 15h2"/></>);
export const IconTrophy=make(<><path d="M8 4.5h8v4.8a4 4 0 0 1-8 0z"/><path d="M8 6.5H5.2a2.6 2.6 0 0 0 2.9 3.6M16 6.5h2.8a2.6 2.6 0 0 1-2.9 3.6"/><path d="M12 13.3v3.2M9 19.5h6M10 16.5h4l.6 3h-5.2z"/></>);
export const IconMedal=make(<><path d="M8.5 3.5h7l-2 5.3h-3z"/><circle cx="12" cy="15" r="5"/><path d="m12 12.6.8 1.6 1.7.3-1.2 1.2.3 1.7-1.6-.8-1.6.8.3-1.7-1.2-1.2 1.7-.3z"/></>);
export const IconGallery=make(<><rect x="6.5" y="6.5" width="14" height="12" rx="2.5"/><path d="M3.5 15.5V6a2.5 2.5 0 0 1 2.5-2.5h11"/><circle cx="11" cy="10.5" r="1.5"/><path d="m6.5 16 4-3.5 3.2 2.8 2.3-1.8 4.5 3.5"/></>);
export const IconNews=make(<><path d="M5 5.5h11.5v13H6.5A1.5 1.5 0 0 1 5 17z"/><path d="M16.5 9H19v8.5a1 1 0 0 1-1 1h-1.5"/><path d="M8 9h5.5M8 12h5.5M8 15h3.5"/></>);
export const IconTeam=make(<><circle cx="9" cy="8.5" r="3"/><path d="M3.5 19c.6-3.2 2.6-5 5.5-5s4.9 1.8 5.5 5"/><circle cx="16.5" cy="9.5" r="2.3"/><path d="M16 14.1c2.4.1 4 1.6 4.5 4.4"/></>);
export const IconWhistle=make(<><circle cx="9" cy="14" r="5"/><path d="M12.6 10.5 20.5 7v4.5l-6 1.3"/><path d="M5 5.5 7 8M9 4v3"/><circle cx="9" cy="14" r="1.2"/></>);
export const IconChat=make(<><path d="M20 12a7.5 7.5 0 0 1-11 6.6L4.5 20l1.3-4.2A7.5 7.5 0 1 1 20 12z"/><path d="M9 11h.01M12.5 11h.01M16 11h.01"/></>);
export const IconPin=make(<><path d="M19 10c0 5-7 11-7 11s-7-6-7-11a7 7 0 0 1 14 0z"/><circle cx="12" cy="10" r="2.5"/></>);
export const IconMail=make(<><rect x="3.5" y="5.5" width="17" height="13" rx="2.5"/><path d="m4.5 7 7.5 6 7.5-6"/></>);
export const IconCalendar=make(<><rect x="4" y="5.5" width="16" height="14.5" rx="2.5"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4"/><path d="M8 13.5h.01M12 13.5h.01M16 13.5h.01M8 16.5h.01M12 16.5h.01"/></>);
export const IconUser=make(<><circle cx="12" cy="8.5" r="3.5"/><path d="M5 20c.8-3.8 3.6-6 7-6s6.2 2.2 7 6"/></>);
export const IconGrid=make(<><rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/></>);
export const IconPhone=make(<path d="M8.6 4.5 6.4 4a1.6 1.6 0 0 0-1.8 1C4 7 4.3 10.5 7.5 14.5s7.5 5.6 9.6 5.4a1.6 1.6 0 0 0 1.4-1.4l.3-2.3a1.4 1.4 0 0 0-.9-1.5l-2.4-.9a1.4 1.4 0 0 0-1.5.4l-.9 1c-1.6-.8-3.2-2.4-4-4l1-.9a1.4 1.4 0 0 0 .4-1.5l-.9-2.4a1.4 1.4 0 0 0-1-.9z"/>);

export const IconStar=make(<path d="m12 3.8 2.5 5.1 5.6.8-4 3.9.9 5.6-5-2.6-5 2.6.9-5.6-4-3.9 5.6-.8z"/>);
export const IconBriefcase=make(<><rect x="3.5" y="7.5" width="17" height="12" rx="2.5"/><path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5M3.5 12.5h17M11 12.5v1.5h2v-1.5"/></>);
export const IconCone=make(<><path d="M10.2 4h3.6l4.7 15H5.5z"/><path d="M8.2 10.5h7.6M6.9 14.8h10.2M3.5 19.5h17"/></>);
export const IconGear=make(<><circle cx="12" cy="12" r="3"/><path d="M12 3.5v2.2M12 18.3v2.2M20.5 12h-2.2M5.7 12H3.5M18 6l-1.6 1.6M7.6 16.4 6 18M18 18l-1.6-1.6M7.6 7.6 6 6"/><circle cx="12" cy="12" r="6.3"/></>);

// Section → icon, shared by navigation, cards and filters.
export const EntityIcon=({entity,size}:{entity:string;size?:number})=>entity==='academy'?<IconBall size={size}/>:entity==='club'?<IconShield size={size}/>:entity==='pool'||entity==='swimming'?<IconSwim size={size}/>:entity==='platform'?<IconPlatform size={size}/>:<IconGrid size={size}/>;
