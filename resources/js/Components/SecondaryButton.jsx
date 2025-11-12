export default function SecondaryButton({ type = 'button', className = '', disabled, children, ...props }) {
  return (
    <button
      {...props}
      type={type}
      className={
        `inline-flex items-center justify-center rounded-md border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 shadow-sm transition duration-150 ease-in-out hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`
      }
      disabled={disabled}
    >
      {children}
    </button>
  )
}
