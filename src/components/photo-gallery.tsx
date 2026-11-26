'use client';

import Image from 'next/image';
import {useLocale, useTranslations} from 'next-intl';
import {Maximize2} from 'lucide-react';
import {galleryPhotos} from '@/lib/content';
import {Tabs, TabsList, TabsTrigger, TabsContent} from '@/components/ui/tabs';
import {Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger} from '@/components/ui/dialog';

function PhotoGrid() {
  const t = useTranslations('pages.gallery');
  const c = useTranslations('common');
  return <div className="grid gap-5 md:grid-cols-3">{galleryPhotos.map((photo, i) => <Dialog key={photo.src}><DialogTrigger asChild><button type="button" className="group relative overflow-hidden rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4" aria-label={t('open', {number: i + 1})}>
    <Image src={photo} alt={t('imageAlt', {number: i + 1})} width={356} height={300} sizes="(max-width: 768px) 100vw, 33vw" className="aspect-[356/300] w-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none" />
    <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-linear-to-t from-black/80 to-transparent px-5 pb-5 pt-12 text-start text-white"><span>{t('album', {number: i + 1})}</span><Maximize2 className="size-5 shrink-0" /></span>
  </button></DialogTrigger><DialogContent closeLabel={c('close')} className="max-h-[90dvh] overflow-y-auto sm:max-w-3xl"><DialogTitle>{t('album', {number: i + 1})}</DialogTitle><DialogDescription className="sr-only">{t('imageAlt', {number: i + 1})}</DialogDescription><Image src={photo} alt={t('imageAlt', {number: i + 1})} width={712} height={600} className="max-h-[70dvh] w-full rounded-md object-contain" /></DialogContent></Dialog>)}</div>;
}

export function PhotoGallery({preview = false}: {preview?: boolean}) {
  const t = useTranslations('pages.gallery');
  const c = useTranslations('common');
  const locale = useLocale();
  if (preview) return <PhotoGrid />;
  return <Tabs defaultValue="all" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
    <TabsList className="mb-8 h-auto flex-wrap gap-2 bg-transparent p-0">{['all', 'photos', 'videos'].map(type => <TabsTrigger key={type} value={type} className="min-h-12 rounded-md border border-border px-7 data-[state=active]:bg-primary data-[state=active]:text-white">{type === 'all' ? c('all') : t(type)}</TabsTrigger>)}</TabsList>
    <TabsContent value="all"><PhotoGrid /></TabsContent><TabsContent value="photos"><PhotoGrid /></TabsContent><TabsContent value="videos"><p className="rounded-md bg-muted p-10 text-center leading-7 text-muted-foreground">{t('emptyVideos')}</p></TabsContent>
  </Tabs>;
}
