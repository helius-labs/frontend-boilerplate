import { cn } from '@/lib/utils';
import { Input } from './input';

/**
 * Form field with label and input.
 * Wraps the Input component with consistent label styling.
 */
export function FormField({
  id,
  label,
  value,
  onChange,
  placeholder,
  className,
  inputClassName,
  type = 'text',
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  type?: 'text' | 'number' | 'email' | 'url';
}) {
  return (
    <div className={cn('space-y-2', className)}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClassName}
      />
    </div>
  );
}
