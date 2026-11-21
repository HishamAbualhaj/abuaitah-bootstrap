import {getTranslations} from 'next-intl/server';
import {Package, Newspaper, Images, Languages, ExternalLink, CircleCheck} from 'lucide-react';
import {products, events, galleryPhotos} from '@/lib/content';
import {Link} from '@/i18n/navigation';
import {Card, CardContent, CardHeader, CardTitle, CardDescription} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';

export default async function AdminOverview() {
  const t = await getTranslations('admin');
  const sections = [{key: 'products', count: products.length, icon: Package, href: '/products'}, {key: 'events', count: events.length, icon: Newspaper, href: '/events'}, {key: 'gallery', count: galleryPhotos.length, icon: Images, href: '/gallery'}];
  return <div className="space-y-8">
    <div className="flex flex-wrap items-start justify-between gap-5"><div><p className="mb-3 text-sm font-bold text-primary">{t('overview')}</p><h1 className="text-3xl font-bold leading-snug md:text-4xl">{t('welcome')}</h1><p className="mt-3 max-w-2xl leading-7 text-muted-foreground">{t('welcomeText')}</p></div><Button asChild variant="outline"><Link href="/" target="_blank"><ExternalLink />{t('preview')}</Link></Button></div>
    <section aria-label={t('content')}><p className="mb-4 text-sm text-muted-foreground">{t('contentText')}</p><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[...sections, {key: 'languages', count: 2, icon: Languages}].map(item => <Card key={item.key} className="shadow-none"><CardContent className="p-6"><div className="mb-6 flex items-center justify-between gap-4"><p className="font-bold text-muted-foreground">{t(item.key)}</p><item.icon className="size-5 text-primary" /></div><p className="text-4xl font-bold">{item.count}</p></CardContent></Card>)}</div></section>
    <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]"><Card className="shadow-none"><CardHeader><CardTitle>{t('quick')}</CardTitle><CardDescription className="leading-7">{t('quickText')}</CardDescription></CardHeader><CardContent className="space-y-3">{sections.map(item => <div key={item.key} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-4"><div className="flex items-center gap-3"><span className="rounded-md bg-secondary p-3 text-primary"><item.icon className="size-5" /></span><span className="font-bold">{t(item.key)}</span></div><Button asChild variant="ghost"><Link href={item.href}>{t('view')}<ExternalLink /></Link></Button></div>)}</CardContent></Card>
    <Card className="shadow-none"><CardHeader><div className="mb-3 flex size-11 items-center justify-center rounded-full bg-secondary text-primary"><CircleCheck /></div><CardTitle>{t('status')}</CardTitle><CardDescription className="leading-7">{t('statusText')}</CardDescription></CardHeader><CardContent><dl className="space-y-5">{[['auth','authValue'],['backend','backendValue'],['editing','editingValue']].map(([label,value]) => <div key={label} className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4"><dt className="text-sm text-muted-foreground">{t(label)}</dt><dd><Badge variant="secondary">{t(value)}</Badge></dd></div>)}</dl></CardContent></Card></div>
  </div>;
}
