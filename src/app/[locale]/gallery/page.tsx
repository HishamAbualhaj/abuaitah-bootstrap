import {getTranslations} from 'next-intl/server';
import {images} from '@/assets';
import {PageHeading} from '@/components/page-heading';
import {PhotoGallery} from '@/components/photo-gallery';

export default async function GalleryPage() {
  const t = await getTranslations('pages.gallery');
  return <><PageHeading title={t('title')} subtitle={t('subtitle')} image={images.albums.png} /><section className="container py-14"><PhotoGallery /></section></>;
}
