import {getTranslations} from 'next-intl/server';
import {PageHeading} from '@/components/page-heading';
import {SiteSearch} from '@/components/site-search';

export default async function SearchPage({searchParams}: {searchParams: Promise<{q?: string | string[]}>}) {
  const t = await getTranslations('pages.search');
  const {q} = await searchParams;
  const query = typeof q === 'string' ? q.slice(0, 200) : '';
  return <><PageHeading title={t('title')} subtitle={t('subtitle')} /><section className="container max-w-4xl py-14"><SiteSearch key={query} query={query} /></section></>;
}
