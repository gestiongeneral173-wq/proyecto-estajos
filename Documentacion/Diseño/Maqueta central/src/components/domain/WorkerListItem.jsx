import { UserCircle } from 'lucide-react'
import CircleIcon from '../ui/CircleIcon.jsx'
import Badge      from '../ui/Badge.jsx'

export default function WorkerListItem({ worker, onClick }) {
  const { nombre, telefono, paymentPeriod, balance = 0, es_encargado, pin } = worker

  return (
    <button
      onClick={() => onClick?.(worker)}
      className="w-full bg-white rounded-2xl p-4 shadow-sm text-left
                 hover:shadow-md transition-all flex items-center gap-3"
    >
      <CircleIcon icon={UserCircle} size="md" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-navy-dark font-semibold text-sm truncate">{nombre}</p>
          <Badge variant={paymentPeriod} short />
          {es_encargado && (
            <Badge variant="custom" bg="bg-gold/10" text="text-gold">Encargado</Badge>
          )}
        </div>
        <p className="text-gray-500 text-[10px]">{telefono}</p>
        {/* Filtro "Encargados": el PIN queda visible directo en la tarjeta,
            sin tener que abrir el modal de generación para verlo. */}
        {pin && (
          <p className="text-gold text-xs font-bold tracking-widest mt-0.5">PIN {pin}</p>
        )}
      </div>

      <div className="text-right flex-shrink-0">
        <p className={`text-sm font-bold ${balance > 0 ? 'text-primary' : 'text-gray-400'}`}>
          €{Number(balance).toFixed(0)}
        </p>
        <p className="text-[9px] text-gray-400">por pagar</p>
      </div>
    </button>
  )
}
