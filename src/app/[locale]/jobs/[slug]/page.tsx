import {notFound} from 'next/navigation';
import {getTranslations} from 'next-intl/server';
import {images} from '@/assets';
import {Link} from '@/i18n/navigation';
import {PageHeading} from '@/components/page-heading';
import {JobDetails} from '@/components/job-details';
import {Button} from '@/components/ui/button';

export function generateStaticParams() {return [{slug: 'field-marketing'}];}
export default async function JobPage({params}: {params: Promise<{slug: string}>}) {
  if ((await params).slug !== 'field-marketing') notFound();
  const t = await getTranslations('pages.jobs');
  return <><PageHeading title={t('role')} subtitle={t('fullTime')} image={images.jobs.png} /><article className="container max-w-5xl py-14"><JobDetails />
    <h2 className="mb-5 text-2xl font-bold">{t('description')}</h2><p className="leading-8 text-muted-foreground">{t('descriptionText')}</p><h2 className="mb-5 mt-10 text-2xl font-bold">{t('requirements')}</h2><ul className="list-disc space-y-3 ps-6 leading-8 text-muted-foreground">{['requirement1', 'requirement2', 'requirement3'].map(key => <li key={key}>{t(key)}</li>)}</ul><Button asChild variant="outline" size="lg" className="mt-10"><Link href="/jobs/field-marketing/apply">{t('preview')}</Link></Button>
  </article></>;
}
