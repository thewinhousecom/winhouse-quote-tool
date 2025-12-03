// ============================================
// BADGE COMPONENT
// ============================================

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default:
          'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        secondary:
          'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
        destructive:
          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        success:
          'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
        warning:
          'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        outline:
          'border border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300',
        premium:
          'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 dark:from-amber-900/30 dark:to-yellow-900/30 dark:text-amber-400',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

// ============================================
// CHECKBOX COMPONENT
// ============================================

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const checkboxId = id || React.useId();
    
    return (
      <div className="flex items-start gap-3">
        <div className="relative flex items-center">
          <input
            type="checkbox"
            id={checkboxId}
            ref={ref}
            className={cn(
              'peer h-5 w-5 shrink-0 rounded-md border-2 appearance-none cursor-pointer transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500/20',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error
                ? 'border-red-300 dark:border-red-600'
                : 'border-slate-300 dark:border-slate-600',
              'checked:bg-blue-600 checked:border-blue-600',
              'dark:checked:bg-blue-500 dark:checked:border-blue-500',
              className
            )}
            {...props}
          />
          {/* Checkmark icon */}
          <svg
            className="absolute left-0.5 top-0.5 h-4 w-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        {label && (
          <label
            htmlFor={checkboxId}
            className={cn(
              'text-sm cursor-pointer select-none',
              error ? 'text-red-600 dark:text-red-400' : 'text-slate-600 dark:text-slate-400'
            )}
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };

// ============================================
// RADIO GROUP COMPONENT
// ============================================

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

export interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  className?: string;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  value,
  onChange,
  error,
  className,
}) => {
  return (
    <div className={cn('space-y-3', className)}>
      {options.map((option) => (
        <label
          key={option.value}
          className={cn(
            'flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200',
            'hover:border-blue-300 hover:bg-blue-50/50',
            'dark:hover:border-blue-600 dark:hover:bg-blue-900/10',
            value === option.value
              ? 'border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/20'
              : 'border-slate-200 dark:border-slate-700'
          )}
        >
          <div className="relative flex items-center">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange?.(option.value)}
              className={cn(
                'h-5 w-5 shrink-0 rounded-full border-2 appearance-none cursor-pointer transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500/20',
                value === option.value
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-slate-300 dark:border-slate-600'
              )}
            />
            {/* Radio dot */}
            <div
              className={cn(
                'absolute left-1.5 top-1.5 h-2 w-2 rounded-full bg-white transition-opacity',
                value === option.value ? 'opacity-100' : 'opacity-0'
              )}
            />
          </div>
          <div className="flex-1">
            <span className="text-sm font-medium text-slate-900 dark:text-white">
              {option.label}
            </span>
            {option.description && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {option.description}
              </p>
            )}
          </div>
        </label>
      ))}
      {error && (
        <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export { RadioGroup };
