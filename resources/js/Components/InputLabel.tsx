import { LabelHTMLAttributes, PropsWithChildren } from 'react';

interface InputLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  value?: string;
  className?: string;
}

export default function InputLabel({ value, className = '', children, ...props }: PropsWithChildren<InputLabelProps>) {
  return (
    <label {...props} className={`block text-sm font-medium text-neutral-700 ` + className}>
      {value ? value : children}
    </label>
  )
}
