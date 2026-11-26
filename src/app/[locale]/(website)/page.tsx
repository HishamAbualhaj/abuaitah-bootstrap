import Image from 'next/image';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {images} from '@/assets';
import {Link} from '@/i18n/navigation';
import {Button} from '@/components/ui/button';
import {SectionHeading} from '@/components/section-heading';
import {ProductCatalogue} from '@/components/product-catalogue';
import {EventList} from '@/components/event-list';
import {PhotoGallery} from '@/components/photo-gallery';

export default async function HomePage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('landing');
  const c = await getTranslations('common');
  const values = [
    {key: 'quality', image: images.quality.png, color: 'bg-secondary'},
    {key: 'experience', image: images.experience.png, color: 'bg-violet-50'},
    {key: 'trust', image: images.confidence.png, color: 'bg-rose-50'},
    {key: 'care', image: images.job.png, color: 'bg-amber-50'}
  ];
  return <>
    <section className="relative isolate overflow-hidden bg-secondary">
      <Image src={images.landing.png} alt="" fill priority sizes="100vw" className="object-cover object-[65%_center]" />
      <div className="absolute inset-0 bg-linear-to-r from-brand-navy/90 via-brand-navy/65 to-brand-navy/10 rtl:bg-linear-to-l" />
      <div className="container relative flex min-h-[620px] items-center py-20 md:min-h-[650px] md:py-24">
        <div className="max-w-2xl text-white"><p className="mb-6 text-sm font-bold tracking-wide">{t('eyebrow')}</p>
          <h1 className="whitespace-pre-line text-5xl font-bold leading-[1.2] md:text-7xl md:leading-[1.15]">{t('title')}</h1>
          <p className="mt-7 max-w-lg text-lg leading-8 text-white/90">{t('description')}</p>
          <div className="mt-9 flex flex-wrap gap-3"><Button asChild size="lg" className="min-h-12 px-7"><Link href="/products">{t('cta')}</Link></Button><Button asChild variant="outline" size="lg" className="min-h-12 border-white/50 bg-transparent px-7 text-white hover:bg-white hover:text-brand-navy"><Link href="/about">{c('learnMore')}</Link></Button></div>
        </div>
      </div>
    </section>
    <section className="container grid items-center gap-12 py-20 md:grid-cols-2 md:py-24">
      <div><SectionHeading label={t('storyLabel')} title={t('storyTitle')} /><p className="mb-7 leading-8 text-muted-foreground">{t('storyText')}</p><Button asChild variant="outline" size="lg"><Link href="/about">{c('learnMore')}</Link></Button></div>
      <div className="relative rounded-[2rem] bg-secondary px-5 pb-5 pt-10"><Image src={images.milk.png} alt="" width={440} height={320} sizes="(max-width: 768px) 100vw, 45vw" className="mx-auto h-auto w-full max-w-lg object-contain" />
        <div className="mt-7 grid grid-cols-3 divide-x divide-border rounded-md bg-white p-5 text-center rtl:divide-x-reverse">{[
          {value: locale === 'ar' ? '٢٠١١' : '2011', label: 'statYears'},
          {value: locale === 'ar' ? '٥٬٠٠٠+' : '5,000+', label: 'statMilk'},
          {value: t('localValue'), label: 'statLocal'}
        ].map(stat => <div key={stat.label} className="px-2"><p className="text-xl font-bold text-primary sm:text-2xl">{stat.value}</p><p className="mt-2 text-sm leading-5 text-muted-foreground">{t(stat.label)}</p></div>)}</div>
      </div>
    </section>
    <section className="bg-secondary"><div className="container grid items-center gap-8 py-12 md:grid-cols-2"><div><p className="mb-3 text-sm font-bold text-primary">{t('brandsLabel')}</p><h2 className="text-3xl font-bold">{t('brandsTitle')}</h2><p className="mt-4 leading-7 text-muted-foreground">{t('brandsText')}</p></div><div className="grid grid-cols-2 gap-4"><div className="flex min-h-36 items-center justify-center rounded-md bg-white p-6"><Image src={images.logo2.png} alt={c('brand')} width={157} height={72} className="h-auto max-h-24 w-auto max-w-full object-contain" /></div><div className="flex min-h-36 items-center justify-center rounded-md bg-white p-6"><Image src={images.logo.png} alt={c('company')} width={210} height={113} className="h-auto max-h-24 w-auto max-w-full object-contain" /></div></div></div></section>
    <section className="container py-20"><SectionHeading label={t('valuesLabel')} title={t('valuesTitle')} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{values.map(value => <div key={value.key} className={`rounded-md p-7 ${value.color}`}><Image src={value.image} alt="" width={48} height={54} className="mb-7 h-12 w-12 object-contain" /><h3 className="text-xl font-bold">{t(`values.${value.key}.title`)}</h3><p className="mt-3 leading-7 text-muted-foreground">{t(`values.${value.key}.text`)}</p></div>)}</div>
    </section>
    <section className="bg-muted py-16"><div className="container"><SectionHeading label={t('productsLabel')} title={t('productsTitle')} description={t('productsText')}><Button asChild variant="outline"><Link href="/products">{c('viewAll')}</Link></Button></SectionHeading><ProductCatalogue preview /></div></section>
    <section className="container py-16"><div className="flex flex-col items-center gap-7 rounded-md bg-brand-navy p-8 text-center text-white md:flex-row md:p-12 md:text-start"><Image src={images.iso.png} alt="ISO 22000" width={150} height={122} className="shrink-0 rounded-md bg-white p-3" /><div><h2 className="text-2xl font-bold md:text-3xl">{t('certification')}</h2><p className="mt-4 max-w-2xl leading-7 text-white/85">{t('certificationText')}</p></div></div></section>
    <section className="container py-8"><SectionHeading label={t('newsLabel')} title={t('newsTitle')}><Button asChild variant="outline"><Link href="/events">{c('viewAll')}</Link></Button></SectionHeading><EventList preview /></section>
    <section className="container pb-8 pt-16"><SectionHeading label={t('galleryLabel')} title={t('galleryTitle')}><Button asChild variant="outline"><Link href="/gallery">{c('viewAll')}</Link></Button></SectionHeading><PhotoGallery preview /></section>
  </>;
}
