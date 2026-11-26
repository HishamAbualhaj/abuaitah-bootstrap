'use client';

import {useTranslations} from 'next-intl';
import {
  ExternalLink,
  Images,
  Plus,
  Settings2,
  Star,
  Files,
  CircleCheck,
} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {sectionDefinitions} from '@/lib/admin/config';
import type {SectionKey} from '@/lib/admin/types';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {AdminPageHeader} from './admin-components';
import {ContentTable} from './content-table';
import {useWorkspace} from './workspace-provider';

export function SectionList({section}: {section: SectionKey}) {
  const t = useTranslations('admin.cms');
  const {workspace} = useWorkspace();
  const records = workspace.records.filter(
    (record) => record.section === section,
  );
  const stats = [
    {label: 'total', count: records.length, icon: Files},
    {
      label: 'published',
      count: records.filter((record) => record.published).length,
      icon: CircleCheck,
    },
    {
      label: 'featured',
      count: records.filter((record) => record.featured).length,
      icon: Star,
    },
    {
      label: 'mediaCount',
      count: records.reduce((count, record) => count + record.assets.length, 0),
      icon: Images,
    },
  ];
  return (
    <div className="space-y-7">
      <AdminPageHeader
        eyebrow={t('content')}
        title={t(section)}
        description={t(`${section}Description`)}
      >
        <Button asChild variant="outline">
          <Link href={`/admin/${section}/settings`}>
            <Settings2 aria-hidden />
            {t('settings')}
          </Link>
        </Button>
        <Button asChild>
          <Link href={`/admin/${section}/new`}>
            <Plus aria-hidden />
            {t('add')}
          </Link>
        </Button>
      </AdminPageHeader>
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="shadow-none">
            <CardContent className="flex items-start justify-between gap-3 p-5">
              <div>
                <p className="text-sm text-muted-foreground">{t(stat.label)}</p>
                <p className="mt-3 text-3xl font-bold tabular-nums">
                  {stat.count}
                </p>
              </div>
              <span className="rounded-md bg-secondary p-2.5 text-primary">
                <stat.icon aria-hidden className="size-5" />
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
      {(section === 'contact' || section === 'careers') && (
        <p className="rounded-md border border-border bg-card px-4 py-3 text-sm leading-6 text-muted-foreground">
          {t('formDeliveryHint')}
        </p>
      )}
      <ContentTable key={section} section={section} records={records} />
      <div className="flex justify-end">
        <Button asChild variant="ghost">
          <Link
            href={sectionDefinitions[section].publicPath}
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink aria-hidden />
            {t('publicPreview')}
          </Link>
        </Button>
      </div>
    </div>
  );
}
