'use client';

import {useState} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {Pencil, Star, Trash2} from 'lucide-react';
import {Link, useRouter} from '@/i18n/navigation';
import {sectionDefinitions} from '@/lib/admin/config';
import {
  localizedValue,
  type ContentLanguage,
  type SectionKey,
} from '@/lib/admin/types';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {
  AdminPageHeader,
  DeleteEntryDialog,
  MissingEntry,
  Panel,
  StatusBadge,
} from './admin-components';
import {MediaManager} from './media-manager';
import {useWorkspace} from './workspace-provider';

export function ContentDetails({
  section,
  id,
}: {
  section: SectionKey;
  id: string;
}) {
  const t = useTranslations('admin.cms');
  const locale = useLocale() as ContentLanguage;
  const router = useRouter();
  const {workspace} = useWorkspace();
  const [deleting, setDeleting] = useState(false);
  const record = workspace.records.find(
    (item) => item.id === id && item.section === section,
  );
  if (!record) return <MissingEntry href={`/admin/${section}`} />;
  const definition = sectionDefinitions[section];
  const valueLabel = (value: string) =>
    t.has(value) ? t(value) : value || t('noValue');
  return (
    <div className="space-y-7">
      <div>
        <Button asChild variant="ghost" className="mb-5 -ms-4">
          <Link href={`/admin/${section}`}>{t('back')}</Link>
        </Button>
        <AdminPageHeader
          eyebrow={t(section)}
          title={localizedValue(record, 'title', locale)}
          description={t('detailsDescription')}
        >
          <Button
            variant="outline"
            className="text-destructive hover:text-destructive"
            onClick={() => setDeleting(true)}
          >
            <Trash2 aria-hidden />
            {t('delete')}
          </Button>
          <Button asChild>
            <Link href={`/admin/${section}/${id}/edit`}>
              <Pencil aria-hidden />
              {t('edit')}
            </Link>
          </Button>
        </AdminPageHeader>
      </div>
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-6">
          <Panel title={t('contentDetails')}>
            <Tabs defaultValue={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
              <TabsList aria-label={t('languages')} className="mb-5 h-auto">
                <TabsTrigger value="en" className="min-h-11 px-6">
                  {t('english')}
                </TabsTrigger>
                <TabsTrigger value="ar" className="min-h-11 px-6">
                  {t('arabic')}
                </TabsTrigger>
              </TabsList>
              {(['en', 'ar'] as const).map((language) => (
                <TabsContent value={language} key={language}>
                  {language === 'ar' && (
                    <p className="mb-5 rounded-md bg-secondary p-3 text-sm leading-6 text-muted-foreground">
                      {t('fallback')}
                    </p>
                  )}
                  <dl
                    className="space-y-6"
                    dir={language === 'ar' ? 'rtl' : 'ltr'}
                  >
                    {definition.localized.map((field) => (
                      <div key={field.key}>
                        <dt className="mb-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                          {t(field.label)}
                          {language === 'ar' &&
                            !record.ar[field.key]?.trim() && (
                              <Badge
                                variant="secondary"
                                className="font-normal"
                              >
                                {t('usingEnglish')}
                              </Badge>
                            )}
                        </dt>
                        <dd
                          dir="auto"
                          className="whitespace-pre-wrap break-words leading-8"
                        >
                          {localizedValue(record, field.key, language) || (
                            <span className="text-sm text-muted-foreground">
                              {t('noValue')}
                            </span>
                          )}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </TabsContent>
              ))}
            </Tabs>
          </Panel>
          <Panel title={t('media')} hint={t('previewHint')}>
            <MediaManager
              assets={record.assets}
              coverId={record.coverId}
              readOnly
            />
          </Panel>
        </div>
        <div className="min-w-0 space-y-6">
          <Panel title={t('visibility')}>
            <div className="flex flex-wrap gap-2">
              <StatusBadge published={record.published} />
              {record.featured && (
                <Badge variant="secondary">
                  <Star aria-hidden className="me-1 size-3" />
                  {t('featured')}
                </Badge>
              )}
            </div>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              {t('visibilityHint')}
            </p>
          </Panel>
          <Panel title={t('configuration')}>
            <dl className="space-y-5">
              {[{key: 'slug', label: 'slug'}, ...definition.fields].map(
                (field) => (
                  <div key={field.key}>
                    <dt className="mb-1.5 text-sm text-muted-foreground">
                      {t(field.label)}
                    </dt>
                    <dd
                      className="break-words text-sm leading-6"
                      dir={
                        [
                          'slug',
                          'phone',
                          'landline',
                          'salesPhone',
                          'email',
                          'applicationEmail',
                          'mapUrl',
                        ].includes(field.key)
                          ? 'ltr'
                          : undefined
                      }
                    >
                      {valueLabel(record.values[field.key] || '')}
                    </dd>
                  </div>
                ),
              )}
              <div className="border-t border-border pt-4">
                <dt className="mb-1.5 text-sm text-muted-foreground">
                  {t('updated')}
                </dt>
                <dd className="text-sm leading-6">
                  {new Intl.DateTimeFormat(locale, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                    timeZone: 'Asia/Hebron',
                  }).format(new Date(record.updatedAt))}
                </dd>
              </div>
            </dl>
          </Panel>
        </div>
      </div>
      <DeleteEntryDialog
        record={record}
        open={deleting}
        onOpenChange={setDeleting}
        onDeleted={() => router.push(`/admin/${section}`)}
      />
    </div>
  );
}
