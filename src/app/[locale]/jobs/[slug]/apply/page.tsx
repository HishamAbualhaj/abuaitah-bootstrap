import {notFound} from 'next/navigation';
import {getTranslations} from 'next-intl/server';
import {images} from '@/assets';
import {PageHeading} from '@/components/page-heading';
import {JobDetails} from '@/components/job-details';
import {ApplicationForm} from '@/components/website-forms';

export default async function ApplyPage({params}: {params: Promise<{slug: string}>}) {
  if ((await params).slug !== 'field-marketing') notFound();
  const t = await getTranslations('pages.jobs');
  return <><PageHeading title={t('apply')} subtitle={t('role')} image={images.jobs.png} /><section className="container max-w-5xl py-14"><JobDetails /><ApplicationForm /></section></>;
}
