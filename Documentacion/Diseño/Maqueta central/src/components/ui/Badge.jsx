const PRESETS = {
  mensual:   { bg: 'bg-blue-50',   text: 'text-blue-600',   label: 'Mensual',   short: 'M' },
  quincenal: { bg: 'bg-purple-50', text: 'text-purple-600', label: 'Quincenal', short: 'Q' },
  diario:    { bg: 'bg-orange-50', text: 'text-orange-600', label: 'Diario',    short: 'D' }
}

export default function Badge({ variant = 'mensual', short = false, bg, text, children }) {
  const preset = PRESETS[variant] || { bg, text, label: '', short: '' }

  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${preset.bg} ${preset.text}`}>
      {children || (short ? preset.short : preset.label)}
    </span>
  )
}
