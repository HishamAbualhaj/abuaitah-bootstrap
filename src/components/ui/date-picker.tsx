'use client';

import {useState} from 'react';
import {useLocale} from 'next-intl';
import {ar, enUS} from 'react-day-picker/locale';
import {CalendarDays} from 'lucide-react';
import {Input} from './input';
import {Button} from './button';
import {Calendar} from './calendar';
import {Popover, PopoverContent, PopoverTrigger} from './popover';
import {cn} from '@/lib/utils';

function parseDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const [year, month, day] = value.split('-').map(Number);
  const result = new Date(year, month - 1, day);
  return result.getFullYear() === year &&
    result.getMonth() === month - 1 &&
    result.getDate() === day
    ? result
    : undefined;
}

export function DatePicker({
  value,
  onValueChange,
  className,
  disabled,
  ...props
}: Omit<
  React.ComponentProps<typeof Input>,
  'type' | 'value' | 'onChange' | 'defaultValue'
> & {value?: string; onValueChange?: (value: string) => void}) {
  const locale = useLocale();
  const arabic = locale === 'ar';
  const [internal, setInternal] = useState('');
  const [open, setOpen] = useState(false);
  const current = value ?? internal;
  const selected = parseDate(current);
  function change(next: string) {
    setInternal(next);
    onValueChange?.(next);
  }
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="relative">
        <Input
          {...props}
          value={current}
          onChange={(event) => change(event.target.value)}
          type="text"
          dir="ltr"
          placeholder="YYYY-MM-DD"
          disabled={disabled}
          className={cn('pe-12', className)}
        />
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={disabled}
            aria-label={arabic ? 'فتح التقويم' : 'Open calendar'}
            className="absolute end-0 top-0 h-full rounded-s-none"
          >
            <CalendarDays aria-hidden />
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent
        align="end"
        dir={arabic ? 'rtl' : 'ltr'}
        aria-label={arabic ? 'اختيار التاريخ' : 'Choose date'}
      >
        <Calendar
          mode="single"
          locale={arabic ? ar : enUS}
          dir={arabic ? 'rtl' : 'ltr'}
          defaultMonth={selected}
          selected={selected}
          autoFocus
          onSelect={(date) => {
            change(
              date
                ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
                : '',
            );
            setOpen(false);
          }}
        />
        <div className="mt-2 flex justify-between border-t border-border pt-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              change('');
              setOpen(false);
            }}
          >
            {arabic ? 'مسح' : 'Clear'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setOpen(false)}
          >
            {arabic ? 'إغلاق' : 'Close'}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
