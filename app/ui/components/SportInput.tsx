'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/app/ui/lib/utils';

interface SportInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const SportInput = forwardRef<HTMLInputElement, SportInputProps>(
  ({ className, label, error, id, ...props }, ref) => {
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
        <input
          ref={ref}
          id={id}
          className={cn(
            'w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            'hover:border-muted-foreground/50',
            error && 'border-destructive focus:ring-destructive',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

SportInput.displayName = 'SportInput';

export { SportInput };
