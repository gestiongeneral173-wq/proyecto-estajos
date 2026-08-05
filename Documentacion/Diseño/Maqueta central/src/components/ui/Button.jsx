export default function Button({
  variant   = 'primary',
  active    = false,
  icon      = null,
  type      = 'button',
  disabled  = false,
  className = '',
  onClick,
  children
}) {
  const base = 'rounded-xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-97 transition-[transform,background-color,border-color,box-shadow] duration-150'

  const variants = {
    primary: `w-full py-3 bg-primary text-white hover:bg-primary-hover ${base}`,
    dark:    `w-full py-3 bg-navy-dark text-white hover:bg-navy-medium ${base}`,
    outline: `w-full py-3 border-2 border-navy-dark text-navy-dark font-bold hover:bg-navy-dark hover:text-white ${base}`,
    gold:    `w-full py-3 bg-gold text-navy-dark hover:bg-gold-hover ${base}`,
    pill: active
      ? 'px-4 py-2 rounded-full text-xs font-semibold bg-primary text-white whitespace-nowrap active:scale-97 transition-[transform,background-color] duration-150'
      : 'px-4 py-2 rounded-full text-xs font-semibold text-gray-600 hover:bg-gray-100 whitespace-nowrap active:scale-97 transition-[transform,background-color] duration-150'
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${variants[variant]} ${className}`}
    >
      {icon}
      {children}
    </button>
  )
}
