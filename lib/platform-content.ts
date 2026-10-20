import type {Item,SiteData} from './content';
import members from './platform-team.json';
export const importedTeam:Item[]=members as Item[];
// Content imported from the academy's public platform: https://almohtaref.app/ar/about
export const aboutPage:Item={id:'about',slug:'about',template:'about',title:'من نحن',category:'من تدريبات الأكاديمية — عمان',subtitle:'بعض المنصات تبدأ بفكرة…\n«المحترف» بدأ بصافرة تدريب',text:'على ملاعب الأكاديمية، وبين التدريبات والتقييمات ومتابعة اللاعبين موسمًا بعد موسم، تكوّنت الرؤية. خبرات فنية وإدارية، نادٍ وأكاديمية، ملاعب احترافية وتجهيزات متخصصة؛ كلها صنعت معرفة لا تأتي من التقارير، بل من الاحتكاك اليومي باللعبة. اليوم نحوّل هذه المعرفة إلى منصة تجعل رحلة اللاعب أكثر وضوحًا، وتمنح الموهبة مساحة تُرى فيها كما تستحق.',image:'/media/hero.webp',status:'published',order:0,ctaLabel:'تعرّف على الفريق',blocks:[
{group:'roots',title:'أكاديمية المحترفون لكرة القدم SPA',text:'نُدرّب اللاعبين من عمر 5 إلى 16 سنة ونطوّر مهاراتهم على ملاعب الأكاديمية، بإشراف مدربين يحملون شهادات تدريبية من FIFA.'},
{group:'roots',title:'نادي المحترفون',text:'الامتداد التنافسي للأكاديمية: فرق تشارك في أجندة بطولات الاتحاد الأردني لكرة القدم، وطريق يفتح أمام الموهوبين باب الأندية الأردنية.'},
{group:'purpose',title:'رسالتنا',text:'أن نجعل اكتشاف المواهب الكروية في الأردن أوضح وأعدل، بحيث يصل اللاعب المجتهد إلى الفرصة المناسبة مهما كانت مدينته أو الجهة التي تديره.'},
{group:'purpose',title:'رؤيتنا',text:'أن تكون المحترف المرجع الموثوق لمواهب كرة القدم في الأردن، ثم في المنطقة.'}
]};
export const platformPage:Item={id:'almohtaref-platform',slug:'platform',template:'platform',title:'منصة المحترف',subtitle:'موهبتك لازم تنشاف.',text:'من الملعب للفرصة الصح. مكان واحد بيجمع اللاعبين والأندية والأكاديميات والوكلاء والكشّافين، عشان نعرض مواهب الكورة بالأردن بملفات واضحة ومعلومات موثّقة من مصدرها.',image:'/media/football.webp',status:'published',order:1,ctaLabel:'اكتشف منصة المحترف',ctaUrl:'https://almohtaref.app/ar',blocks:[
{group:'benefits',title:'هوية ترافق مسيرتك',text:'ملف ومعرّف دائم للاعب، يستمران معه عند انتقال إدارة ملفه من جهة إلى أخرى.'},
{group:'benefits',title:'معلومة واضحة المصدر',text:'التحقق يتم على مستوى كل معلومة، والتقييم الفني يعرض مصدره؛ لتقرأ الملف بوضوح.'},
{group:'benefits',title:'بحث يصل للموهبة',text:'ابحث بالاسم أو المعرّف، ثم استكشف بحسب المركز والمحافظة والجنسية والتوفر والجهة المديرة.'},
{group:'benefits',title:'تواصل يحفظ الخصوصية',text:'طلبات الاهتمام تمر عبر المنصة، دون الكشف التلقائي عن أرقام التواصل.'},
{group:'audience',title:'للاعبين',text:'ابنِ ملفك الرياضي، اعرض مهاراتك ومقاطعك، واطلب خدمات التصوير والتقييم. احتفظ بمعرّفك الدائم طوال رحلتك.'},
{group:'audience',title:'للأندية',text:'اكتشف اللاعبين ببحث منظّم، أرسل طلبات الاهتمام، وأدر ملفات لاعبي النادي من مساحة واحدة.'},
{group:'audience',title:'للأكاديميات',text:'نظّم ملفات لاعبيك، اطلب التصوير والتقييم والاختبارات، وتابع الاهتمام الذي يصل إلى مواهب الأكاديمية.'},
{group:'audience',title:'للوكلاء',text:'اعرض ملفات اللاعبين بطريقة منظّمة، تابع طلبات الاهتمام، وانقل إدارة الملف مع الحفاظ على معرّف اللاعب.'},
{group:'audience',title:'للكشافين',text:'استكشف المواهب في أنحاء الأردن، احفظ عمليات البحث، قارن اللاعبين، وأرسل طلبات الاهتمام المناسبة.'},
{group:'services',title:'التقييم الفني',text:'تقييم من مختص معلوم الهوية، مع تقرير مكتوب يختار اللاعب إظهاره أو إبقاءه خاصاً. التقييم رأي مهني ولا يضمن نتيجة إيجابية أو اعتماداً.'},
{group:'services',title:'الاختبارات البدنية',text:'قياس السرعة والرشاقة والقفز والتحمّل، مع نتائج مرتبطة بتاريخ الاختبار ومصدره.'},
{group:'services',title:'التصوير وإبراز المهارات',text:'صور احترافية وفيديو مهارات قصير، بأقل من دقيقتين، جاهزان لعرضهما ضمن ملف اللاعب.'},
{group:'steps',title:'اختر دورك',text:'انتقل إلى المنصة وسجّل بصفتك لاعباً أو جهة تعمل في كرة القدم.'},
{group:'steps',title:'جهّز ملفك',text:'أضف معلوماتك ومقاطعك، أو نظّم ملفات اللاعبين الذين تديرهم.'},
{group:'steps',title:'ابدأ رحلتك',text:'استكشف المواهب والفرص والخدمات، وتابع طلبات الاهتمام من داخل المنصة.'},
{title:'خدمات ميدانية، بشفافية',text:'تُنسّق الخدمات داخل الأردن، ويمكن الجمع بين التصوير والتقييم والاختبارات، أو طلب عرض مخصص للمجموعات. الخدمات اختيارية ومستقلة عن الاشتراك، ولا تمنح ترتيباً أفضل في البحث أو تحققاً تلقائياً أو تقييماً إيجابياً. تفاصيل الطلب والتكلفة متاحة عبر المنصة.'}
]};
export function applyPlatformImport(data:SiteData){if(data.settings._platformContentVersion==='2')return;if(data.settings._platformContentVersion==='1'){data.pages=data.pages.filter(p=>p.slug!=='about');data.pages.unshift(structuredClone(aboutPage));data.settings._platformContentVersion='2';return;}data.pages=data.pages.filter(p=>p.slug!=='about'&&p.slug!=='platform');data.pages.push(structuredClone(aboutPage),structuredClone(platformPage));for(const member of importedTeam){if(!data.team.some(x=>x.id===member.id||(x.title===member.title&&x.subtitle===member.subtitle)))data.team.push({...member});}data.settings._platformContentVersion='2';}
