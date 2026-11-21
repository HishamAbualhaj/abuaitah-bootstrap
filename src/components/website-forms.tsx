'use client';

import {useId, useState, type FormEvent} from 'react';
import {useTranslations} from 'next-intl';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';

export function NewsletterForm() {
  const t = useTranslations('common');
  const id = useId();
  const [checked, setChecked] = useState(false);
  return <form onSubmit={e => {e.preventDefault(); setChecked(true);}} className="space-y-3">
    <Label htmlFor={id}>{t('email')}</Label>
    <div className="flex flex-col gap-2 sm:flex-row"><Input id={id} name="email" type="email" required autoComplete="email" dir="ltr" className="min-h-12 bg-white text-foreground" aria-describedby={`${id}-notice`} /><Button type="submit" className="min-h-12 shrink-0">{t('subscribe')}</Button></div>
    <p id={`${id}-notice`} className="text-sm leading-6 text-white/80">{t('formNotice')}</p>
    {checked && <p role="status" className="rounded-md bg-white/10 p-3 text-sm leading-6">{t('previewFeedback')}</p>}
  </form>;
}

function FormField({label, name, type = 'text', required = true, autoComplete}: {label: string; name: string; type?: string; required?: boolean; autoComplete?: string}) {
  return <div className="space-y-2"><Label htmlFor={name}>{label}{required && <span aria-hidden="true"> *</span>}</Label><Input id={name} name={name} type={type} required={required} autoComplete={autoComplete} className="min-h-12" /></div>;
}

function ChoiceField({label, name, options}: {label: string; name: string; options: {value: string; label: string}[]}) {
  return <div className="space-y-2"><Label htmlFor={name}>{label} *</Label><Select name={name} required defaultValue={options[0].value}><SelectTrigger id={name} className="min-h-12"><SelectValue /></SelectTrigger><SelectContent>{options.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent></Select></div>;
}

export function ContactForm() {
  const t = useTranslations('common');
  const p = useTranslations('pages.contact');
  const [checked, setChecked] = useState(false);
  function submit(e: FormEvent<HTMLFormElement>) {e.preventDefault(); setChecked(true);}
  return <form onSubmit={submit} className="space-y-6">
    <p className="rounded-md bg-secondary p-4 text-sm leading-6" id="contact-notice">{t('formNotice')}</p>
    <ChoiceField label={p('messageType')} name="messageType" options={['general', 'products', 'distribution', 'feedback'].map(value => ({value, label: p(value)}))} />
    <FormField label={t('name')} name="name" autoComplete="name" />
    <div className="grid gap-6 sm:grid-cols-2"><FormField label={t('email')} name="email" type="email" autoComplete="email" /><FormField label={t('phone')} name="phone" type="tel" autoComplete="tel" /></div>
    <div className="space-y-2"><Label htmlFor="message">{p('message')} *</Label><Textarea id="message" name="message" required minLength={10} rows={6} className="resize-y" /></div>
    <Button type="submit" size="lg" aria-describedby="contact-notice">{t('send')}</Button>
    {checked && <p role="status" className="rounded-md border border-primary/20 bg-secondary p-4 leading-7">{t('previewFeedback')}</p>}
  </form>;
}

export function ApplicationForm() {
  const t = useTranslations('common');
  const p = useTranslations('pages.jobs');
  const [fileError, setFileError] = useState(false);
  return <form className="space-y-7" onSubmit={e => e.preventDefault()}>
    <p className="rounded-lg border border-brand-gold bg-brand-gold/10 p-5 leading-7">{p('applicationNotice')}</p>
    <div className="grid gap-6 md:grid-cols-2">
      <FormField label={t('name')} name="name" autoComplete="name" />
      <FormField label={t('email')} name="email" type="email" autoComplete="email" />
      <FormField label={t('phone')} name="phone" type="tel" autoComplete="tel" />
      <ChoiceField label={p('marital')} name="marital" options={['single', 'married', 'divorced', 'widowed'].map(value => ({value, label: p(value)}))} />
      <ChoiceField label={p('gender')} name="gender" options={['male', 'female'].map(value => ({value, label: p(value)}))} />
      <FormField label={p('address')} name="address" autoComplete="street-address" />
      <FormField label={p('birth')} name="birth" type="date" autoComplete="bday" />
      <ChoiceField label={p('education')} name="education" options={['bachelor', 'student', 'master', 'doctorate'].map(value => ({value, label: p(value)}))} />
      {['cv', 'experience', 'degree', 'license'].map(name => <div key={name} className="space-y-3 rounded-lg border border-dashed border-border p-5">
        <Label htmlFor={name}>{p(name)}</Label><Input id={name} name={name} type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" className="h-auto min-h-12 cursor-pointer py-3 file:me-3" aria-describedby={`${name}-help`} onChange={e => {
          const file = e.target.files?.[0];
          if (file && (file.size > 5 * 1024 * 1024 || !/\.(pdf|docx?|jpe?g|png)$/i.test(file.name))) {e.target.value = ''; setFileError(true);} else {setFileError(false);}
        }} /><p id={`${name}-help`} className="text-sm leading-6 text-muted-foreground">{p('upload')}</p>
      </div>)}
    </div>
    {fileError && <p role="alert" className="text-destructive">{p('fileError')}</p>}
    <Button disabled size="lg">{p('closed')}</Button>
  </form>;
}
