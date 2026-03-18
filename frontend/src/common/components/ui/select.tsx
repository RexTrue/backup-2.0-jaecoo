import { SelectHTMLAttributes } from 'react';
import { cn } from '@/common/utils/cn';

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'w-full rounded-2xl border px-4 py-3 text-sm outline-none transition duration-200 focus:border-[color:var(--accent)] focus:bg-[color:var(--panel-strong)]/70',
        'border-[color:var(--line)] bg-[color:var(--panel-light)] text-[color:var(--text)]',
        className,
      )}
      {...props}
    />
  );
}
