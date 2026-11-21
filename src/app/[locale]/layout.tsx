import type {Metadata} from 'next';
import localFont from 'next/font/local';
import {hasLocale, NextIntlClientProvider} from 'next-intl';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import {SiteHeader} from '@/components/site-header';
import {SiteFooter} from '@/components/site-footer';
import '../globals.css';

const english = localFont({
  src: [
    {path: '../../assets/fonts/Roboto-Regular.ttf', weight: '400', style: 'normal'},
    {path: '../../assets/fonts/Roboto-Bold.ttf', weight: '700', style: 'normal'}
  ], variable: '--font-english', display: 'swap'
});
const arabic = localFont({
  src: [
    {path: '../../assets/fonts/ExpoArabic-Book.woff2', weight: '400', style: 'normal'},
    {path: '../../assets/fonts/ExpoArabic-SemiBold.woff2', weight: '600', style: 'normal'},
    {path: '../../assets/fonts/ExpoArabic-Bold.woff2', weight: '700', style: 'normal'}
  ], variable: '--font-arabic-face', display: 'swap'
});

export function generateStaticParams() {
  return routing.locales.map(locale => ({locale}));
}

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({locale, namespace: 'common'});
  return {
    title: {default: `${t('company')} | ${t('tagline')}`, template: `%s | ${t('brand')}`},
    description: t('footerText'), icons: {icon: '/icon.png'}
  };
}

export default async function LocaleLayout({children, params}: {
  children: React.ReactNode; params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations('common');
  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className={`${english.variable} ${arabic.variable} scroll-smooth motion-reduce:scroll-auto`}>
      <body className={`min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 ${locale === 'ar' ? 'font-arabic' : 'font-sans'}`}>
        <NextIntlClientProvider>
          <a href="#main" className="sr-only z-50 rounded-md bg-primary p-4 text-white focus:not-sr-only focus:fixed focus:start-4 focus:top-4">{t('skip')}</a>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
