'use client';

import { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/app/ui/lib/utils';

interface Option {
  value: string;
  label: string;
}

interface SportSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Option[];
}

const SportSelect = forwardRef<HTMLSelectElement, SportSelectProps>(
  ({ className, label, error, id, options, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-foreground"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={cn(
            'w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground transition-all duration-200 appearance-none cursor-pointer',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            'hover:border-muted-foreground/50',
            error && 'border-destructive focus:ring-destructive',
            className
          )}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 12px center',
            backgroundSize: '20px',
          }}
          {...props}
        >
          <option value="" className="bg-card">Selecione...</option>
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-card">
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

SportSelect.displayName = 'SportSelect';

export { SportSelect };
