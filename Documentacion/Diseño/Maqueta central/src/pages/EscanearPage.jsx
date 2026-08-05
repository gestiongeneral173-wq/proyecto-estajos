import { useState, useMemo } from 'react'
import { Search, UserCircle, Wallet, ArrowLeft, Clock, Search as SearchIcon } from 'lucide-react'

import Header        from '../components/layout/Header.jsx'
import HorizontalNav from '../components/layout/HorizontalNav.jsx'
import Card          from '../components/ui/Card.jsx'
import Button        from '../components/ui/Button.jsx'
import Input         from '../components/ui/Input.jsx'
import CircleIcon    from '../components/ui/CircleIcon.jsx'
import SectionTitle  from '../components/ui/SectionTitle.jsx'
import Badge         from '../components/ui/Badge.jsx'

import { useMockStore, getPendientesEmpleado } from '../store/mockStore.js'
import { PAYMENT_PERIOD_LABELS } from '../utils/constants.js'

/**
 * EscanearPage — MAQUETA.
 * Cambio respecto al original: se elimina el escaneo de cámara/QR. La única
 * forma de llegar a un trabajador es el buscador por nombre/teléfono.
 */
export default function EscanearPage() {
  const trabajadores = useMockStore((s) => s.trabajadores)
  const state = useMockStore()

  const [seleccionadoId, setSeleccionadoId] = useState(null)
  const [vista, setVista] = useState('menu') // 'menu' | 'adelanto' | 'pagar' | 'horas'
  const [busqueda, setBusqueda] = useState('')

  const pendientes = useMemo(() => trabajadores.map((t) => {
    const p = getPendientesEmpleado(state, t.id)
    return { ...t, ...p, pagado: p.totalPagar <= 0 && p.jornadas.length === 0 && p.adelantos.length === 0 }
  }), [trabajadores, state])

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    const lista = !q ? pendientes : pendientes.filter((e) =>
      `${e.nombre} ${e.apellido}`.toLowerCase().includes(q) || e.telefono?.toLowerCase().includes(q)
    )
    return [...lista].sort((a, b) => Number(a.pagado) - Number(b.pagado))
  }, [busqueda, pendientes])

  const trabajador = trabajadores.find((t) => t.id === seleccionadoId)
  const pend = seleccionadoId ? getPendientesEmpleado(state, seleccionadoId) : null
  const esPagado = pend ? (pend.totalPagar <= 0 && pend.jornadas.length === 0 && pend.adelantos.length === 0) : false

  const volver = () => { setSeleccionadoId(null); setVista('menu'); setBusqueda('') }

  return (
    <div className="min-h-screen bg-app-bg">
      <Header rightLabel="Salir" />
      <HorizontalNav />

      <div className="px-4 pt-4 pb-6 max-w-md mx-auto space-y-4">

        {!trabajador && (
          <Card>
            <SectionTitle color="green">Buscar trabajador</SectionTitle>
            <div className="flex flex-col items-center py-4">
              <CircleIcon icon={SearchIcon} size="xl" shape="square" />
              <p className="text-gray-500 text-xs text-center mt-4">
                Busca por nombre o teléfono para ver las opciones del trabajador.
              </p>
            </div>
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Nombre o teléfono del trabajador"
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-1 max-h-80 overflow-y-auto">
              {filtrados.length === 0 ? (
                <p className="text-gray-400 text-xs text-center py-4">Sin coincidencias.</p>
              ) : filtrados.map((e) => (
                <button
                  key={e.id}
                  onClick={() => setSeleccionadoId(e.id)}
                  className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-left transition-colors active:scale-97 ${
                    e.pagado ? 'bg-green-50 hover:bg-green-100' : 'bg-gray-50 hover:bg-primary/10'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-navy-dark truncate">{e.nombre} {e.apellido}</p>
                    <p className="text-[10px] text-gray-400">{e.telefono}</p>
                  </div>
                  {e.pagado && (
                    <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-700">Pagado</span>
                  )}
                </button>
              ))}
            </div>
          </Card>
        )}

        {trabajador && (
          <>
            <Card>
              <div className="flex items-center gap-3">
                <CircleIcon icon={UserCircle} size="lg" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-navy-dark font-bold text-sm truncate">{trabajador.nombre} {trabajador.apellido}</p>
                    <Badge variant={trabajador.payment_period} />
                  </div>
                  <p className="text-gray-500 text-[10px]">{trabajador.telefono}</p>
                  <p className="text-gray-400 text-[10px]">
                    Ciclo: {PAYMENT_PERIOD_LABELS[trabajador.payment_period]}
                  </p>
                </div>
              </div>
              {esPagado && (
                <div className="mt-3 p-2 bg-green-100 border border-green-300 rounded-lg text-center text-green-700 font-semibold text-xs">
                  PAGADO EN ESTE CICLO
                </div>
              )}
            </Card>

            {vista === 'menu' && (
              <Card>
                <SectionTitle color="green">¿Qué deseas hacer?</SectionTitle>
                <div className="space-y-3">
                  <Button variant="primary" onClick={() => setVista('adelanto')}>DAR ADELANTO</Button>
                  <Button variant="dark" icon={<Wallet className="w-4 h-4" />} onClick={() => setVista('pagar')}>PAGAR EMPLEADO</Button>
                  <Button variant="outline" icon={<Clock className="w-4 h-4" />} onClick={() => setVista('horas')}>AGREGAR HORAS</Button>
                  <Button variant="outline" onClick={volver}>CANCELAR</Button>
                </div>
              </Card>
            )}

            {vista === 'adelanto' && (
              <SeccionAdelanto trabajadorId={trabajador.id} adelantos={pend.adelantos} onBack={() => setVista('menu')} />
            )}

            {vista === 'pagar' && (
              <SeccionPagar trabajador={trabajador} pend={pend} esPagado={esPagado} onBack={() => setVista('menu')} onPaid={volver} />
            )}

            {vista === 'horas' && (
              <SeccionAgregarHoras trabajadorId={trabajador.id} onBack={() => setVista('menu')} />
            )}
          </>
        )}
      </div>
    </div>
  )
}

function SeccionAdelanto({ trabajadorId, adelantos, onBack }) {
  const registrarAdelanto = useMockStore((s) => s.registrarAdelanto)
  const [monto, setMonto] = useState('')
  const total = adelantos.reduce((s, a) => s + Number(a.monto), 0)

  return (
    <Card>
      <SectionTitle color="gold">Dar adelanto</SectionTitle>
      <div className="border border-gray-200 rounded-xl overflow-hidden mb-4">
        <div className="grid grid-cols-2 bg-gray-50 p-2 text-[10px] font-semibold text-gray-500 uppercase">
          <span>Fecha</span><span className="text-right">Monto</span>
        </div>
        {adelantos.length === 0 ? (
          <p className="text-gray-400 text-xs text-center py-3">Sin adelantos en este ciclo.</p>
        ) : adelantos.map((a) => (
          <div key={a.id} className="grid grid-cols-2 p-2 border-t border-gray-100 text-xs text-navy-dark">
            <span>{a.fecha}</span><span className="text-right font-semibold">€{Number(a.monto).toFixed(2)}</span>
          </div>
        ))}
        {adelantos.length > 0 && (
          <div className="grid grid-cols-2 p-2 bg-gray-50 border-t border-gray-200 text-xs font-bold text-navy-dark">
            <span>Total</span><span className="text-right">€{total.toFixed(2)}</span>
          </div>
        )}
      </div>
      <div className="space-y-3">
        <Input label="Monto del adelanto (€)" type="number" value={monto} onChange={(e) => setMonto(e.target.value)} />
        <p className="text-[10px] text-gray-400 text-center">El adelanto se registra automáticamente con la fecha de hoy.</p>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" icon={<ArrowLeft className="w-4 h-4" />} onClick={onBack}>VOLVER</Button>
          <Button variant="primary" disabled={!monto} onClick={() => { registrarAdelanto(trabajadorId, parseFloat(monto) || 0); setMonto(''); onBack() }}>
            REGISTRAR
          </Button>
        </div>
      </div>
    </Card>
  )
}

function SeccionPagar({ trabajador, pend, esPagado, onBack, onPaid }) {
  const pagarEmpleado = useMockStore((s) => s.pagarEmpleado)
  const totalAPagar = pend.totalPagar

  return (
    <Card>
      <SectionTitle color="green">Liquidación · Ciclo activo</SectionTitle>
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="grid grid-cols-4 gap-2 bg-gray-50 p-2 text-[10px] font-semibold text-gray-500 uppercase">
          <span>Fecha</span><span>Horas</span><span>Destajo</span><span className="text-right">Total</span>
        </div>
        {pend.jornadas.length === 0 ? (
          <p className="text-gray-400 text-xs text-center py-3">Sin días pendientes en este ciclo.</p>
        ) : pend.jornadas.map((j) => (
          <div key={j.id} className="grid grid-cols-4 gap-2 p-2 border-t border-gray-100 text-xs text-navy-dark">
            <span>{j.fecha}</span><span>{j.horas}</span><span>€{j.destajo}</span>
            <span className="text-right font-semibold">€{(j.horas * j.tarifa + Number(j.destajo)).toFixed(2)}</span>
          </div>
        ))}
        <div className="grid grid-cols-4 gap-2 p-2 bg-gray-50 border-t border-gray-200 text-xs font-bold text-navy-dark">
          <span className="col-span-3 text-right">Días trabajados:</span>
          <span className="text-right">€{pend.totalDevengado.toFixed(2)}</span>
        </div>
        <div className="grid grid-cols-4 gap-2 p-2 border-t border-gray-100 text-xs text-danger">
          <span className="col-span-3 text-right">Adelantos del ciclo:</span>
          <span className="text-right">−€{pend.totalAdelantos.toFixed(2)}</span>
        </div>
        <div className="grid grid-cols-4 gap-2 p-2 bg-primary/10 border-t border-gray-200 text-xs font-bold text-primary">
          <span className="col-span-3 text-right">Total a pagar:</span>
          <span className="text-right">€{totalAPagar.toFixed(2)}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-4">
        <Button variant="outline" icon={<ArrowLeft className="w-4 h-4" />} onClick={onBack}>VOLVER</Button>
        <Button variant="primary" disabled={esPagado || pend.jornadas.length === 0}
          onClick={() => { pagarEmpleado(trabajador.id); onPaid() }}>
          {esPagado ? 'YA PAGADO' : 'CONFIRMAR PAGO'}
        </Button>
      </div>
    </Card>
  )
}

function SeccionAgregarHoras({ trabajadorId, onBack }) {
  const registrarHorasCentral = useMockStore((s) => s.registrarHorasCentral)
  const [horas, setHoras] = useState('')
  const [destajo, setDestajo] = useState('')

  return (
    <Card>
      <SectionTitle color="gold">Agregar horas · Hoy</SectionTitle>
      <div className="space-y-4">
        <Input label="Horas trabajadas" type="number" value={horas} onChange={(e) => setHoras(e.target.value)} />
        <Input label="Destajo (€)" type="number" value={destajo} onChange={(e) => setDestajo(e.target.value)} />
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={onBack}>CANCELAR</Button>
          <Button variant="primary"
            onClick={() => { registrarHorasCentral(trabajadorId, parseFloat(horas) || 0, parseFloat(destajo) || 0); onBack() }}>
            REGISTRAR
          </Button>
        </div>
      </div>
    </Card>
  )
}
