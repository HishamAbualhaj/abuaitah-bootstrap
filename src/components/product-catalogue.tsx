'use client';

import Image from 'next/image';
import {useLocale, useTranslations} from 'next-intl';
import {products} from '@/lib/content';
import {Link} from '@/i18n/navigation';
import {Card, CardContent} from '@/components/ui/card';
import {Tabs, TabsList, TabsTrigger, TabsContent} from '@/components/ui/tabs';
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';

export function ProductCard({product, index}: {product: (typeof products)[number]; index: number}) {
  const t = useTranslations('pages.products');
  const c = useTranslations('common');
  const name = product.named ? t('rayeb') : t('catalogueItem', {number: index + 1});
  return <Dialog><DialogTrigger asChild><button type="button" aria-label={`${t('productDetail')}: ${name}`} className="group w-full rounded-md text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4">
    <Card className="overflow-hidden border-border shadow-none transition-colors group-hover:border-primary/50">
      <CardContent className="p-5"><div className="relative mb-5 flex h-52 items-center justify-center rounded-md bg-muted p-5">
        <Image src={product.image} alt={name} width={150} height={180} className="h-44 w-auto max-w-full object-contain transition-transform duration-200 group-hover:scale-105 motion-reduce:transform-none" />
      </div><p className="mb-2 text-sm text-primary">{t(product.category)}</p><h3 className="font-bold">{name}</h3>{product.named && <p className="mt-1 text-sm text-muted-foreground">{t('size')}</p>}</CardContent>
    </Card>
  </button></DialogTrigger>
    <DialogContent closeLabel={c('close')} className="max-h-[90dvh] overflow-y-auto sm:max-w-lg"><DialogHeader><DialogTitle>{name}</DialogTitle><DialogDescription>{t('imageNote')}</DialogDescription></DialogHeader>
      <div className="flex justify-center rounded-md bg-muted p-8"><Image src={product.image} alt={name} width={150} height={180} className="h-52 w-auto object-contain" /></div>
      <Button asChild><Link href="/contact">{t('enquire')}</Link></Button>
    </DialogContent>
  </Dialog>;
}

export function ProductCatalogue({preview = false}: {preview?: boolean}) {
  const t = useTranslations('pages.products');
  const locale = useLocale();
  if (preview) return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{products.slice(0, 5).map((product, i) => <ProductCard key={product.id} product={product} index={i} />)}</div>;
  return <Tabs defaultValue="all" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
    <TabsList className="mb-8 flex h-auto w-full flex-wrap justify-start gap-2 bg-transparent p-0">{['all', 'dairy', 'cheese', 'salads'].map(type => <TabsTrigger key={type} value={type} className="min-h-12 rounded-md border border-border px-6 py-3 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-white">{t(type)}</TabsTrigger>)}</TabsList>
    {['all', 'dairy', 'cheese', 'salads'].map(type => <TabsContent key={type} value={type}><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{products.map((product, i) => (type === 'all' || product.category === type) && <ProductCard key={product.id} product={product} index={i} />)}</div></TabsContent>)}
  </Tabs>;
}
