import {getTranslations} from 'next-intl/server';
import {images} from '@/assets';
import {PageHeading} from '@/components/page-heading';
import {EventList} from '@/components/event-list';

export default async function EventsPage() {
  const t = await getTranslations('pages.events');
  return <><PageHeading title={t('title')} subtitle={t('subtitle')} image={images.events.png} /><section className="container py-14"><EventList /></section></>;
}
