'use client';

import {useId, useState} from 'react';
import {useTranslations} from 'next-intl';
import {ChevronDown, FileText, Loader2, Trash2} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {Button} from '@/components/ui/button';
import {Switch} from '@/components/ui/switch';
import {Badge} from '@/components/ui/badge';
import {Card, CardContent} from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {useWorkspace} from './workspace-provider';
import type {ContentRecord} from '@/lib/admin/types';
import {cn} from '@/lib/utils';

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-5">
      <div className="min-w-0 flex-1">
        {eyebrow && (
          <p className="mb-2 text-sm font-medium text-primary">{eyebrow}</p>
        )}
        <h1 className="break-words text-3xl font-bold tracking-tight md:text-4xl">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
          {description}
        </p>
      </div>
      {children && (
        <div className="flex flex-wrap items-center gap-2">{children}</div>
      )}
    </div>
  );
}

export function Panel({
  title,
  hint,
  children,
  className,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn('overflow-hidden shadow-none', className)}>
      <div className="border-b border-border px-5 py-5 md:px-6">
        <h2 className="font-bold">{title}</h2>
        {hint && (
          <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
            {hint}
          </p>
        )}
      </div>
      <CardContent className="p-5 md:p-6">{children}</CardContent>
    </Card>
  );
}

export function DisclosurePanel({
  title,
  hint,
  count,
  children,
  defaultOpen = false,
}: {
  title: string;
  hint?: string;
  count?: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <Collapsible
      defaultOpen={defaultOpen}
      className="rounded-md border border-border bg-card"
    >
      <CollapsibleTrigger className="group flex min-h-16 w-full cursor-pointer items-center gap-3 rounded-md p-4 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:px-5">
        <div className="min-w-0 flex-1">
          <span className="font-bold">{title}</span>
          {hint && (
            <span className="mt-1 block text-sm font-normal leading-6 text-muted-foreground">
              {hint}
            </span>
          )}
        </div>
        {count !== undefined && <Badge variant="secondary">{count}</Badge>}
        <ChevronDown
          aria-hidden
          className="size-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180 motion-reduce:transition-none"
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="border-t border-border p-4 md:p-5">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function VisibilitySwitch({
  label,
  hint,
  checked,
  disabled,
  onCheckedChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  disabled?: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  const id = useId();
  return (
    <div className="flex min-h-11 items-center justify-between gap-4">
      <div>
        <label htmlFor={id} className="cursor-pointer text-sm font-medium">
          {label}
        </label>
        {hint && (
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{hint}</p>
        )}
      </div>
      <Switch
        id={id}
        checked={checked}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
      />
    </div>
  );
}

export function StatusBadge({published}: {published: boolean}) {
  const t = useTranslations('admin.cms');
  return (
    <Badge
      variant="secondary"
      className={
        published
          ? 'bg-secondary text-primary'
          : 'bg-muted text-muted-foreground'
      }
    >
      {published ? t('published') : t('draft')}
    </Badge>
  );
}

export function DeleteEntryDialog({
  record,
  open,
  onOpenChange,
  onDeleted,
}: {
  record: ContentRecord | null;
  open: boolean;
  onOpenChange: (value: boolean) => void;
  onDeleted?: () => void;
}) {
  const t = useTranslations('admin.cms');
  const {deleteRecord, saving} = useWorkspace();
  const [failed, setFailed] = useState(false);
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!saving) {
          setFailed(false);
          onOpenChange(value);
        }
      }}
    >
      <DialogContent
        closeLabel={t('close')}
        className="w-[calc(100%-2rem)] rounded-md"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          document.getElementById('delete-cancel')?.focus();
        }}
      >
        <DialogHeader>
          <span className="mb-3 flex size-12 items-center justify-center rounded-md bg-destructive/10 text-destructive">
            <Trash2 aria-hidden className="size-5" />
          </span>
          <DialogTitle>{t('deleteTitle')}</DialogTitle>
          <DialogDescription className="break-words pt-2 leading-6">
            {t('deleteDescription', {name: record?.en.title || ''})}
          </DialogDescription>
        </DialogHeader>
        {failed && (
          <p role="alert" className="text-sm text-destructive">
            {t('storageWriteError')}
          </p>
        )}
        <DialogFooter className="gap-2">
          <Button
            id="delete-cancel"
            variant="outline"
            disabled={saving}
            onClick={() => onOpenChange(false)}
          >
            {t('cancel')}
          </Button>
          <Button
            variant="destructive"
            disabled={saving}
            onClick={async () => {
              if (!record) return;
              try {
                await deleteRecord(record.id);
                onOpenChange(false);
                onDeleted?.();
              } catch {
                setFailed(true);
              }
            }}
          >
            {saving ? (
              <Loader2 aria-hidden className="animate-spin" />
            ) : (
              <Trash2 aria-hidden />
            )}
            {t('deleteConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function MissingEntry({href}: {href: string}) {
  const t = useTranslations('admin.cms');
  return (
    <Panel title={t('notFound')} hint={t('notFoundText')}>
      <Button asChild variant="outline">
        <Link href={href}>{t('back')}</Link>
      </Button>
    </Panel>
  );
}

export function EmptyState({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center px-5 py-16 text-center">
      <div className="mb-4 rounded-md bg-muted p-4">
        <FileText aria-hidden className="size-7 text-muted-foreground" />
      </div>
      <p className="font-bold">{title}</p>
      <p className="mb-5 mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
        {description}
      </p>
      {children}
    </div>
  );
}
