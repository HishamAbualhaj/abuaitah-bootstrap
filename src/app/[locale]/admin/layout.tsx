import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('admin');
  return {title: t('panel'), robots: {index: false, follow: false}};
}

export default function AdminLayout({children}: {children: React.ReactNode}) {
  return <div className="min-h-dvh bg-muted">{children}</div>;
}
