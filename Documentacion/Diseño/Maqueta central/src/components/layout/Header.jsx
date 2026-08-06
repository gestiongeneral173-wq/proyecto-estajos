import { Truck } from 'lucide-react'

/**
 * Header — versión de maqueta: sin auth, sin botón de pánico (eso es un
 * subsistema aparte, fuera del alcance de esta maqueta). Se mantiene el
 * mismo look & feel (logo + botón contextual a la derecha).
 */
export default function Header({ rightLabel = null, rightIcon = null, onRightClick = () => {} }) {
  return (
    <header
      className="bg-navy-dark px-4 pb-5 flex items-center justify-between sticky top-0 z-40"
      style={{ paddingTop: 'calc(1.25rem + env(safe-area-inset-top, 0px))' }}
    >
      <div className="flex items-center gap-2">
        <Truck className="w-6 h-6 text-gold" />
        <h1 className="text-white font-bold text-lg tracking-wide">ESTAJOS</h1>
      </div>

      {rightLabel && (
        <button
          onClick={onRightClick}
          className="px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all bg-navy-medium text-gray-300"
        >
          {rightIcon}
          {rightLabel}
        </button>
      )}
    </header>
  )
}
