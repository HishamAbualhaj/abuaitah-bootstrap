import {getFormatter, getTranslations} from 'next-intl/server';
import {MapPin, BriefcaseBusiness, CalendarDays} from 'lucide-react';
import {images} from '@/assets';
import {Link} from '@/i18n/navigation';
import {PageHeading} from '@/components/page-heading';
import {Card, CardContent} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';

export default async function JobsPage() {
  const t = await getTranslations('pages.jobs');
  const c = await getTranslations('common');
  const format = await getFormatter();
  return <><PageHeading title={t('title')} subtitle={t('subtitle')} image={images.jobs.png} />
    <section className="container py-14"><p className="mb-8 max-w-3xl rounded-lg bg-secondary p-5 leading-7">{t('archive')}</p>
      <Card className="max-w-4xl shadow-none"><CardContent className="p-6 md:p-8"><div className="mb-6 flex flex-wrap items-start justify-between gap-4"><h2 className="text-2xl font-bold leading-snug">{t('role')}</h2><Badge variant="secondary">{t('closed')}</Badge></div>
        <div className="space-y-4 text-muted-foreground"><p className="flex items-start gap-3"><MapPin className="size-5 shrink-0" />{c('address')}</p><p className="flex items-center gap-3"><BriefcaseBusiness className="size-5" />{t('fullTime')}</p><p className="flex items-start gap-3"><CalendarDays className="size-5 shrink-0" /><span>{t('deadline')}: <time dateTime="2022-03-25">{format.dateTime(new Date('2022-03-25T12:00:00Z'), {year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'})}</time></span></p></div>
        <Button asChild className="mt-7"><Link href="/jobs/field-marketing">{c('details')}</Link></Button>
      </CardContent></Card>
    </section>
  </>;
}
