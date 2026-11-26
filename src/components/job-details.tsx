import {getFormatter, getTranslations} from 'next-intl/server';
import {Badge} from '@/components/ui/badge';
import {ShareButton} from '@/components/share-button';

export async function JobDetails() {
  const t = await getTranslations('pages.jobs');
  const c = await getTranslations('common');
  const format = await getFormatter();
  return <div className="mb-10 space-y-6 rounded-md border border-border p-6 md:p-8"><div className="flex flex-wrap items-center justify-between gap-4"><Badge variant="secondary">{t('closed')}</Badge><ShareButton /></div><p className="leading-7 text-muted-foreground">{t('archive')}</p>
    <dl className="grid gap-6 sm:grid-cols-2">{[
      {label: t('location'), value: c('address')},
      {label: t('fullTime'), value: t('fullTime')},
      {label: t('published'), value: format.dateTime(new Date('2021-03-12T12:00:00Z'), {year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'})},
      {label: t('deadline'), value: format.dateTime(new Date('2022-03-25T12:00:00Z'), {year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'})}
    ].map(item => <div key={item.label}><dt className="mb-2 text-sm text-muted-foreground">{item.label}</dt><dd className="font-bold leading-7">{item.value}</dd></div>)}</dl>
  </div>;
}
