import type {Metadata} from 'next';
import './globals.css';
import './public-v2.css';
import './editorial.css';
import './rubik.css';
import './concept-g.css';
export const metadata:Metadata={title:'المحترفون | الأكاديمية والنادي والمسبح',description:'مساحة تكبر فيها الموهبة. اكتشف أكاديمية المحترفون لكرة القدم والنادي والمسبح في عمّان.',icons:{icon:'/media/academy-logo.png'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ar" dir="rtl"><body>{children}</body></html>}
