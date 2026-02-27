'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/app/ui/lib/utils';

interface SportButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const SportButton = forwardRef<HTMLButtonElement, SportButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed',
          {
            'gradient-primary text-primary-foreground shadow-glow hover:opacity-90 active:scale-[0.98]':
              variant === 'primary',
            'bg-secondary text-secondary-foreground hover:bg-muted border border-border':
              variant === 'secondary',
            'bg-transparent text-foreground hover:bg-muted':
              variant === 'ghost',
          },
          {
            'px-4 py-2 text-sm': size === 'sm',
            'px-6 py-3 text-base': size === 'md',
            'px-8 py-4 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

SportButton.displayName = 'SportButton';

export { SportButton };
