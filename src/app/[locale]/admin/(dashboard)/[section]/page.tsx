import {notFound} from 'next/navigation';
import {isSectionKey} from '@/lib/admin/types';
import {SectionList} from '@/components/admin/section-list';

export default async function ManagementPage({params}: {params: Promise<{section: string}>}) {
  const {section} = await params;
  if (!isSectionKey(section)) notFound();
  return <SectionList section={section} />;
}
