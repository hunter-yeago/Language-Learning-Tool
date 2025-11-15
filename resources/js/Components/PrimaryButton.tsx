import { ButtonHTMLAttributes } from 'react';

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  disabled?: boolean;
}

export default function PrimaryButton({ className = '', disabled, children, ...props }: PrimaryButtonProps) {
  return (
    <button
      {...props}
      className={
        `inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-5 py-2.5 text-sm font-medium text-white transition duration-150 ease-in-out hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 active:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed ${className}`
      }
      disabled={disabled}
    >
      {children}
    </button>
  )
}
