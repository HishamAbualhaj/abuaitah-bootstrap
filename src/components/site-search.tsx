'use client';

import {useTranslations} from 'next-intl';
import {useState} from 'react';
import {Search} from 'lucide-react';
import {Link, useRouter} from '@/i18n/navigation';
import {products, events} from '@/lib/content';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Button} from '@/components/ui/button';

function normalize(value: string) {
  return value.toLowerCase().normalize('NFKD').replace(/[\u064b-\u065f\u0670]/g, '').replace(/[أإآ]/g, 'ا').trim();
}

export function SiteSearch({query}: {query: string}) {
  const t = useTranslations('pages.search');
  const c = useTranslations('common');
  const p = useTranslations('pages.products');
  const e = useTranslations('pages.events');
  const j = useTranslations('pages.jobs');
  const router = useRouter();
  const [input, setInput] = useState(query);
  const items = [
    ...products.map((product, i) => ({id: product.id, title: product.named ? p('rayeb') : p('catalogueItem', {number: i + 1}), description: p(product.category), href: '/products'})),
    ...events.map(event => ({id: event.slug, title: e(event.title), description: e(event.text), href: `/events/${event.slug}`})),
    {id: 'job', title: j('role'), description: j('archive'), href: '/jobs/field-marketing'},
    ...['about', 'products', 'events', 'gallery', 'jobs', 'contact'].map(key => ({id: key, title: c(`nav.${key}`), description: c('company'), href: `/${key}`}))
  ];
  const results = query.trim() ? items.filter(item => normalize(`${item.title} ${item.description}`).includes(normalize(query))) : [];
  return <div><form onSubmit={event => {event.preventDefault(); router.replace(`/search?q=${encodeURIComponent(input.trim())}`, {scroll: false});}} className="mb-10 space-y-3"><Label htmlFor="site-search">{t('label')}</Label><div className="flex flex-col gap-3 sm:flex-row"><Input id="site-search" name="q" type="search" placeholder={t('placeholder')} value={input} onChange={event => setInput(event.target.value)} className="min-h-12" /><Button type="submit" size="lg" className="min-h-12 gap-2"><Search className="size-4" />{c('nav.search')}</Button></div></form>
    {!query.trim() ? <p className="py-8 text-muted-foreground">{t('prompt')}</p> : <><p role="status" className="mb-6 font-bold">{t('results', {count: results.length})}</p><div className="space-y-4">{results.map(item => <Link key={item.id} href={item.href} className="block rounded-lg border border-border p-6 transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><h2 className="mb-3 text-xl font-bold">{item.title}</h2><p className="leading-7 text-muted-foreground">{item.description}</p></Link>)}{!results.length && <p className="rounded-lg bg-muted p-8 text-muted-foreground">{c('noResults')}</p>}</div></>}
  </div>;
}
