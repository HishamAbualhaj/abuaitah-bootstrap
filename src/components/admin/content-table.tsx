'use client';

import {useState} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {Card} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {Switch} from '@/components/ui/switch';
import type {
  ContentLanguage,
  ContentRecord,
  SectionKey,
} from '@/lib/admin/types';
import {localizedValue} from '@/lib/admin/types';
import {useWorkspace} from './workspace-provider';
import {AssetPreview} from './media-manager';
import {DeleteEntryDialog, EmptyState, StatusBadge} from './admin-components';

export function ContentTable({
  section,
  records,
}: {
  section: SectionKey;
  records: ContentRecord[];
}) {
  const t = useTranslations('admin.cms');
  const language = useLocale() as ContentLanguage;
  const {saveRecord, saving} = useWorkspace();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleting, setDeleting] = useState<ContentRecord | null>(null);
  const groupKey =
    section === 'contact'
      ? 'type'
      : section === 'careers'
        ? 'employmentType'
        : 'category';
  const categories = Array.from(
    new Set(records.map((record) => record.values[groupKey]).filter(Boolean)),
  ).sort();
  const filtered = records
    .filter((record) => {
      const needle = query.trim().toLocaleLowerCase();
      const text = [
        ...Object.values(record.en),
        ...Object.values(record.ar),
        ...Object.values(record.values),
      ]
        .join(' ')
        .toLocaleLowerCase();
      return (
        (!needle || text.includes(needle)) &&
        (status === 'all' ||
          (status === 'featured'
            ? record.featured
            : status === 'published'
              ? record.published
              : !record.published)) &&
        (category === 'all' || record.values[groupKey] === category)
      );
    })
    .sort((a, b) =>
      sort === 'titleAsc'
        ? localizedValue(a, 'title', language).localeCompare(
            localizedValue(b, 'title', language),
            language,
          )
        : sort === 'oldest'
          ? a.updatedAt.localeCompare(b.updatedAt)
          : b.updatedAt.localeCompare(a.updatedAt),
    );
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pages);
  const start = (currentPage - 1) * pageSize;
  const visible = filtered.slice(start, start + pageSize);
  const base = `/admin/${section}`;
  const label = (value: string) => (t.has(value) ? t(value) : value);
  function clearFilters() {
    setQuery('');
    setStatus('all');
    setCategory('all');
    setPage(1);
  }
  async function toggle(
    record: ContentRecord,
    key: 'published' | 'featured',
    checked: boolean,
  ) {
    // Drafts are validated by the editor; the table also guards the required cover.
    try {
      await saveRecord({...record, [key]: checked});
    } catch {
      /* Persistent error is shown by the workspace. */
    }
  }
  return (
    <Card className="min-w-0 overflow-hidden shadow-none">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
        <div className="flex items-center gap-2">
          <h2 className="font-bold">{t('all')}</h2>
          <Badge variant="secondary">{records.length}</Badge>
        </div>
        <span className="text-sm text-muted-foreground">
          {t('previewHint')}
        </span>
      </div>
      <div className="grid gap-3 border-b border-border p-4 sm:grid-cols-2 xl:grid-cols-[minmax(200px,1fr)_170px_180px_180px]">
        <div className="relative">
          <Search
            aria-hidden
            className="absolute start-3 top-3.5 size-4 text-muted-foreground"
          />
          <Input
            type="search"
            aria-label={t('search')}
            placeholder={t('search')}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            className="h-11 ps-9"
          />
        </div>
        <Select
          value={status}
          onValueChange={(value) => {
            setStatus(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="h-11" aria-label={t('status')}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {['all', 'published', 'draft', 'featured'].map((value) => (
              <SelectItem key={value} value={value}>
                {t(value === 'all' ? 'allStatuses' : value)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={category}
          onValueChange={(value) => {
            setCategory(value);
            setPage(1);
          }}
        >
          <SelectTrigger
            className="h-11"
            aria-label={t(groupKey === 'type' ? 'contactType' : groupKey)}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allCategories')}</SelectItem>
            {categories.map((value) => (
              <SelectItem key={value} value={value}>
                {label(value)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={sort}
          onValueChange={(value) => {
            setSort(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="h-11" aria-label={t('sort')}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {['newest', 'oldest', 'titleAsc'].map((value) => (
              <SelectItem key={value} value={value}>
                {t(value)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {visible.length ? (
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[850px] text-start text-sm">
            <caption className="sr-only">
              {t(section)} — {t('all')}
            </caption>
            <thead className="border-b border-border bg-muted/70 text-muted-foreground">
              <tr>
                {[
                  'name',
                  groupKey === 'type' ? 'contactType' : groupKey,
                  'published',
                  'featured',
                  'updated',
                  'actions',
                ].map((key) => (
                  <th
                    key={key}
                    scope="col"
                    className="whitespace-nowrap px-5 py-4 text-start font-medium"
                  >
                    {t(key)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {visible.map((record) => {
                const cover = record.assets.find(
                  (asset) => asset.id === record.coverId,
                );
                const title = localizedValue(record, 'title', language);
                const needsCover =
                  ['products', 'news', 'gallery'].includes(section) && !cover;
                return (
                  <tr
                    key={record.id}
                    className="transition-colors hover:bg-muted/50"
                  >
                    <td className="max-w-sm px-5 py-4">
                      <div className="flex items-center gap-3">
                        {cover ? (
                          <AssetPreview
                            asset={cover}
                            className="size-14 shrink-0 rounded-md border border-border [&_span:last-child]:hidden"
                          />
                        ) : (
                          <div className="flex size-14 shrink-0 items-center justify-center rounded-md border border-border bg-muted">
                            <span className="text-lg font-bold text-primary">
                              {title.slice(0, 1)}
                            </span>
                          </div>
                        )}
                        <div className="min-w-0">
                          <Link
                            href={`${base}/${record.id}`}
                            className="line-clamp-2 font-medium leading-6 hover:text-primary hover:underline"
                          >
                            {title}
                          </Link>
                          <p
                            className="mt-1 truncate text-sm text-muted-foreground"
                            dir="ltr"
                          >
                            {record.values.sku || record.values.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Badge
                        variant="outline"
                        className="whitespace-nowrap font-normal"
                      >
                        {record.values[groupKey]
                          ? label(record.values[groupKey])
                          : t('noValue')}
                      </Badge>
                      {section === 'careers' && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          {label(record.values.status || 'closed')}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col items-start gap-2">
                        <Switch
                          checked={record.published}
                          disabled={saving || (!record.published && needsCover)}
                          aria-label={`${t('published')}: ${title}`}
                          onCheckedChange={(checked) =>
                            toggle(record, 'published', checked)
                          }
                        />
                        <StatusBadge published={record.published} />
                        {!record.published && needsCover && (
                          <Link
                            href={`${base}/${record.id}/edit`}
                            className="max-w-36 text-sm text-primary underline"
                          >
                            {t('coverRequired')}
                          </Link>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Switch
                        checked={record.featured}
                        disabled={saving}
                        aria-label={`${t('featured')}: ${title}`}
                        onCheckedChange={(checked) =>
                          toggle(record, 'featured', checked)
                        }
                      />
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">
                      <time dateTime={record.updatedAt}>
                        {new Intl.DateTimeFormat(language, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          timeZone: 'Asia/Hebron',
                        }).format(new Date(record.updatedAt))}
                      </time>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <Button asChild variant="ghost" size="icon">
                          <Link
                            href={`${base}/${record.id}`}
                            aria-label={`${t('details')}: ${title}`}
                          >
                            <Eye aria-hidden />
                          </Link>
                        </Button>
                        <Button asChild variant="ghost" size="icon">
                          <Link
                            href={`${base}/${record.id}/edit`}
                            aria-label={`${t('edit')}: ${title}`}
                          >
                            <Pencil aria-hidden />
                          </Link>
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          disabled={saving}
                          aria-label={`${t('delete')}: ${title}`}
                          onClick={() => setDeleting(record)}
                        >
                          <Trash2 aria-hidden />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title={t(records.length ? 'noResults' : 'noEntries')}
          description={t(
            records.length ? 'filterDescription' : 'emptyDescription',
          )}
        >
          {records.length ? (
            <Button variant="outline" onClick={clearFilters}>
              {t('clearFilters')}
            </Button>
          ) : (
            <Button asChild>
              <Link href={`${base}/new`}>
                <Plus aria-hidden />
                {t('add')}
              </Link>
            </Button>
          )}
        </EmptyState>
      )}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border px-5 py-4 text-sm">
        <span className="text-muted-foreground" role="status">
          {t('range', {
            start: filtered.length ? start + 1 : 0,
            end: Math.min(start + pageSize, filtered.length),
            total: filtered.length,
          })}
        </span>
        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor="table-page-size" className="text-muted-foreground">
            {t('rowsPerPage')}
          </label>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => {
              setPageSize(Number(value));
              setPage(1);
            }}
          >
            <SelectTrigger id="table-page-size" className="h-11 w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50].map((value) => (
                <SelectItem key={value} value={String(value)}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <nav aria-label={t('pagination')} className="flex items-center gap-2">
            <Button
              size="icon"
              variant="outline"
              aria-label={t('previous')}
              disabled={currentPage === 1}
              onClick={() => setPage(currentPage - 1)}
            >
              <ChevronLeft aria-hidden className="rtl:rotate-180" />
            </Button>
            <span className="min-w-24 text-center text-muted-foreground">
              {t('page', {page: currentPage, total: pages})}
            </span>
            <Button
              size="icon"
              variant="outline"
              aria-label={t('next')}
              disabled={currentPage === pages}
              onClick={() => setPage(currentPage + 1)}
            >
              <ChevronRight aria-hidden className="rtl:rotate-180" />
            </Button>
          </nav>
        </div>
      </div>
      <DeleteEntryDialog
        record={deleting}
        open={!!deleting}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
      />
    </Card>
  );
}
