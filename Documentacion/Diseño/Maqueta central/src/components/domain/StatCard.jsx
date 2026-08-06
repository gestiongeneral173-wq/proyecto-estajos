const COLORS = {
  navy:    'text-navy-dark',
  primary: 'text-primary',
  danger:  'text-danger',
  gold:    'text-gold'
}

export default function StatCard({ value, label, color = 'navy' }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
      <p className={`text-2xl font-bold ${COLORS[color]}`}>{value}</p>
      <p className="text-gray-500 text-xs mt-1 uppercase">{label}</p>
    </div>
  )
}
