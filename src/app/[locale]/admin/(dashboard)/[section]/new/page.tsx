import {notFound} from 'next/navigation';
import {isSectionKey} from '@/lib/admin/types';
import {ContentForm} from '@/components/admin/content-form';

export default async function NewEntryPage({params}: {params: Promise<{section: string}>}) {
  const {section} = await params;
  if (!isSectionKey(section)) notFound();
  return <ContentForm section={section} />;
}
