import { forwardRef, useId } from "react";
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, id, className = "", ...props },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-medium uppercase tracking-wide text-stone">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={`focus-ring w-full rounded-[var(--radius-ui)] border bg-ivory px-3.5 py-2.5 text-sm text-ink placeholder:text-stone/60 ${
          error ? "border-terracotta" : "border-stone/30"
        } ${className}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-xs text-terracotta">
          {error}
        </p>
      )}
      {!error && hint && (
        <p id={`${inputId}-hint`} className="text-xs text-stone">
          {hint}
        </p>
      )}
    </div>
  );
});

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, id, className = "", children, ...props },
  ref,
) {
  const autoId = useId();
  const selectId = id ?? autoId;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-xs font-medium uppercase tracking-wide text-stone">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={`focus-ring w-full rounded-[var(--radius-ui)] border bg-ivory px-3.5 py-2.5 text-sm text-ink ${
          error ? "border-terracotta" : "border-stone/30"
        } ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-terracotta">{error}</p>}
    </div>
  );
});

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, id, className = "", ...props },
  ref,
) {
  const autoId = useId();
  const textareaId = id ?? autoId;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={textareaId} className="text-xs font-medium uppercase tracking-wide text-stone">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        className={`focus-ring w-full rounded-[var(--radius-ui)] border bg-ivory px-3.5 py-2.5 text-sm text-ink ${
          error ? "border-terracotta" : "border-stone/30"
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-terracotta">{error}</p>}
    </div>
  );
});
