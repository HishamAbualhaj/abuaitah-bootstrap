'use client';

import {useLocale, useTranslations} from 'next-intl';
import {
  BriefcaseBusiness,
  Database,
  ExternalLink,
  Images,
  Languages,
  MessageSquare,
  Newspaper,
  Package,
  Plus,
} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {
  sectionKeys,
  localizedValue,
  type ContentLanguage,
} from '@/lib/admin/types';
import {Card, CardContent} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {AdminPageHeader, Panel, StatusBadge} from './admin-components';
import {useWorkspace} from './workspace-provider';

const icons = {
  products: Package,
  news: Newspaper,
  gallery: Images,
  careers: BriefcaseBusiness,
  contact: MessageSquare,
};

export function AdminOverview() {
  const t = useTranslations('admin');
  const cms = useTranslations('admin.cms');
  const locale = useLocale() as ContentLanguage;
  const {workspace} = useWorkspace();
  const recent = [...workspace.records]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 5);
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow={cms('overviewHint')}
        title={t('welcome')}
        description={cms('welcomeText')}
      >
        <Button asChild variant="outline">
          <Link href="/" target="_blank" rel="noreferrer">
            <ExternalLink aria-hidden />
            {t('preview')}
          </Link>
        </Button>
      </AdminPageHeader>
      <section
        aria-label={cms('content')}
        className="grid grid-cols-2 gap-4 xl:grid-cols-5"
      >
        {sectionKeys.map((section) => {
          const Icon = icons[section];
          return (
            <Link
              key={section}
              href={`/admin/${section}`}
              className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Card className="h-full shadow-none transition-colors hover:border-primary/40 hover:bg-secondary/30">
                <CardContent className="p-5">
                  <div className="mb-5 flex items-center justify-between gap-2">
                    <span className="rounded-md bg-secondary p-2.5 text-primary">
                      <Icon aria-hidden className="size-5" />
                    </span>
                  </div>
                  <p className="text-4xl font-bold tabular-nums">
                    {
                      workspace.records.filter(
                        (record) => record.section === section,
                      ).length
                    }
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {cms(section)}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </section>
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(280px,1fr)]">
        <Panel title={cms('manage')} hint={cms('quickText')}>
          <div className="space-y-3">
            {sectionKeys.map((section) => {
              const Icon = icons[section];
              return (
                <div
                  key={section}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border p-4"
                >
                  <Link
                    href={`/admin/${section}`}
                    className="flex min-h-11 flex-1 items-center gap-3 text-sm font-medium hover:text-primary"
                  >
                    <span className="rounded-md bg-muted p-2.5">
                      <Icon aria-hidden className="size-5 text-primary" />
                    </span>
                    {cms(section)}
                  </Link>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/${section}/new`}>
                      <Plus aria-hidden />
                      {cms('add')}
                    </Link>
                  </Button>
                </div>
              );
            })}
          </div>
        </Panel>
        <div className="space-y-6">
          <Panel title={cms('browserOnly')} hint={cms('browserDescription')}>
            <dl className="space-y-4 text-sm">
              <div className="flex items-center justify-between gap-2 border-b border-border pb-4">
                <dt className="flex items-center gap-2 text-muted-foreground">
                  <Database aria-hidden className="size-4" />
                  {cms('backend')}
                </dt>
                <dd>
                  <Badge variant="secondary">{cms('notConnected')}</Badge>
                </dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="flex items-center gap-2 text-muted-foreground">
                  <Languages aria-hidden className="size-4" />
                  {t('languages')}
                </dt>
                <dd className="font-medium">English / العربية</dd>
              </div>
            </dl>
          </Panel>
          <div className="rounded-md border border-primary/15 bg-secondary p-5">
            <p className="text-sm font-bold text-primary">
              {cms('languagesHint')}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {cms('fallback')}
            </p>
          </div>
        </div>
      </div>
      <Panel title={cms('recent')} hint={cms('recentDescription')}>
        <div className="divide-y divide-border">
          {recent.map((record) => (
            <div
              key={record.id}
              className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0"
            >
              <div className="min-w-0 flex-1">
                <Link
                  href={`/admin/${record.section}/${record.id}`}
                  className="font-medium hover:text-primary hover:underline"
                >
                  {localizedValue(record, 'title', locale)}
                </Link>
                <p className="mt-1 text-sm text-muted-foreground">
                  {cms(record.section)}
                </p>
              </div>
              <StatusBadge published={record.published} />
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
