'use client';

import {useEffect, useRef, useState} from 'react';
import {
  Formik,
  Form,
  getIn,
  useField,
  useFormikContext,
  type FormikErrors,
} from 'formik';
import * as Yup from 'yup';
import {useLocale, useTranslations} from 'next-intl';
import {Check, Languages, Loader2, Save} from 'lucide-react';
import {useRouter} from '@/i18n/navigation';
import {sectionDefinitions, newRecord} from '@/lib/admin/config';
import type {
  ContentRecord,
  FieldDefinition,
  PageSettings,
  SectionKey,
} from '@/lib/admin/types';
import {Input} from '@/components/ui/input';
import {DatePicker} from '@/components/ui/date-picker';
import {Textarea} from '@/components/ui/textarea';
import {Label} from '@/components/ui/label';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AdminPageHeader,
  MissingEntry,
  Panel,
  VisibilitySwitch,
} from './admin-components';
import {MediaManager} from './media-manager';
import {useWorkspace} from './workspace-provider';

type EditorValues = ContentRecord;
const pageFields: FieldDefinition[] = [
  {key: 'title', label: 'title', required: true},
  {key: 'subtitle', label: 'subtitle', required: true, type: 'textarea'},
];
const contactPageFields: FieldDefinition[] = [
  ...pageFields,
  {key: 'formHeading', label: 'formHeading', required: true},
  {
    key: 'messageTypes',
    label: 'messageTypes',
    required: true,
    type: 'textarea',
  },
];
const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

function EditorField({
  field,
  path,
  fallback,
  onTitleChange,
}: {
  field: FieldDefinition;
  path: string;
  fallback?: string;
  onTitleChange?: (value: string) => void;
}) {
  const t = useTranslations('admin.cms');
  const [input, meta, helpers] = useField<string>(path);
  const hasError = meta.touched && !!meta.error;
  const id = `field-${path.replaceAll('.', '-')}`;
  const isArabic = path.startsWith('ar.');
  const isEnglish = path.startsWith('en.');
  const label = t(field.label);
  const controlProps = {
    id,
    'aria-required': !!field.required && !isArabic,
    'aria-invalid': hasError || undefined,
    'aria-describedby': hasError
      ? `${id}-error`
      : fallback !== undefined
        ? `${id}-hint`
        : undefined,
  };
  return (
    <div
      className={
        field.type === 'textarea' ? 'space-y-2 sm:col-span-2' : 'space-y-2'
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Label
          htmlFor={id}
          className={
            hasError
              ? 'text-sm leading-6 text-destructive'
              : 'text-sm leading-6'
          }
        >
          {label}
          {field.required && !isArabic && (
            <span aria-hidden className="ms-1 text-destructive">
              *
            </span>
          )}
        </Label>
        {isArabic && !input.value?.trim() && (
          <Badge variant="secondary" className="text-sm font-normal">
            {t('usingEnglish')}
          </Badge>
        )}
      </div>
      {field.type === 'select' ? (
        <Select
          value={input.value || ''}
          onValueChange={(value) => helpers.setValue(value)}
          onOpenChange={(open) => {
            if (!open) helpers.setTouched(true);
          }}
        >
          <SelectTrigger {...controlProps} className="h-11">
            <SelectValue placeholder={t('selectOption')} />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((option) => (
              <SelectItem key={option} value={option}>
                {t.has(option) ? t(option) : option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : field.type === 'date' ? (
        <DatePicker
          {...controlProps}
          name={input.name}
          value={input.value || ''}
          onValueChange={(value) => helpers.setValue(value)}
          onBlur={input.onBlur}
          className="h-11"
        />
      ) : field.type === 'textarea' ? (
        <Textarea
          {...input}
          {...controlProps}
          dir={isArabic ? 'rtl' : isEnglish ? 'ltr' : undefined}
          value={input.value || ''}
          rows={field.key === 'body' ? 10 : 4}
          className="min-h-28 leading-7"
          placeholder={isArabic ? fallback : undefined}
        />
      ) : (
        <Input
          {...input}
          {...controlProps}
          type={field.type || 'text'}
          dir={
            isArabic
              ? 'rtl'
              : isEnglish ||
                  ['email', 'url', 'tel', 'date'].includes(field.type || '') ||
                  field.key === 'slug'
                ? 'ltr'
                : undefined
          }
          value={input.value || ''}
          className="h-11"
          list={field.options ? `${id}-options` : undefined}
          placeholder={isArabic ? fallback : undefined}
          onChange={(event) => {
            helpers.setValue(event.target.value);
            onTitleChange?.(event.target.value);
          }}
        />
      )}
      {field.options && field.type !== 'select' && (
        <datalist id={`${id}-options`}>
          {field.options.map((value) => (
            <option key={value} value={value}>
              {t.has(value) ? t(value) : value}
            </option>
          ))}
        </datalist>
      )}
      {fallback !== undefined && !hasError && (
        <p
          id={`${id}-hint`}
          className="text-sm leading-6 text-muted-foreground"
        >
          {t('fallback')}
        </p>
      )}
      {hasError && (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {meta.error}
        </p>
      )}
    </div>
  );
}

function flattenErrors(
  errors: FormikErrors<EditorValues>,
  prefix = '',
): {path: string; message: string}[] {
  return Object.entries(errors).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'string') return [{path, message: value}];
    return value && typeof value === 'object'
      ? flattenErrors(value as FormikErrors<EditorValues>, path)
      : [];
  });
}

function EditorBody({
  section,
  fields,
  isPage,
  isNew,
}: {
  section: SectionKey;
  fields: FieldDefinition[];
  isPage: boolean;
  isNew: boolean;
}) {
  const t = useTranslations('admin.cms');
  const locale = useLocale();
  const router = useRouter();
  const form = useFormikContext<EditorValues>();
  const {saving} = useWorkspace();
  const [language, setLanguage] = useState('en');
  const [discard, setDiscard] = useState(false);
  const summary = useRef<HTMLDivElement>(null);
  const previousSubmit = useRef(0);
  const issues = flattenErrors(form.errors);
  useEffect(() => {
    if (
      form.submitCount > previousSubmit.current &&
      !form.isValidating &&
      !form.isSubmitting
    ) {
      previousSubmit.current = form.submitCount;
      if (Object.keys(form.errors).length) summary.current?.focus();
    }
  }, [form.submitCount, form.isValidating, form.isSubmitting, form.errors]);
  useEffect(() => {
    if (!form.dirty || form.isSubmitting) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [form.dirty, form.isSubmitting]);
  function cancel() {
    if (form.dirty) setDiscard(true);
    else router.push(`/admin/${section}`);
  }
  function focusField(path: string) {
    if (path.startsWith('en.') || path.startsWith('ar.'))
      setLanguage(path.split('.')[0]);
    requestAnimationFrame(() =>
      document
        .getElementById(
          path === 'coverId'
            ? 'media-editor'
            : `field-${path.replaceAll('.', '-')}`,
        )
        ?.focus(),
    );
  }
  function titleChanged(title: string) {
    if (
      !form.values.values.slug ||
      form.values.values.slug === slugify(form.values.en.title || '')
    )
      form.setFieldValue('values.slug', slugify(title));
  }
  const disabled = form.isSubmitting || saving;
  return (
    <Form noValidate className="space-y-6">
      {form.submitCount > 0 && issues.length > 0 && (
        <div
          ref={summary}
          tabIndex={-1}
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/5 p-5 focus:outline-none focus:ring-2 focus:ring-destructive"
        >
          <p className="font-bold text-destructive">{t('validationTitle')}</p>
          <ul className="mt-2 space-y-1">
            {issues.map((issue) => (
              <li key={issue.path}>
                <button
                  type="button"
                  className="cursor-pointer text-start text-sm text-destructive underline underline-offset-4"
                  onClick={() => focusField(issue.path)}
                >
                  {issue.path === 'coverId'
                    ? t('cover')
                    : issue.path.startsWith('en.')
                      ? `${t('english')} · ${t(fields.find((field) => field.key === issue.path.split('.')[1])?.label || 'title')}`
                      : t(
                          issue.path === 'values.slug'
                            ? 'slug'
                            : sectionDefinitions[section].fields.find(
                                (field) =>
                                  field.key === issue.path.split('.')[1],
                              )?.label || 'configuration',
                        )}
                  : {issue.message}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {form.status && (
        <p
          role="alert"
          className="rounded-md border border-destructive/25 bg-destructive/5 p-4 text-sm text-destructive"
        >
          {form.status}
        </p>
      )}
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-6">
          <Panel title={t('contentDetails')} hint={t('contentDetailsHint')}>
            <Tabs
              value={language}
              onValueChange={setLanguage}
              dir={locale === 'ar' ? 'rtl' : 'ltr'}
            >
              <TabsList
                aria-label={t('languages')}
                className="mb-5 grid h-auto w-full grid-cols-2 p-1"
              >
                <TabsTrigger value="en" className="min-h-11 gap-2">
                  <Languages aria-hidden className="size-4" />
                  {t('english')}
                  <span className="hidden text-sm text-muted-foreground sm:inline">
                    {t('requiredLanguage')}
                  </span>
                  {getIn(form.errors, 'en') && form.submitCount > 0 && (
                    <span
                      aria-hidden
                      className="size-2 rounded-md bg-destructive"
                    />
                  )}
                </TabsTrigger>
                <TabsTrigger value="ar" className="min-h-11 gap-2">
                  {t('arabic')}
                  <span className="hidden text-sm text-muted-foreground sm:inline">
                    {t('optionalLanguage')}
                  </span>
                </TabsTrigger>
              </TabsList>
              {(['en', 'ar'] as const).map((lang) => (
                <TabsContent key={lang} value={lang}>
                  <div className="grid gap-5 sm:grid-cols-2">
                    {fields.map((field) => (
                      <EditorField
                        key={field.key}
                        field={field}
                        path={`${lang}.${field.key}`}
                        fallback={
                          lang === 'ar'
                            ? form.values.en[field.key] || ''
                            : undefined
                        }
                        onTitleChange={
                          !isPage &&
                          isNew &&
                          lang === 'en' &&
                          field.key === 'title'
                            ? titleChanged
                            : undefined
                        }
                      />
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </Panel>
          <Panel title={t('media')} hint={t('mediaHint')}>
            <div
              id="media-editor"
              tabIndex={-1}
              className="rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <MediaManager
                assets={form.values.assets}
                coverId={form.values.coverId}
                onChange={(assets, coverId) =>
                  form.setValues((values) => ({...values, assets, coverId}))
                }
              />
            </div>
            {form.touched.coverId && form.errors.coverId && (
              <p className="mt-3 text-sm text-destructive">
                {form.errors.coverId}
              </p>
            )}
          </Panel>
        </div>
        <div className="min-w-0 space-y-6">
          {!isPage && (
            <>
              <Panel title={t('visibility')} hint={t('visibilityHint')}>
                <div className="space-y-5 divide-y divide-border">
                  <VisibilitySwitch
                    label={t('published')}
                    hint={t('publishedHint')}
                    checked={form.values.published}
                    disabled={disabled}
                    onCheckedChange={(checked) =>
                      form.setFieldValue('published', checked)
                    }
                  />
                  <div className="pt-5">
                    <VisibilitySwitch
                      label={t('featured')}
                      hint={t('featuredHint')}
                      checked={form.values.featured}
                      disabled={disabled}
                      onCheckedChange={(checked) =>
                        form.setFieldValue('featured', checked)
                      }
                    />
                  </div>
                </div>
              </Panel>
              <Panel title={t('configuration')} hint={t('configurationHint')}>
                <div className="grid gap-5">
                  <EditorField
                    field={{key: 'slug', label: 'slug', required: true}}
                    path="values.slug"
                  />
                  <p className="-mt-3 text-sm leading-6 text-muted-foreground">
                    {t('slugHint')}
                  </p>
                  {sectionDefinitions[section].fields.map((field) => (
                    <EditorField
                      key={field.key}
                      field={field}
                      path={`values.${field.key}`}
                    />
                  ))}
                </div>
              </Panel>
            </>
          )}
          <div className="rounded-md border border-primary/15 bg-secondary p-5">
            <Languages aria-hidden className="mb-3 size-5 text-primary" />
            <p className="text-sm font-bold">{t('languagesHint')}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {t('fallback')}
            </p>
          </div>
          {isPage && section === 'contact' && (
            <p className="px-1 text-sm leading-6 text-muted-foreground">
              {t('messageTypesHint')}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-md border border-border bg-card p-4 md:px-6">
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Check aria-hidden className="size-4 text-primary" />
          {t('local')}
        </p>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            onClick={cancel}
          >
            {t('cancel')}
          </Button>
          <Button type="submit" disabled={disabled}>
            {disabled ? (
              <Loader2 aria-hidden className="animate-spin" />
            ) : (
              <Save aria-hidden />
            )}
            {t(disabled ? 'saving' : isNew && !isPage ? 'create' : 'save')}
          </Button>
        </div>
      </div>
      <Dialog open={discard} onOpenChange={setDiscard}>
        <DialogContent
          closeLabel={t('close')}
          className="w-[calc(100%-2rem)] rounded-md"
        >
          <DialogHeader>
            <DialogTitle>{t('discardTitle')}</DialogTitle>
            <DialogDescription className="pt-2 leading-6">
              {t('discardDescription')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDiscard(false)}
            >
              {t('cancel')}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => router.push(`/admin/${section}`)}
            >
              {t('discard')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Form>
  );
}

export function ContentForm({
  section,
  id,
  pageSettings = false,
}: {
  section: SectionKey;
  id?: string;
  pageSettings?: boolean;
}) {
  const t = useTranslations('admin.cms');
  const {workspace, saveRecord, savePage} = useWorkspace();
  const router = useRouter();
  const record = id
    ? workspace.records.find(
        (item) => item.id === id && item.section === section,
      )
    : undefined;
  if (id && !record) return <MissingEntry href={`/admin/${section}`} />;
  const fields = pageSettings
    ? section === 'contact'
      ? contactPageFields
      : pageFields
    : sectionDefinitions[section].localized;
  const settings = workspace.pages[section];
  const initial: EditorValues = pageSettings
    ? {...newRecord(section), ...settings}
    : record
      ? {...record}
      : newRecord(section);
  // Fill optional keys for controlled inputs and Formik touched state.
  initial.en = {
    ...Object.fromEntries(fields.map((field) => [field.key, ''])),
    ...initial.en,
  };
  initial.ar = {
    ...Object.fromEntries(fields.map((field) => [field.key, ''])),
    ...initial.ar,
  };
  const strings = Object.fromEntries(
    fields.map((field) => [
      field.key,
      field.required
        ? Yup.string().trim().required(t('required'))
        : Yup.string(),
    ]),
  );
  const valueRules: Record<string, Yup.AnySchema> = {};
  if (!pageSettings) {
    valueRules.slug = Yup.string()
      .trim()
      .required(t('required'))
      .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, t('invalidSlug'))
      .test(
        'unique',
        t('duplicateSlug'),
        (value) =>
          !workspace.records.some(
            (item) =>
              item.section === section &&
              item.id !== id &&
              item.values.slug === value,
          ),
      );
    for (const field of sectionDefinitions[section].fields) {
      let rule = Yup.string().trim();
      if (field.required) rule = rule.required(t('required'));
      if (field.type === 'email') rule = rule.email(t('invalidEmail'));
      if (field.type === 'url')
        rule = rule.test('url', t('invalidUrl'), (value) => {
          if (!value) return true;
          try {
            return ['http:', 'https:'].includes(new URL(value).protocol);
          } catch {
            return false;
          }
        });
      if (field.type === 'tel')
        rule = rule.test(
          'phone',
          t('invalidPhone'),
          (value) => !value || /^[+\d\s().-]{6,30}$/.test(value),
        );
      if (field.type === 'select')
        rule = rule.oneOf(['', ...(field.options || [])], t('selectOption'));
      if (field.type === 'date')
        rule = rule.test(
          'date',
          t('invalidDate'),
          (value) =>
            !value ||
            (/^\d{4}-\d{2}-\d{2}$/.test(value) &&
              !Number.isNaN(Date.parse(value)) &&
              new Date(value).toISOString().slice(0, 10) === value),
        );
      if (field.key === 'deadline')
        rule = rule.test('deadline', t('deadlineError'), function (value) {
          return !value || !this.parent.date || value >= this.parent.date;
        });
      valueRules[field.key] = rule;
    }
  }
  const schema = Yup.object({
    en: Yup.object(strings),
    values: Yup.object(valueRules),
    coverId: Yup.string().test('cover', t('coverRequired'), function (value) {
      return (
        pageSettings ||
        !this.parent.published ||
        !['products', 'news', 'gallery'].includes(section) ||
        this.parent.assets.some(
          (asset: {id: string; type: string}) =>
            asset.id === value && asset.type === 'image',
        )
      );
    }),
  });
  return (
    <div className="space-y-7">
      <AdminPageHeader
        eyebrow={t(section)}
        title={pageSettings ? t('settings') : t(id ? 'editTitle' : 'addTitle')}
        description={t(
          pageSettings ? 'pageSettingsDescription' : 'editorDescription',
        )}
      />
      <Formik<EditorValues>
        key={`${section}-${id || (pageSettings ? 'settings' : 'new')}`}
        initialValues={initial}
        validationSchema={schema}
        onSubmit={async (values, helpers) => {
          helpers.setStatus(undefined);
          try {
            const trim = (data: Record<string, string>) =>
              Object.fromEntries(
                Object.entries(data).map(([key, value]) => [key, value.trim()]),
              );
            if (pageSettings) {
              const next: PageSettings = {
                en: trim(values.en),
                ar: trim(values.ar),
                assets: values.assets,
                coverId: values.coverId,
              };
              await savePage(section, next);
              helpers.resetForm({values});
              router.push(`/admin/${section}`);
            } else {
              const next = {
                ...values,
                id: id || crypto.randomUUID(),
                en: trim(values.en),
                ar: trim(values.ar),
                values: trim(values.values),
              };
              await saveRecord(next);
              helpers.resetForm({values: next});
              router.push(`/admin/${section}/${next.id}`);
            }
          } catch {
            helpers.setStatus(t('storageWriteError'));
          }
        }}
      >
        <EditorBody
          section={section}
          fields={fields}
          isPage={pageSettings}
          isNew={!id}
        />
      </Formik>
    </div>
  );
}
