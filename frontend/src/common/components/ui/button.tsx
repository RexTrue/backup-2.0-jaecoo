import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/common/utils/cn';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
};

export function Button({ className, variant = 'primary', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex min-h-11 items-center justify-center rounded-2xl border px-4 py-2.5 text-sm font-medium transition duration-300 ease-out disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
        variant === 'primary' &&
          'border-transparent bg-[linear-gradient(135deg,var(--accent-strong),var(--accent))] text-[#0f1726] shadow-[0_16px_44px_rgba(197,167,109,0.3)] hover:-translate-y-0.5 hover:brightness-105',
        variant === 'secondary' &&
          'theme-line bg-[color:var(--panel-light)] text-[color:var(--text)] hover:bg-[color:var(--panel-strong)]',
        variant === 'ghost' && 'border-transparent bg-transparent theme-text hover:bg-[color:var(--panel-light)] hover:text-[color:var(--text)]',
        variant === 'danger' &&
          'border-red-300/20 bg-red-500/85 text-white hover:-translate-y-0.5 hover:bg-red-500',
        className,
      )}
      {...props}
    />
  );
}
