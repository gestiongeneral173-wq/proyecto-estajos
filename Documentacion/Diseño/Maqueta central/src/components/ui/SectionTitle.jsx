const COLORS = {
  gold:  'bg-gold',
  green: 'bg-primary',
  red:   'bg-danger'
}

export default function SectionTitle({ color = 'gold', children, className = '' }) {
  return (
    <div className={`flex items-center gap-2 mb-4 ${className}`}>
      <div className={`w-1 h-5 rounded-full ${COLORS[color]}`} />
      <h2 className="text-navy-dark font-bold text-sm uppercase">{children}</h2>
    </div>
  )
}
