'use client';

import Image from 'next/image';
import {useFormatter, useLocale, useTranslations} from 'next-intl';
import {useState} from 'react';
import {CalendarDays} from 'lucide-react';
import {events} from '@/lib/content';
import {Link} from '@/i18n/navigation';
import {Card, CardContent} from '@/components/ui/card';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Label} from '@/components/ui/label';

export function EventList({preview = false}: {preview?: boolean}) {
  const t = useTranslations('pages.events');
  const c = useTranslations('common');
  const format = useFormatter();
  const locale = useLocale();
  const [sort, setSort] = useState('newest');
  const sorted = [...events].sort((a, b) => sort === 'newest' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date));
  return <div>
    {!preview && <div className="mb-8 flex flex-wrap items-center justify-between gap-4"><p className="max-w-2xl text-sm leading-6 text-muted-foreground">{c('archiveNotice')}</p><div className="flex items-center gap-3"><Label htmlFor="event-sort">{c('sort')}</Label><Select value={sort} onValueChange={setSort}><SelectTrigger id="event-sort" className="min-h-11 w-44"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="newest">{c('newest')}</SelectItem><SelectItem value="oldest">{c('oldest')}</SelectItem></SelectContent></Select></div></div>}
    <div className="grid gap-6 md:grid-cols-3">{sorted.map(event => <Card key={event.slug} className="group overflow-hidden shadow-none">
      <Link href={`/events/${event.slug}`} className="block h-full rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset">
        <div className="overflow-hidden"><Image src={event.image} alt="" width={342} height={220} sizes="(max-width: 768px) 100vw, 33vw" className="aspect-[342/220] w-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none" /></div>
        <CardContent className="p-6"><p className="mb-4 flex items-center gap-2 text-sm text-muted-foreground"><CalendarDays className="size-4" /><time dateTime={event.date}>{format.dateTime(new Date(`${event.date}T12:00:00Z`), {year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC', numberingSystem: locale === 'ar' ? 'arab' : 'latn'})}</time></p>
          <h3 className="text-xl font-bold leading-relaxed group-hover:text-primary">{t(event.title)}</h3><p className="mt-3 leading-7 text-muted-foreground">{t(event.text)}</p><p className="mt-6 font-bold text-primary">{c('readMore')}</p>
        </CardContent>
      </Link>
    </Card>)}</div>
  </div>;
}
