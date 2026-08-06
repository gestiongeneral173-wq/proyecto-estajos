import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Settings, Trash2, Eye, KeyRound, Copy, Check } from 'lucide-react'

import Header         from '../components/layout/Header.jsx'
import HorizontalNav  from '../components/layout/HorizontalNav.jsx'
import Card           from '../components/ui/Card.jsx'
import Button         from '../components/ui/Button.jsx'
import Input          from '../components/ui/Input.jsx'
import Modal          from '../components/ui/Modal.jsx'
import SectionTitle   from '../components/ui/SectionTitle.jsx'
import WorkerListItem from '../components/domain/WorkerListItem.jsx'

import { useMockStore, getBalanceEmpleado } from '../store/mockStore.js'
import { Direccion } from '../utils/constants.js'

// Cambio: vuelve el filtro "Encargados" — muestra a todo el personal con
// es_encargado = true, y su tarjeta se distingue mostrando el PIN directo
// (si ya tiene uno generado), sin tener que abrir el modal.
const FILTROS = [
  { key: 'todos',      label: 'Todos' },
  { key: 'mensual',    label: 'Mensual' },
  { key: 'quincenal',  label: 'Quincenal' },
  { key: 'encargados', label: 'Encargados' },
]

export default function RegistrosPage() {
  const navigate = useNavigate()
  const trabajadores = useMockStore((s) => s.trabajadores)
  const pinesEncargado = useMockStore((s) => s.pinesEncargado)
  const state = useMockStore()

  const [filtro, setFiltro] = useState('todos')
  const [busqueda, setBusqueda] = useState('')
  const [modalAlta, setModalAlta] = useState(false)
  const [modalTemporales, setModalTemporales] = useState(false)
  const [modalChofer, setModalChofer] = useState(false)
  const [modalPinEncargados, setModalPinEncargados] = useState(false)

  const listado = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    return trabajadores
      .filter((t) => filtro === 'todos' ? true : filtro === 'encargados' ? t.es_encargado : t.payment_period === filtro)
      .filter((t) => !q || `${t.nombre} ${t.apellido}`.toLowerCase().includes(q))
      .map((t) => ({
        ...t,
        nombre: `${t.nombre} ${t.apellido}`,
        paymentPeriod: t.payment_period,
        balance: getBalanceEmpleado(state, t.id),
        pin: pinesEncargado.find((p) => p.empleado_id === t.id)?.pin ?? null,
      }))
  }, [trabajadores, filtro, busqueda, state, pinesEncargado])

  return (
    <div className="min-h-screen bg-app-bg">
      <Header rightLabel="Salir" />
      <HorizontalNav />

      <div className="px-4 pt-4 pb-6 max-w-md mx-auto space-y-4">
        <Card>
          <SectionTitle color="green">Registros</SectionTitle>
          <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setModalAlta(true)}>
            AÑADIR TRABAJADOR
          </Button>
          {/* Cambio: se elimina por completo "AUTORIZAR NUEVOS REGISTROS" (PIN de autoregistro). */}
          <Button variant="dark" icon={<Eye className="w-4 h-4" />} className="mt-2" onClick={() => setModalTemporales(true)}>
            VER TEMPORALES
          </Button>
          <Button variant="dark" icon={<Settings className="w-4 h-4" />} className="mt-2" onClick={() => setModalChofer(true)}>
            CONFIGURAR CHOFER
          </Button>
          {/* Nuevo: PIN de encargado (4 dígitos) — el admin elige a quién
              generárselo y lo comparte por WhatsApp. */}
          <Button variant="dark" icon={<KeyRound className="w-4 h-4" />} className="mt-2" onClick={() => setModalPinEncargados(true)}>
            GENERAR PIN DE ENCARGADOS
          </Button>
        </Card>

        <Card>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1">
            {FILTROS.map((f) => (
              <Button key={f.key} variant="pill" active={filtro === f.key} onClick={() => setFiltro(f.key)}>{f.label}</Button>
            ))}
          </div>
          <div className="mt-4 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input placeholder="Buscar..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="pl-9" />
          </div>
        </Card>

        <div className="space-y-2">
          {listado.length === 0 ? (
            <Card><p className="text-gray-400 text-xs text-center py-6">No hay registros.</p></Card>
          ) : listado.map((w) => (
            <WorkerListItem key={w.id} worker={w} onClick={() => navigate(`${Direccion.CentralTrabajadores}/${w.id}`)} />
          ))}
        </div>
      </div>

      <ModalAlta open={modalAlta} onClose={() => setModalAlta(false)} />
      <ModalVerTemporales open={modalTemporales} onClose={() => setModalTemporales(false)} />
      <ModalConfigurarChofer open={modalChofer} onClose={() => setModalChofer(false)} />
      <ModalPinEncargados open={modalPinEncargados} onClose={() => setModalPinEncargados(false)} />
    </div>
  )
}

/* ─── Alta de trabajador — Cambio: campos Nombre, Apellido, Número, Ciclo, Cuenta, Pago por hora ─── */
function ModalAlta({ open, onClose }) {
  const crearTrabajador = useMockStore((s) => s.crearTrabajador)
  const [form, setForm] = useState({ nombre: '', apellido: '', telefono: '', cuenta: '', payment_period: 'mensual', tarifa_hora: '' })
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const guardar = () => {
    crearTrabajador({
      nombre: form.nombre.trim(), apellido: form.apellido.trim(), telefono: form.telefono.trim(),
      cuenta: form.cuenta.trim(), payment_period: form.payment_period, tarifa_hora: parseFloat(form.tarifa_hora) || 0,
    })
    setForm({ nombre: '', apellido: '', telefono: '', cuenta: '', payment_period: 'mensual', tarifa_hora: '' })
    onClose()
  }

  return (
    <Modal open={open} title="Nuevo Trabajador" onClose={onClose}>
      <div className="space-y-3">
        <Input label="Nombre" value={form.nombre} onChange={set('nombre')} />
        <Input label="Apellido" value={form.apellido} onChange={set('apellido')} />
        <Input label="Número (teléfono)" value={form.telefono} onChange={set('telefono')} />
        <div>
          <label className="label-base">Ciclo *</label>
          <select value={form.payment_period} onChange={set('payment_period')} className="input-base">
            <option value="mensual">Mensual</option>
            <option value="quincenal">Quincenal</option>
          </select>
        </div>
        <Input label="Cuenta bancaria" placeholder="ES00 0000 0000 0000 0000" value={form.cuenta} onChange={set('cuenta')} />
        <Input label="Pago por hora (€) *" type="number" value={form.tarifa_hora} onChange={set('tarifa_hora')} />
        {/* No te permite guardar sin nombre, apellido, ciclo y pago por hora. */}
        <Button variant="primary"
          disabled={!form.nombre || !form.apellido || !form.payment_period || !(parseFloat(form.tarifa_hora) > 0)}
          onClick={guardar}>
          GUARDAR
        </Button>
      </div>
    </Modal>
  )
}

/* ─── Ver temporales ───
   Se mantiene la sección para configurar el pago por hora — mismo bloque
   editable (mostrar/editar/guardar) que ya tenía "Configurar temporales"
   en el sistema real. El listado del día sigue siendo informativo (horas +
   destajo, sin un total "Pagado" calculado): esa tarifa queda como dato de
   referencia para el admin, no se usa para calcular nada automáticamente. */
function ModalVerTemporales({ open, onClose }) {
  const temporales = useMockStore((s) => s.temporales)
  const eliminarTemporal = useMockStore((s) => s.eliminarTemporal)
  const eliminarTodosLosTemporales = useMockStore((s) => s.eliminarTodosLosTemporales)
  const tarifaTemporal = useMockStore((s) => s.tarifaTemporal)
  const setTarifaTemporal = useMockStore((s) => s.setTarifaTemporal)

  const [editandoTarifa, setEditandoTarifa] = useState(false)
  const [tarifa, setTarifa] = useState(String(tarifaTemporal))
  const [tarifaGuardada, setTarifaGuardada] = useState(false)
  const tarifaValida = parseFloat(tarifa) > 0

  const guardarTarifa = () => {
    setTarifaTemporal(parseFloat(tarifa) || 0)
    setEditandoTarifa(false)
    setTarifaGuardada(true)
    setTimeout(() => setTarifaGuardada(false), 1500)
  }

  return (
    <Modal open={open} title="Ver temporales" onClose={onClose}>
      {/* Tarifa de temporales — mismo bloque que la tarifa inicial de
          autoregistro / chofer, otro origen de datos. */}
      <div className="bg-gray-50 rounded-xl p-3 mb-4">
        {tarifaGuardada && <p className="text-primary text-[10px] mb-2">Tarifa actualizada.</p>}
        {editandoTarifa ? (
          <div className="space-y-2">
            <Input label="Tarifa por hora (€)" type="number" min="0.01" step="0.01" value={tarifa} onChange={(e) => setTarifa(e.target.value)} />
            {tarifa !== '' && !tarifaValida && <p className="text-danger text-[10px]">Debe ser mayor a 0.</p>}
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => setEditandoTarifa(false)}>CANCELAR</Button>
              <Button variant="primary" disabled={!tarifaValida} onClick={guardarTarifa}>GUARDAR</Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] text-gray-400 uppercase">Tarifa de temporales</p>
              <p className="text-sm font-bold text-navy-dark">€{Number(tarifaTemporal || 0).toFixed(2)}/h</p>
            </div>
            <button onClick={() => { setTarifa(String(tarifaTemporal)); setEditandoTarifa(true) }} className="text-gray-400 hover:text-navy-dark">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="bg-gray-50 rounded-xl p-3">
        <p className="text-[10px] text-gray-400 mb-3">
          El listado del día sigue siendo informativo — el encargado anota horas y destajo, el sistema
          no calcula ningún pago. Se eliminan automáticamente todos los días a la 1:00 AM.
        </p>
        {temporales.length === 0 ? (
          <p className="text-gray-400 text-xs text-center py-3">Sin temporales registrados hoy.</p>
        ) : (
          <div className="space-y-1">
            <div className="grid grid-cols-4 gap-1 pb-2 border-b border-gray-100">
              {['Nombre', 'Horas', 'Destajo', ''].map((h, i) => (
                <p key={i} className="text-[9px] font-semibold text-gray-400 uppercase text-center first:text-left">{h}</p>
              ))}
            </div>
            {temporales.map((t) => (
              <div key={t.id} className="grid grid-cols-4 gap-1 py-1.5 border-b border-gray-50 last:border-0 items-center">
                <p className="text-[10px] font-semibold text-navy-dark truncate">{t.nombre_completo}</p>
                <p className="text-[10px] text-center text-navy-dark">{t.horas_trabajadas}h</p>
                <p className="text-[10px] text-center text-navy-dark">€{Number(t.destajo).toFixed(2)}</p>
                <button onClick={() => eliminarTemporal(t.id)} className="flex justify-end text-gray-400 hover:text-danger">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
        {temporales.length > 0 && (
          <Button variant="outline" className="mt-3 !border-danger !text-danger hover:!bg-danger hover:!text-white" onClick={eliminarTodosLosTemporales}>
            ELIMINAR TODOS
          </Button>
        )}
      </div>
    </Modal>
  )
}

/* ─── Generar PIN de encargados ───
   El admin busca y selecciona a uno o varios encargados y les genera un
   PIN de 4 dígitos de una sola vez — cada uno con su botón de copiar para
   pasarlo por WhatsApp. Vuelve a generarlo (lo reemplaza) si ya tenía uno.
   Debajo queda siempre visible la lista de PINs activos, con copiar y
   eliminar individual. */
function ModalPinEncargados({ open, onClose }) {
  const trabajadores = useMockStore((s) => s.trabajadores)
  const pinesEncargado = useMockStore((s) => s.pinesEncargado)
  const generarPinesEncargado = useMockStore((s) => s.generarPinesEncargado)
  const eliminarPinEncargado = useMockStore((s) => s.eliminarPinEncargado)

  const [busqueda, setBusqueda] = useState('')
  const [seleccionados, setSeleccionados] = useState(new Set())
  const [generados, setGenerados] = useState(null) // últimos generados en esta tanda
  const [copiadoId, setCopiadoId] = useState(null)

  const encargados = trabajadores.filter((t) => t.es_encargado)
  const disponibles = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    return encargados.filter((t) => !q || `${t.nombre} ${t.apellido}`.toLowerCase().includes(q))
  }, [encargados, busqueda])

  const toggle = (id) => setSeleccionados((prev) => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })

  const generar = () => {
    const ids = [...seleccionados]
    if (ids.length === 0) return
    generarPinesEncargado(ids)
    setGenerados(ids)
    setSeleccionados(new Set())
  }

  const copiar = (pinId, pin) => {
    navigator.clipboard?.writeText(pin)
    setCopiadoId(pinId)
    setTimeout(() => setCopiadoId(null), 1200)
  }

  const nombreDe = (empleadoId) => {
    const t = trabajadores.find((x) => x.id === empleadoId)
    return t ? `${t.nombre} ${t.apellido}` : '—'
  }

  const reset = () => { setBusqueda(''); setSeleccionados(new Set()); setGenerados(null) }

  return (
    <Modal open={open} title="Generar PIN de encargados" onClose={() => { reset(); onClose() }}>
      <div className="space-y-4">
        {/* Resultado recién generado — arriba de todo, para copiar y pasar por WhatsApp al toque. */}
        {generados && (
          <div className="bg-gold/10 border border-gold/30 rounded-xl p-3 space-y-2">
            <p className="text-[9px] text-gray-500 uppercase font-semibold">PIN generado</p>
            {generados.map((empleadoId) => {
              const p = pinesEncargado.find((x) => x.empleado_id === empleadoId)
              if (!p) return null
              return (
                <div key={p.id} className="flex items-center justify-between bg-white rounded-lg px-3 py-2">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-navy-dark truncate">{nombreDe(empleadoId)}</p>
                    <p className="text-lg font-bold tracking-widest text-navy-dark">{p.pin}</p>
                  </div>
                  <button onClick={() => copiar(p.id, p.pin)} className="flex items-center gap-1 text-xs font-semibold text-primary shrink-0">
                    {copiadoId === p.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copiadoId === p.id ? 'Copiado' : 'Copiar'}
                  </button>
                </div>
              )
            })}
            <button onClick={() => setGenerados(null)} className="w-full text-gray-500 text-xs pt-1">Generar más</button>
          </div>
        )}

        {!generados && (
          <>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input type="text" placeholder="Buscar encargado…" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="!pl-9" />
            </div>

            {disponibles.length === 0 ? (
              <p className="text-gray-400 text-xs text-center py-6">
                {busqueda ? 'Sin coincidencias.' : 'No hay encargados registrados.'}
              </p>
            ) : (
              <div className="border border-gray-200 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
                {disponibles.map((t, i) => {
                  const tienePin = pinesEncargado.some((p) => p.empleado_id === t.id)
                  return (
                    <label key={t.id} className={`grid grid-cols-[auto_1fr_auto] gap-2 p-2 border-t border-gray-100 first:border-t-0 items-center text-xs ${seleccionados.has(t.id) ? 'bg-primary/10' : i % 2 ? 'bg-gray-50/60' : 'bg-white'}`}>
                      <input type="checkbox" checked={seleccionados.has(t.id)} onChange={() => toggle(t.id)} />
                      <span className="text-navy-dark truncate">{t.nombre} {t.apellido}</span>
                      {tienePin && <span className="text-[9px] text-gold font-semibold">ya tiene PIN</span>}
                    </label>
                  )
                })}
              </div>
            )}

            <Button variant="primary" icon={<KeyRound className="w-4 h-4" />} disabled={seleccionados.size === 0} onClick={generar}>
              GENERAR PIN ({seleccionados.size})
            </Button>
          </>
        )}

        {/* PINs activos — siempre visibles, sin importar si se acaba de generar uno. */}
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-[9px] text-gray-400 uppercase mb-2">PINs activos</p>
          {pinesEncargado.length === 0 ? (
            <p className="text-gray-400 text-xs text-center py-3">No hay PINs activos.</p>
          ) : (
            <div className="space-y-1">
              {pinesEncargado.map((p) => (
                <div key={p.id} className="grid grid-cols-[1fr_auto_auto] gap-2 py-1.5 border-b border-gray-100 last:border-0 items-center">
                  <p className="text-[11px] font-semibold text-navy-dark truncate">{nombreDe(p.empleado_id)}</p>
                  <p className="text-[11px] font-bold tracking-widest text-navy-dark">{p.pin}</p>
                  <div className="flex items-center gap-2">
                    <button onClick={() => copiar(p.id, p.pin)} className="text-gray-400 hover:text-primary">
                      {copiadoId === p.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => eliminarPinEncargado(p.id)} className="text-gray-400 hover:text-danger">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}

function ModalConfigurarChofer({ open, onClose }) {
  const tarifaChofer = useMockStore((s) => s.tarifaChofer)
  const setTarifaChofer = useMockStore((s) => s.setTarifaChofer)
  const [valor, setValor] = useState(String(tarifaChofer))

  return (
    <Modal open={open} title="Configurar chofer" onClose={onClose}>
      <div className="space-y-3">
        <Input label="Tarifa por hora de chofer (€)" type="number" value={valor} onChange={(e) => setValor(e.target.value)} />
        <Button variant="primary" onClick={() => { setTarifaChofer(parseFloat(valor) || 0); onClose() }}>GUARDAR</Button>
        <p className="text-[10px] text-gray-400 text-center">
          Se copia a cada chofer del día al asignarlo — no afecta a los ya registrados.
        </p>
      </div>
    </Modal>
  )
}
