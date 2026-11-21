import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {PageHeading} from '@/components/page-heading';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';

export default async function OffersPage() {
  const t = await getTranslations('pages.offers');
  const c = await getTranslations('common');
  return <><PageHeading title={t('title')} subtitle={t('subtitle')} /><section className="container max-w-4xl py-14"><Badge variant="secondary">{c('archived')}</Badge><p className="my-7 text-lg leading-9 text-muted-foreground">{t('text')}</p><Button asChild><Link href="/contact">{c('nav.contact')}</Link></Button></section></>;
}
