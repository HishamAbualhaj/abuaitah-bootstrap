'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import {Share2} from 'lucide-react';
import {Button} from '@/components/ui/button';

export function ShareButton() {
  const t = useTranslations('common');
  const [status, setStatus] = useState('');
  return <div><Button variant="outline" className="min-h-11 gap-2" onClick={async () => {
    try {await navigator.clipboard.writeText(window.location.href); setStatus(t('copied'));}
    catch {setStatus(t('copyFailed'));}
  }}><Share2 className="size-4" />{t('share')}</Button>{status && <p role="status" className="mt-2 text-sm">{status}</p>}</div>;
}
