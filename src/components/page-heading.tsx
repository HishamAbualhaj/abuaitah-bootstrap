import Image, {type StaticImageData} from 'next/image';
import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';

export async function PageHeading({title, subtitle, image}: {title: string; subtitle: string; image?: StaticImageData}) {
  const t = await getTranslations('common');
  return (
    <section className="relative isolate overflow-hidden bg-secondary">
      {image && <><Image src={image} alt="" fill priority sizes="100vw" className="object-cover" /><div className="absolute inset-0 bg-white/90" /></>}
      <div className="container relative py-12 md:py-16">
        <nav aria-label={title} className="mb-7 flex gap-2 text-sm text-muted-foreground"><Link href="/" className="underline-offset-4 hover:underline">{t('nav.home')}</Link><span aria-hidden="true">/</span><span>{title}</span></nav>
        <h1 className="text-4xl font-bold leading-tight md:text-5xl">{title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>
      </div>
    </section>
  );
}
