import ApplicationLogo from '@/Components/ApplicationLogo'
import Dropdown from '@/Components/Dropdown'
import NavLink from '@/Components/NavLink'
import ResponsiveNavLink from '@/Components/ResponsiveNavLink'
import { usePage } from '@inertiajs/react'
import { useState, PropsWithChildren, ReactNode } from 'react'
import { PageProps } from '@/types'

interface NavLinkConfig {
  href: string
  label: string
}

interface AuthenticatedLayoutProps {
  header?: ReactNode
}

export default function AuthenticatedLayout({ header, children }: PropsWithChildren<AuthenticatedLayoutProps>) {
  const user = usePage<PageProps>().props.auth.user
  const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false)

  const userRoles = user.roles?.map((role: any) => role.name) || []

  const studentNavLinks: NavLinkConfig[] = [
    { href: route('/'), label: 'Dashboard' },
    { href: route('student.progress'), label: 'Progress' },
    { href: route('dictionary'), label: 'Dictionary' },
  ]

  const tutorNavLinks: NavLinkConfig[] = [
    { href: route('/'), label: 'Dashboard' },
    { href: route('dictionary'), label: 'Dictionary' },
    { href: route('tutor.students'), label: 'Students' },
  ]

  // Determine which nav links to show based on user role
  const navLinks = userRoles.includes('tutor') ? tutorNavLinks : studentNavLinks

  const toggleNavigation = () => setShowingNavigationDropdown((prev) => !prev)
  const renderNavLinks = (isResponsive: boolean) =>
    navLinks.map(({ href, label }) =>
      isResponsive ? (
        <ResponsiveNavLink key={href} href={href} active={route().current(href)}>
          {label}
        </ResponsiveNavLink>
      ) : (
        <NavLink key={href} href={href} active={route().current(href)}>
          {label}
        </NavLink>
      )
    )

  const renderDropdown = () => (
    <Dropdown>
      <Dropdown.Trigger>
        <span className="inline-flex rounded-md">
          <button type="button" className="inline-flex items-center rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition">
            {user.name}
            <svg className="ml-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </span>
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
        <Dropdown.Link href={route('logout')} method="post" as="button">
          Log Out
        </Dropdown.Link>
      </Dropdown.Content>
    </Dropdown>
  )

  return (
    <div className="min-h-screen bg-neutral-50 pb-8">
      <nav className="bg-white border-b border-neutral-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 justify-between">
            <div className="flex items-center">
              <ApplicationLogo className="block h-10 w-auto text-primary-700" />
              <div className="hidden sm:flex space-x-1 ml-12">{renderNavLinks(false)}</div>
            </div>
            <div className="hidden sm:flex sm:items-center">
              <div className="relative ml-3">{renderDropdown()}</div>
            </div>
            <div className="-mr-2 flex items-center sm:hidden">
              <button
                onClick={toggleNavigation}
                className="inline-flex items-center justify-center rounded-md p-2 text-neutral-500 hover:bg-neutral-100 focus:outline-none"
              >
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path
                    className={showingNavigationDropdown ? 'hidden' : 'inline-flex'}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                  <path
                    className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        {showingNavigationDropdown && (
          <div className="sm:hidden border-t border-neutral-200">
            <div className="space-y-1 pt-2 pb-3">{renderNavLinks(true)}</div>
          </div>
        )}
      </nav>

      {header && (
        <header className="bg-white border-b border-neutral-200">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{header}</div>
        </header>
      )}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  )
}
