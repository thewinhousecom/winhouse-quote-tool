// ============================================
// INPUT COMPONENT
// ============================================

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            'flex h-12 w-full rounded-xl border-2 bg-white px-4 py-2 text-base transition-all duration-200',
            'placeholder:text-slate-400',
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'dark:bg-slate-900 dark:text-white',
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20 dark:border-red-600'
              : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 dark:border-slate-700 dark:focus:border-blue-400',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-red-500 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

// ============================================
// TEXTAREA COMPONENT
// ============================================

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          className={cn(
            'flex min-h-[120px] w-full rounded-xl border-2 bg-white px-4 py-3 text-base transition-all duration-200',
            'placeholder:text-slate-400',
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'dark:bg-slate-900 dark:text-white',
            'resize-none',
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20 dark:border-red-600'
              : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 dark:border-slate-700 dark:focus:border-blue-400',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-red-500 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

// ============================================
// LABEL COMPONENT
// ============================================

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, required, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          'text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2',
          className
        )}
        {...props}
      >
        {children}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    );
  }
);
Label.displayName = 'Label';

// ============================================
// FORM FIELD WRAPPER
// ============================================

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  required,
  error,
  children,
  className,
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      <Label required={required}>{label}</Label>
      {children}
      {error && (
        <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export { Input, Textarea, Label, FormField };
