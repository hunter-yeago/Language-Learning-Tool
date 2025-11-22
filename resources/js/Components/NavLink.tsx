import { Link, InertiaLinkProps } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

interface NavLinkProps extends InertiaLinkProps {
  active?: boolean;
  className?: string;
}

export default function NavLink({ active = false, className = '', children, ...props }: PropsWithChildren<NavLinkProps>) {
  return (
    <Link
      {...props}
      className={
        'inline-flex items-center focus:bg-neutral-100 focus:text-neutral-900 px-4 py-2 text-sm font-medium rounded-md transition duration-150 ease-in-out focus:outline-none ' +
        (active
          ? 'bg-primary-50 text-primary-700'
          : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900') +
        ' ' + className
      }
    >
      {children}
    </Link>
  )
}
