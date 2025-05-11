import ApplicationLogo from '@/Components/ApplicationLogo'
import Dropdown from '@/Components/Dropdown'
import NavLink from '@/Components/NavLink'
import ResponsiveNavLink from '@/Components/ResponsiveNavLink'
import { usePage } from '@inertiajs/react'
import { useState } from 'react'

export default function AuthenticatedLayout({ header, children }) {
  const user = usePage().props.auth.user
  const [showingNavigationDropdown, setShowingNavigationDropdown] =
    useState(false)

  const navigationLinks = [
    { href: route('/'), label: 'Dashboard' },
    { href: route('tutor-review'), label: 'Tutor Review' },
    { href: route('dictionary'), label: 'Dictionary' },
  ]

  const toggleNavigation = () => setShowingNavigationDropdown((prev) => !prev)

  const renderNavLinks = (isResponsive) =>
    navigationLinks.map(({ href, label }) =>
      isResponsive ? (
        <ResponsiveNavLink
          key={href}
          href={href}
          active={route().current(href)}
        >
          {label}
        </ResponsiveNavLink>
      ) : (
        <NavLink key={href} href={href} active={route().current(href)}>
          {label}
        </NavLink>
      ),
    )

  const renderDropdown = () => (
    <Dropdown>
      <Dropdown.Trigger>
        <span className="inline-flex rounded-md">
          <button
            type="button"
            className="inline-flex items-center rounded-md border bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            {user.name}
            <svg
              className="ml-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
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
    <div className="min-h-screen bg-gray-100">
      <nav className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex items-center">
              <ApplicationLogo className="block h-9 w-auto text-gray-800" />
              <div className="hidden sm:flex space-x-8 ml-10">
                {renderNavLinks(false)}
              </div>
            </div>
            <div className="hidden sm:flex sm:items-center">
              <div className="relative ml-3">{renderDropdown()}</div>
            </div>
            <div className="-mr-2 flex items-center sm:hidden">
              <button
                onClick={toggleNavigation}
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    className={
                      showingNavigationDropdown ? 'hidden' : 'inline-flex'
                    }
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                  <path
                    className={
                      showingNavigationDropdown ? 'inline-flex' : 'hidden'
                    }
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
          <div className="sm:hidden">
            <div className="space-y-1 pt-2 pb-3">{renderNavLinks(true)}</div>
          </div>
        )}
      </nav>

      {header && (
        <header className="bg-white shadow mb-12">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {header}
          </div>
        </header>
      )}
      <main className="max-w-[min(90%,1000px)] mx-auto">{children}</main>
    </div>
  )
}
