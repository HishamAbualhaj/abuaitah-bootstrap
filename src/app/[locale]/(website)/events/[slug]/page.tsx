import Image from 'next/image';
import {notFound} from 'next/navigation';
import {getFormatter, getTranslations} from 'next-intl/server';
import {events} from '@/lib/content';
import {images} from '@/assets';
import {PageHeading} from '@/components/page-heading';
import {ShareButton} from '@/components/share-button';
import {EventList} from '@/components/event-list';
import {SectionHeading} from '@/components/section-heading';

export function generateStaticParams() {return events.map(event => ({slug: event.slug}));}

export default async function EventPage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params;
  const event = events.find(event => event.slug === slug);
  if (!event) notFound();
  const t = await getTranslations('pages.events');
  const c = await getTranslations('common');
  const format = await getFormatter();
  return <><PageHeading title={t(event.title)} subtitle={format.dateTime(new Date(`${event.date}T12:00:00Z`), {year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'})} />
    <article className="container max-w-4xl py-14"><p className="mb-7 text-sm text-muted-foreground">{c('archiveNotice')}</p>
      <Image src={slug === 'palestinian-industries' ? images.event_details.png : event.image} alt={t(event.title)} width={1088} height={500} sizes="(max-width: 900px) 100vw, 850px" className="mb-9 max-h-[500px] w-full rounded-md object-cover" />
      <div className="space-y-6 text-lg leading-9 text-muted-foreground"><p>{t(event.text)}</p>{slug === 'palestinian-industries' && <><p>{t('article')}</p><p>{t('articleMore')}</p></>}</div><div className="mt-9"><ShareButton /></div>
    </article><section className="container py-8"><SectionHeading title={t('related')} /><EventList preview /></section>
  </>;
}
