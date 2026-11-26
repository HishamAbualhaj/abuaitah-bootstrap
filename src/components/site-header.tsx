'use client';

import Image from 'next/image';
import {useLocale, useTranslations} from 'next-intl';
import {Menu, Search, Globe2} from 'lucide-react';
import {Suspense, useState} from 'react';
import {useSearchParams} from 'next/navigation';
import {images} from '@/assets';
import {Link, usePathname} from '@/i18n/navigation';
import {navItems} from '@/lib/content';
import {cn} from '@/lib/utils';
import {Button} from '@/components/ui/button';
import {Sheet, SheetContent, SheetTitle, SheetTrigger, SheetDescription} from '@/components/ui/sheet';

function LocaleSwitch() {
  const t = useTranslations('common');
  const locale = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  return <Button asChild variant="outline" className="gap-2 border-border px-3"><Link href={`${pathname}${query ? `?${query}` : ''}`} locale={locale === 'ar' ? 'en' : 'ar'} lang={locale === 'ar' ? 'en' : 'ar'}><Globe2 className="size-4" />{t('language')}</Link></Button>;
}

export function SiteHeader() {
  const t = useTranslations('common');
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const navLinks = navItems.map(item => {
    const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
    return <Link key={item.key} href={item.href} onClick={() => setOpen(false)} aria-current={active ? 'page' : undefined}
      className={cn('flex min-h-11 items-center whitespace-nowrap rounded-md px-3 text-sm font-bold transition-colors hover:bg-accent hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', active && 'bg-secondary text-primary')}>
      {t(`nav.${item.key}`)}
    </Link>;
  });
  return (
    <header className="relative z-30 border-b border-border bg-white">
      <div className="bg-brand-navy py-2 text-center text-sm text-white"><div className="container">{t('since')}</div></div>
      <div className="container flex min-h-24 items-center justify-between gap-3 py-3">
        <Link href="/" aria-label={t('nav.home')} className="shrink-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <Image src={images.mainLogo.png} alt={t('company')} width={72} height={72} priority className="size-[72px] object-contain" />
        </Link>
        <nav aria-label={t('menu')} className="hidden items-center gap-0.5 lg:flex">{navLinks}</nav>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" asChild><Link href="/search" aria-label={t('nav.search')}><Search className="size-5" /></Link></Button>
          <Suspense fallback={<Button asChild variant="outline" className="gap-2 border-border px-3"><Link href={pathname} locale={locale === 'ar' ? 'en' : 'ar'}><Globe2 className="size-4" />{t('language')}</Link></Button>}><LocaleSwitch /></Suspense>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild><Button variant="ghost" size="icon" className="lg:hidden" aria-label={t('menu')}><Menu /></Button></SheetTrigger>
            <SheetContent side={locale === 'ar' ? 'right' : 'left'} className="w-[min(85vw,360px)]" closeLabel={t('close')}>
              <SheetTitle>{t('brand')}</SheetTitle><SheetDescription>{t('tagline')}</SheetDescription>
              <nav aria-label={t('menu')} className="mt-8 flex flex-col gap-3">{navLinks}</nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
