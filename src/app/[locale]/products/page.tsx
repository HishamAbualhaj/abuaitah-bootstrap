import {getTranslations} from 'next-intl/server';
import {images} from '@/assets';
import {PageHeading} from '@/components/page-heading';
import {ProductCatalogue} from '@/components/product-catalogue';

export default async function ProductsPage() {
  const t = await getTranslations('pages.products');
  return <><PageHeading title={t('title')} subtitle={t('subtitle')} image={images.products.png} /><section className="container py-14"><p className="mb-8 text-sm leading-6 text-muted-foreground">{t('imageNote')}</p><ProductCatalogue /></section></>;
}
