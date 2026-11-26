import {notFound} from 'next/navigation';
import {isSectionKey} from '@/lib/admin/types';
import {ContentDetails} from '@/components/admin/content-details';

export default async function EntryDetailsPage({params}: {params: Promise<{section: string; id: string}>}) {
  const {section, id} = await params;
  if (!isSectionKey(section)) notFound();
  return <ContentDetails section={section} id={id} />;
}
