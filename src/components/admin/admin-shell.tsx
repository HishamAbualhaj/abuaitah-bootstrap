'use client';

import Image from 'next/image';
import {useEffect, useState} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {
  BriefcaseBusiness,
  CheckCircle2,
  Database,
  ExternalLink,
  Images,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Newspaper,
  Package,
  X,
} from 'lucide-react';
import {images} from '@/assets';
import {Link, usePathname, useRouter} from '@/i18n/navigation';
import {demoSessionKey} from '@/lib/admin-demo';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {WorkspaceProvider, useWorkspace} from './workspace-provider';

const navigation = [
  {key: 'products', icon: Package},
  {key: 'news', icon: Newspaper},
  {key: 'gallery', icon: Images},
  {key: 'careers', icon: BriefcaseBusiness},
  {key: 'contact', icon: MessageSquare},
];

function WorkspaceLayout({
  children,
  signOut,
}: {
  children: React.ReactNode;
  signOut: () => void;
}) {
  const t = useTranslations('admin');
  const cms = useTranslations('admin.cms');
  const c = useTranslations('common');
  const locale = useLocale();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const {ready, workspace, notice, error, clearNotice} = useWorkspace();
  const section = navigation.find((item) =>
    pathname.startsWith(`/admin/${item.key}`),
  );
  const currentTitle = section ? cms(section.key) : t('overview');
  const brand = (
    <div className="flex items-center gap-3 pb-7">
      <Image
        src={images.mainLogo.png}
        alt={c('brand')}
        width={48}
        height={48}
        className="size-12 object-contain"
      />
      <div>
        <p className="font-bold">{c('brand')}</p>
        <p className="mt-1 text-sm text-muted-foreground">{t('panel')}</p>
      </div>
    </div>
  );
  const nav = (
    <>
      <p className="mb-3 px-3 text-sm text-muted-foreground">
        {cms('workspace')}
      </p>
      <nav aria-label={t('panel')} className="space-y-1.5">
        <Button
          asChild
          variant={pathname === '/admin' ? 'secondary' : 'ghost'}
          className="w-full justify-start gap-3 shadow-none"
        >
          <Link
            href="/admin"
            aria-current={pathname === '/admin' ? 'page' : undefined}
            onClick={() => setMenuOpen(false)}
          >
            <LayoutDashboard aria-hidden />
            {t('overview')}
          </Link>
        </Button>
        <p className="px-3 pb-1 pt-6 text-sm text-muted-foreground">
          {cms('content')}
        </p>
        {navigation.map((item) => {
          const active = section?.key === item.key;
          return (
            <Button
              key={item.key}
              asChild
              variant={active ? 'secondary' : 'ghost'}
              className="w-full justify-start gap-3 shadow-none"
            >
              <Link
                href={`/admin/${item.key}`}
                aria-current={active ? 'page' : undefined}
                onClick={() => setMenuOpen(false)}
              >
                <item.icon aria-hidden />
                <span className="flex-1">{cms(item.key)}</span>
                <span className="text-sm tabular-nums text-muted-foreground">
                  {
                    workspace.records.filter(
                      (record) => record.section === item.key,
                    ).length
                  }
                </span>
              </Link>
            </Button>
          );
        })}
      </nav>
      <div className="mt-8 rounded-md border border-border bg-muted/60 p-4 lg:mt-auto">
        <Database aria-hidden className="mb-2 size-5 text-primary" />
        <p className="text-sm font-medium">{cms('browserOnly')}</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {cms('browserDescription')}
        </p>
      </div>
      <div className="mt-5 border-t border-border pt-4">
        <Button asChild variant="ghost" className="w-full justify-start gap-3">
          <Link href="/" target="_blank" rel="noreferrer">
            <ExternalLink aria-hidden />
            {t('preview')}
          </Link>
        </Button>
        <Button
          variant="ghost"
          onClick={signOut}
          className="mt-1 w-full justify-start gap-3 text-muted-foreground"
        >
          <LogOut aria-hidden />
          {t('signOut')}
        </Button>
      </div>
    </>
  );
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[250px_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-dvh flex-col overflow-y-auto border-e border-border bg-card p-5 lg:flex">
        {brand}
        {nav}
      </aside>
      <div className="min-w-0">
        <header className="flex min-h-20 flex-wrap items-center justify-between gap-3 border-b border-border bg-card px-4 py-3 md:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  className="lg:hidden"
                  aria-label={c('menu')}
                >
                  <Menu aria-hidden />
                </Button>
              </SheetTrigger>
              <SheetContent
                side={locale === 'ar' ? 'right' : 'left'}
                closeLabel={cms('close')}
                className="flex w-[min(320px,90vw)] flex-col"
              >
                <SheetHeader className="sr-only">
                  <SheetTitle>{t('panel')}</SheetTitle>
                </SheetHeader>
                <div className="pe-6">{brand}</div>
                {nav}
              </SheetContent>
            </Sheet>
            <div>
              <p className="text-sm text-muted-foreground">{t('panel')}</p>
              <p className="mt-0.5 font-bold">{currentTitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <Badge
              variant="secondary"
              className="hidden font-normal sm:inline-flex"
            >
              {t('demo')}
            </Badge>
            <Button asChild variant="outline" className="shadow-none">
              <Link href={pathname} locale={locale === 'ar' ? 'en' : 'ar'}>
                {t('language')}
              </Link>
            </Button>
            <span
              className="hidden size-10 items-center justify-center rounded-md bg-secondary text-sm font-bold text-primary sm:flex"
              aria-label={t('admin')}
            >
              AA
            </span>
          </div>
        </header>
        <main
          id="main"
          className="mx-auto max-w-[1600px] space-y-6 p-4 md:p-8 xl:p-10"
        >
          <p className="flex items-start gap-3 rounded-md border border-border bg-card px-4 py-3 text-sm leading-6 text-muted-foreground">
            <Database
              aria-hidden
              className="mt-1 size-4 shrink-0 text-primary"
            />
            {cms('notice')}
          </p>
          {notice && (
            <div
              role="status"
              className="flex items-center gap-3 rounded-md border border-primary/20 bg-secondary p-4 text-sm"
            >
              <CheckCircle2
                aria-hidden
                className="size-5 shrink-0 text-primary"
              />
              <p className="flex-1">{notice}</p>
              <Button
                variant="ghost"
                size="icon"
                aria-label={cms('dismiss')}
                onClick={clearNotice}
              >
                <X aria-hidden />
              </Button>
            </div>
          )}
          {error && (
            <p
              role="alert"
              className="rounded-md border border-destructive/25 bg-destructive/5 p-4 text-sm leading-6 text-destructive"
            >
              {error}
            </p>
          )}
          {ready ? (
            children
          ) : (
            <p
              role="status"
              className="py-16 text-center text-muted-foreground"
            >
              {cms('loading')}
            </p>
          )}
        </main>
        <div className="px-5 py-6 text-center text-sm text-muted-foreground">
          {c('company')} · {cms('local')}
        </div>
      </div>
    </div>
  );
}

export function AdminShell({children}: {children: React.ReactNode}) {
  const t = useTranslations('admin');
  const router = useRouter();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    // Demo navigation convenience only; real authentication belongs on the server.
    try {
      if (sessionStorage.getItem(demoSessionKey) === 'active') {
        setReady(true);
        return;
      }
    } catch {}
    router.replace('/admin/login');
  }, [router]);
  function signOut() {
    try {
      sessionStorage.removeItem(demoSessionKey);
    } catch {}
    setReady(false);
    router.replace('/admin/login');
  }
  if (!ready)
    return (
      <main
        id="main"
        className="flex min-h-dvh items-center justify-center p-6"
      >
        <p role="status" className="text-muted-foreground">
          {t('checking')}
        </p>
      </main>
    );
  return (
    <WorkspaceProvider>
      <WorkspaceLayout signOut={signOut}>{children}</WorkspaceLayout>
    </WorkspaceProvider>
  );
}
