'use client';

import Image from 'next/image';
import {useEffect, useState} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {LayoutDashboard, LogOut, ExternalLink, ShieldCheck} from 'lucide-react';
import {images} from '@/assets';
import {Link, useRouter} from '@/i18n/navigation';
import {demoSessionKey} from '@/lib/admin-demo';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';

export function AdminShell({children}: {children: React.ReactNode}) {
  const t = useTranslations('admin');
  const c = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    // Navigation convenience for a public UI demo, not a security boundary.
    try {if (sessionStorage.getItem(demoSessionKey) === 'active') {setReady(true); return;}} catch {}
    router.replace('/admin/login');
  }, [router]);
  function signOut() {
    try {sessionStorage.removeItem(demoSessionKey);} catch {}
    setReady(false); router.replace('/admin/login');
  }
  if (!ready) return <main id="main" className="flex min-h-dvh items-center justify-center p-6"><p role="status" className="text-muted-foreground">{t('checking')}</p></main>;
  return <div className="min-h-dvh lg:grid lg:grid-cols-[250px_1fr]">
    <aside className="flex flex-col border-b border-border bg-white p-5 lg:sticky lg:top-0 lg:h-dvh lg:border-e lg:border-b-0">
      <div className="flex items-center gap-3 pb-5"><Image src={images.mainLogo.png} alt={c('brand')} width={56} height={56} /><div><p className="font-bold">{t('panel')}</p><p className="mt-1 text-sm text-muted-foreground">{c('brand')}</p></div></div>
      <nav aria-label={t('panel')} className="flex flex-wrap gap-2 lg:flex-col"><Button asChild className="justify-start" variant="secondary"><Link href="/admin" aria-current="page"><LayoutDashboard />{t('overview')}</Link></Button><Button asChild variant="ghost" className="justify-start"><Link href="/" target="_blank"><ExternalLink />{t('preview')}</Link></Button></nav>
      <div className="mt-6 border-t border-border pt-5 lg:mt-auto"><p className="mb-3 text-sm text-muted-foreground">{t('admin')}</p><Button variant="outline" onClick={signOut} className="w-full justify-start"><LogOut />{t('signOut')}</Button></div>
    </aside>
    <div className="min-w-0"><header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-white px-5 py-4 md:px-8"><div className="flex items-center gap-2"><ShieldCheck className="size-5 text-primary" /><span className="font-bold">{t('overview')}</span><Badge variant="secondary">{t('demo')}</Badge></div><Button asChild variant="outline"><Link href="/admin" locale={locale === 'ar' ? 'en' : 'ar'}>{t('language')}</Link></Button></header>
      <main id="main" className="mx-auto max-w-[1440px] space-y-6 p-5 md:p-8 xl:p-10"><p className="rounded-lg border border-primary/15 bg-secondary p-4 text-sm leading-6 text-muted-foreground">{t('notice')}</p>{children}</main>
    </div>
  </div>;
}
