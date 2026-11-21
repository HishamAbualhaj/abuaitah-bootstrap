'use client';

import Image from 'next/image';
import {useLocale, useTranslations} from 'next-intl';
import {useState, type FormEvent} from 'react';
import {Eye, EyeOff, LockKeyhole, ShieldCheck} from 'lucide-react';
import {images} from '@/assets';
import {Link, useRouter} from '@/i18n/navigation';
import {demoAdmin, demoSessionKey} from '@/lib/admin-demo';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Card, CardContent, CardHeader, CardTitle, CardDescription} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';

export function AdminLogin() {
  const t = useTranslations('admin');
  const c = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError('');
    if (email.trim().toLowerCase() !== demoAdmin.email || password !== demoAdmin.password) {setError(t('invalid')); return;}
    try {sessionStorage.setItem(demoSessionKey, 'active');}
    catch {setError(t('storageError')); return;}
    setBusy(true); router.replace('/admin');
  }
  return <main id="main" className="grid min-h-dvh lg:grid-cols-[0.9fr_1.1fr]">
    <section className="relative hidden flex-col justify-between overflow-hidden bg-brand-navy p-12 text-white lg:flex xl:p-16">
      <div className="absolute -end-36 -top-36 size-[550px] rounded-full border-[80px] border-white/5" />
      <Link href="/" className="relative w-fit"><Image src={images.mainLogo.png} alt={t('back')} width={88} height={88} className="rounded-full bg-white p-1" /></Link>
      <div className="relative my-16 max-w-lg"><ShieldCheck className="mb-8 size-12 text-brand-gold" /><h2 className="text-4xl font-bold leading-snug xl:text-5xl">{t('brandLine')}</h2><p className="mt-6 text-lg leading-8 text-white/80">{t('brandText')}</p></div>
      <p className="relative text-sm text-white/70">{t('panel')} · {c('brand')}</p>
    </section>
    <section className="flex flex-col px-5 py-6 md:px-12">
      <div className="flex items-center justify-between gap-3"><Button asChild variant="ghost"><Link href="/">{t('back')}</Link></Button><Button asChild variant="outline"><Link href="/admin/login" locale={locale === 'ar' ? 'en' : 'ar'}>{t('language')}</Link></Button></div>
      <div className="mx-auto my-auto w-full max-w-md py-10"><Badge variant="secondary" className="mb-6">{t('demo')}</Badge>
        <Card className="shadow-none"><CardHeader><div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-secondary text-primary"><LockKeyhole /></div><CardTitle className="text-3xl"><h1>{t('login')}</h1></CardTitle><CardDescription className="leading-7">{t('loginText')}</CardDescription></CardHeader><CardContent>
          <form onSubmit={submit} className="space-y-5" aria-describedby="demo-notice">
            <div className="space-y-2"><Label htmlFor="admin-email">{t('email')}</Label><Input id="admin-email" name="email" type="email" autoComplete="username" dir="ltr" required value={email} onChange={e => setEmail(e.target.value)} className="min-h-12" /></div>
            <div className="space-y-2"><Label htmlFor="admin-password">{t('password')}</Label><div className="relative"><Input id="admin-password" name="password" autoComplete="current-password" type={visible ? 'text' : 'password'} dir="ltr" required value={password} onChange={e => setPassword(e.target.value)} className="min-h-12 pe-14" /><Button type="button" variant="ghost" size="icon" className="absolute end-1 top-1" onClick={() => setVisible(!visible)} aria-label={t(visible ? 'hide' : 'show')} aria-pressed={visible}>{visible ? <EyeOff /> : <Eye />}</Button></div></div>
            {error && <p role="alert" className="text-sm leading-6 text-destructive">{error}</p>}
            <Button type="submit" disabled={busy} className="min-h-12 w-full">{t(busy ? 'signingIn' : 'signIn')}</Button>
          </form>
        </CardContent></Card>
        <Card className="mt-5 border-dashed bg-secondary/60 shadow-none"><CardHeader><CardTitle className="text-base">{t('credentials')}</CardTitle><CardDescription className="leading-6">{t('credentialsText')}</CardDescription></CardHeader><CardContent><dl className="space-y-3 text-sm"><div><dt className="mb-1 text-muted-foreground">{t('email')}</dt><dd dir="ltr" className="break-all font-mono">{demoAdmin.email}</dd></div><div><dt className="mb-1 text-muted-foreground">{t('password')}</dt><dd dir="ltr" className="font-mono">{demoAdmin.password}</dd></div></dl><Button variant="outline" className="mt-5 w-full" onClick={() => {setEmail(demoAdmin.email); setPassword(demoAdmin.password); setError('');}}>{t('fill')}</Button></CardContent></Card>
        <p id="demo-notice" className="mt-5 text-sm leading-6 text-muted-foreground">{t('notice')}</p>
      </div>
    </section>
  </main>;
}
