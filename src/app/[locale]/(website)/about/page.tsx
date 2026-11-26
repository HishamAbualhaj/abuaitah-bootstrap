import Image from 'next/image';
import {getTranslations} from 'next-intl/server';
import {images} from '@/assets';
import {PageHeading} from '@/components/page-heading';
import {SectionHeading} from '@/components/section-heading';

export default async function AboutPage() {
  const t = await getTranslations('pages.about');
  const c = await getTranslations('common');
  return <><PageHeading title={t('title')} subtitle={t('subtitle')} image={images.we.png} />
    <section className="container grid items-start gap-12 py-16 lg:grid-cols-[1.3fr_1fr]">
      <div className="space-y-6"><h2 className="text-3xl font-bold leading-snug">{c('company')}</h2>{['intro', 'growth', 'quality'].map(key => <p key={key} className="leading-8 text-muted-foreground">{t(key)}</p>)}</div>
      <div className="rounded-md bg-secondary p-8"><Image src={images.milk.png} alt="" width={440} height={320} className="h-auto w-full" /><Image src={images.iso.png} alt="ISO 22000" width={150} height={122} className="mx-auto mt-8" /></div>
    </section>
    <section className="bg-muted"><div className="container grid gap-10 py-16 md:grid-cols-2">{[{key: 'goal', image: images.goal.png}, {key: 'team', image: images.people.png}].map(item => <div key={item.key}><Image src={item.image} alt="" width={49} height={49} className="mb-6 h-12 w-12 object-contain" /><SectionHeading title={t(`${item.key}Title`)} /><p className="leading-8 text-muted-foreground">{t(item.key)}</p></div>)}</div></section>
  </>;
}
