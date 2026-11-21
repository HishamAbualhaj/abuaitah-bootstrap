import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {Button} from '@/components/ui/button';

export default async function NotFound() {
  const t = await getTranslations('common');
  return <section className="container py-24 text-center"><p className="mb-5 text-6xl font-bold text-primary">404</p><h1 className="mb-8 text-2xl font-bold">{t('notFound')}</h1><Button asChild><Link href="/">{t('backHome')}</Link></Button></section>;
}
