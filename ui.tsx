import React, { forwardRef, ButtonHTMLAttributes, InputHTMLAttributes } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type ButtonVariant = 'primary' | 'secondary';
type ButtonSize    = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:  ButtonVariant;
  size?:     ButtonSize;
  loading?:  boolean;
  fullWidth?: boolean;
  icon?:     React.ReactNode;
  iconEnd?:  React.ReactNode;
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?:       string;
  hint?:        string;
  error?:       string;
  fullWidth?:   boolean;
  icon?:        React.ReactNode;
}

// ─── Button ───────────────────────────────────────────────────────────────────

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant    = 'primary',
  size       = 'md',
  loading    = false,
  fullWidth  = false,
  disabled,
  icon,
  iconEnd,
  children,
  className  = '',
  ...props
}, ref) => {

  const isDisabled = disabled || loading;

  // Base — shared across all variants
  const base = [
    'inline-flex items-center justify-center gap-2',
    'font-sans font-medium tracking-tight',
    'border transition-all duration-[180ms] ease-[cubic-bezier(0.4,0,0.2,1)]',
    'select-none cursor-pointer outline-none',
    'focus-visible:ring-2 focus-visible:ring-offset-2',
    fullWidth ? 'w-full' : '',
    isDisabled ? 'pointer-events-none opacity-40' : '',
  ].join(' ');

  // Variant styles
  const variants: Record<ButtonVariant, string> = {
    primary: [
      'bg-accent-500 text-white border-accent-500',
      'hover:bg-accent-600 hover:border-accent-600',
      'active:bg-accent-700 active:border-accent-700',
      'focus-visible:ring-accent-400',
    ].join(' '),

    secondary: [
      'bg-white text-stone-700 border-stone-300',
      'hover:bg-stone-50 hover:border-stone-400 hover:text-stone-900',
      'active:bg-stone-100',
      'focus-visible:ring-accent-400',
    ].join(' '),
  };

  // Size styles
  const sizes: Record<ButtonSize, string> = {
    sm: 'h-8  px-3  text-xs  rounded-md  gap-1.5',
    md: 'h-10 px-5  text-base rounded-lg',
    lg: 'h-12 px-6  text-md  rounded-lg',
  };

  return (
    <button
      ref={ref}
      disabled={isDisabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {/* Leading icon */}
      {!loading && icon && (
        <span className="shrink-0 opacity-70">{icon}</span>
      )}

      {/* Loading spinner */}
      {loading && (
        <svg
          className="shrink-0 animate-spin"
          width={size === 'sm' ? 12 : 14}
          height={size === 'sm' ? 12 : 14}
          viewBox="0 0 16 16"
          fill="none"
        >
          <circle
            cx="8" cy="8" r="6"
            stroke="currentColor"
            strokeWidth="2"
            strokeOpacity="0.25"
          />
          <path
            d="M14 8a6 6 0 0 0-6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )}

      {/* Label */}
      <span>{children}</span>

      {/* Trailing icon */}
      {!loading && iconEnd && (
        <span className="shrink-0 opacity-70">{iconEnd}</span>
      )}
    </button>
  );
});

Button.displayName = 'Button';

// ─── Input ────────────────────────────────────────────────────────────────────

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  hint,
  error,
  fullWidth = false,
  icon,
  id,
  className = '',
  disabled,
  ...props
}, ref) => {

  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  const wrapperClass = [
    'flex flex-col gap-1.5',
    fullWidth ? 'w-full' : 'w-fit',
  ].join(' ');

  const inputBase = [
    'h-10 px-3',
    'font-sans text-base text-stone-800',
    'bg-white border rounded-lg',
    'placeholder:text-stone-400',
    'transition-all duration-[180ms] ease-[cubic-bezier(0.4,0,0.2,1)]',
    'outline-none',
    fullWidth ? 'w-full' : 'w-64',
    icon ? 'pl-9' : '',
    disabled ? 'opacity-40 pointer-events-none bg-stone-50' : '',
    error
      ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
      : 'border-stone-300 hover:border-stone-400 focus:border-accent-500 focus:ring-2 focus:ring-accent-100',
  ].join(' ');

  return (
    <div className={wrapperClass}>

      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold tracking-widest uppercase text-stone-500 select-none"
        >
          {label}
        </label>
      )}

      {/* Input wrapper (for icon positioning) */}
      <div className="relative">
        {icon && (
          <span className="absolute inset-y-0 left-3 flex items-center text-stone-400 pointer-events-none">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          className={`${inputBase} ${className}`}
          {...props}
        />
      </div>

      {/* Hint / Error */}
      {(hint || error) && (
        <p className={`text-xs leading-snug ${error ? 'text-red-500' : 'text-stone-400'}`}>
          {error ?? hint}
        </p>
      )}

    </div>
  );
});

Input.displayName = 'Input';
