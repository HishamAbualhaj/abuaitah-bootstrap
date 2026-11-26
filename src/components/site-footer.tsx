import Image from 'next/image';
import {getTranslations} from 'next-intl/server';
import {Mail, MapPin, Phone} from 'lucide-react';
import {images} from '@/assets';
import {Link} from '@/i18n/navigation';
import {navItems} from '@/lib/content';
import {NewsletterForm} from '@/components/website-forms';

export async function SiteFooter() {
  const t = await getTranslations('common');
  return (
    <footer className="mt-16 bg-brand-navy text-white">
      <section className="border-b border-white/15">
        <div className="container grid gap-6 py-10 md:grid-cols-2 md:items-center">
          <div><h2 className="text-2xl font-bold">{t('newsletter')}</h2><p className="mt-2 text-white/80">{t('newsletterText')}</p></div>
          <NewsletterForm />
        </div>
      </section>
      <div className="container grid gap-10 py-12 md:grid-cols-[1.2fr_1fr_1fr]">
        <div><Image src={images.mainLogo.png} alt={t('company')} width={88} height={88} className="rounded-md bg-white p-1" /><p className="mt-5 max-w-xs leading-7 text-white/80">{t('footerText')}</p></div>
        <nav aria-label={t('menu')} className="grid grid-cols-2 content-start gap-x-5 gap-y-2">{navItems.map(item => <Link className="flex min-h-11 items-center rounded-sm text-white/90 underline-offset-4 hover:underline focus-visible:outline-white" key={item.key} href={item.href}>{t(`nav.${item.key}`)}</Link>)}</nav>
        <div className="space-y-4"><h3 className="font-bold">{t('contactDetails')}</h3>
          <p className="flex gap-3 text-sm leading-6 text-white/85"><MapPin className="mt-1 size-5 shrink-0" />{t('address')}</p>
          <a href="tel:+970598893600" className="flex min-h-11 items-center gap-3 hover:underline"><Phone className="size-5" /><span dir="ltr">059 889 3600</span></a>
          <a href="mailto:info@abuaitah.ps" className="flex min-h-11 items-center gap-3 break-all hover:underline"><Mail className="size-5 shrink-0" />info@abuaitah.ps</a>
        </div>
      </div>
      <div className="border-t border-white/15 py-5 text-center text-sm text-white/75">© {new Date().getFullYear()} {t('company')}. {t('rights')}</div>
    </footer>
  );
}
