import {notFound} from 'next/navigation';
import {isSectionKey} from '@/lib/admin/types';
import {ContentForm} from '@/components/admin/content-form';

export default async function EditEntryPage({params}: {params: Promise<{section: string; id: string}>}) {
  const {section, id} = await params;
  if (!isSectionKey(section)) notFound();
  return <ContentForm section={section} id={id} />;
}
