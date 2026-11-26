'use client';

import {DayPicker} from 'react-day-picker';
import {cn} from '@/lib/utils';

export function Calendar({
  className,
  classNames,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays
      className={cn('calendar p-1', className)}
      classNames={{
        root: 'relative w-fit',
        months: 'relative flex flex-col',
        month: 'space-y-3',
        month_caption: 'flex h-11 items-center justify-center gap-2 px-11',
        caption_label: 'text-sm font-medium',
        nav: 'absolute inset-x-0 top-0 flex justify-between',
        button_previous:
          'inline-flex size-10 items-center justify-center rounded-md border border-border hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 disabled:opacity-40',
        button_next:
          'inline-flex size-10 items-center justify-center rounded-md border border-border hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 disabled:opacity-40',
        chevron: 'size-4 fill-current rtl:rotate-180',
        month_grid: 'border-collapse',
        weekdays: 'flex',
        weekday:
          'w-9 py-2 text-center text-sm font-normal text-muted-foreground',
        week: 'flex',
        day: 'relative size-9 p-0 text-center text-sm',
        day_button:
          'inline-flex size-9 cursor-pointer items-center justify-center rounded-md hover:bg-accent focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30',
        selected:
          '[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary/90',
        today:
          '[&:not([data-selected])>button]:bg-secondary [&:not([data-selected])>button]:text-primary',
        outside: 'text-muted-foreground/60',
        disabled: 'opacity-40',
        hidden: 'invisible',
        ...classNames,
      }}
      {...props}
    />
  );
}
