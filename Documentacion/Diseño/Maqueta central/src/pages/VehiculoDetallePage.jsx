import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Edit2, X, Check, Trash2, Plus, ChevronDown, ChevronUp, UserX } from 'lucide-react'

import Header        from '../components/layout/Header.jsx'
import HorizontalNav from '../components/layout/HorizontalNav.jsx'
import Card          from '../components/ui/Card.jsx'
import Button        from '../components/ui/Button.jsx'
import Input         from '../components/ui/Input.jsx'
import Modal         from '../components/ui/Modal.jsx'
import SectionTitle  from '../components/ui/SectionTitle.jsx'

import { useMockStore, getPendientesVehiculo } from '../store/mockStore.js'
import { Direccion } from '../utils/constants.js'

function Collapsible({ title, color = 'green', children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <Card>
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between">
        <SectionTitle color={color} className="mb-0">{title}</SectionTitle>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {open && <div className="mt-4">{children}</div>}
    </Card>
  )
}

export default function VehiculoDetallePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const vehiculos = useMockStore((s) => s.vehiculos)
  const pagosVehiculo = useMockStore((s) => s.pagosVehiculo)
  const actualizarVehiculo = useMockStore((s) => s.actualizarVehiculo)
  const registrarAdelantoVehiculo = useMockStore((s) => s.registrarAdelantoVehiculo)
  const editarAdelantoVehiculo = useMockStore((s) => s.editarAdelantoVehiculo)
  const eliminarAdelantoVehiculo = useMockStore((s) => s.eliminarAdelantoVehiculo)
  const editarPlazasDia = useMockStore((s) => s.editarPlazasDia)
  const darDeBajaVehiculo = useMockStore((s) => s.darDeBajaVehiculo)
  const pagarVehiculo = useMockStore((s) => s.pagarVehiculo)
  const state = useMockStore()

  const vehiculo = vehiculos.find((v) => v.id === id)

  const [editando, setEditando] = useState(false)
  const [formEdit, setFormEdit] = useState(vehiculo ? { ...vehiculo } : {})
  const [formAdelanto, setFormAdelanto] = useState({ concepto: '', monto: '' })
  const [editandoAdelantoId, setEditandoAdelantoId] = useState(null)
  const [montoAdelantoEdit, setMontoAdelantoEdit] = useState('')
  const [confirmAccion, setConfirmAccion] = useState(null)
  const [editandoDiaId, setEditandoDiaId] = useState(null)
  const [plazasEdit, setPlazasEdit] = useState('')
  const [bajaAbierta, setBajaAbierta] = useState(false)
  const [pagarAbierto, setPagarAbierto] = useState(false)

  if (!vehiculo) {
    return (
      <div className="min-h-screen bg-app-bg">
        <Header rightLabel="Salir" />
        <HorizontalNav />
        <div className="px-4 pt-8 max-w-md mx-auto">
          <Card>
            <p className="text-danger text-xs text-center mb-4">Vehículo no encontrado.</p>
            <Button variant="outline" icon={<ArrowLeft className="w-4 h-4" />} onClick={() => navigate(Direccion.CentralVehiculos)}>VOLVER A VEHÍCULOS</Button>
          </Card>
        </div>
      </div>
    )
  }

  const pend = getPendientesVehiculo(state, id)
  const pagos = pagosVehiculo.filter((p) => p.vehiculo_id === id)

  return (
    <div className="min-h-screen bg-app-bg">
      <Header rightLabel="Salir" />
      <HorizontalNav />

      <div className="px-4 pt-4 pb-6 max-w-md mx-auto space-y-4">
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <button onClick={() => navigate(Direccion.CentralVehiculos)} className="text-gray-500 hover:text-navy-dark"><ArrowLeft className="w-4 h-4" /></button>
            <div className="flex-1">
              <h1 className="text-navy-dark font-bold text-sm">{vehiculo.nombre}</h1>
              <p className="text-gray-500 text-[10px]">{vehiculo.matricula ?? '—'}</p>
            </div>
            <button onClick={() => { setFormEdit({ ...vehiculo }); setEditando((e) => !e) }} className="ml-3 p-2 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100">
              {editando ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
            </button>
          </div>
          {/* Cambio: sin PIN — las furgonetas ya no se controlan con
              código, solo se registran. */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-gray-500 text-[10px] uppercase">Tarifa/Plaza</p>
              <p className="text-navy-dark font-bold">€{vehiculo.tarifa_plaza}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-gray-500 text-[10px] uppercase">Tipo de Ciclo</p>
              <p className="text-navy-dark font-bold text-xs">Quincenal</p>
            </div>
          </div>
        </Card>

        {editando && (
          <Card>
            <SectionTitle color="gold">Editar datos</SectionTitle>
            <p className="text-[10px] text-gray-400 mb-3 -mt-2">Los cambios aplican a futuras jornadas; el histórico ya registrado no se altera.</p>
            <div className="space-y-3">
              <Input label="Nombre" value={formEdit.nombre} onChange={(e) => setFormEdit({ ...formEdit, nombre: e.target.value })} />
              <Input label="Matrícula" value={formEdit.matricula ?? ''} onChange={(e) => setFormEdit({ ...formEdit, matricula: e.target.value })} />
              <Input label="Plazas totales" type="number" value={formEdit.plazas_totales} onChange={(e) => setFormEdit({ ...formEdit, plazas_totales: e.target.value })} />
              <Input label="Tarifa por plaza (€)" type="number" value={formEdit.tarifa_plaza} onChange={(e) => setFormEdit({ ...formEdit, tarifa_plaza: e.target.value })} />
              <Input label="Propietario" value={formEdit.propietario ?? ''} onChange={(e) => setFormEdit({ ...formEdit, propietario: e.target.value })} />
              <p className="text-[10px] text-gray-400">Tipo de ciclo: Quincenal (fijo, no editable).</p>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={() => setEditando(false)}>CANCELAR</Button>
                <Button variant="primary" onClick={() => { actualizarVehiculo(id, formEdit); setEditando(false) }}>GUARDAR</Button>
              </div>
            </div>
          </Card>
        )}

        <Collapsible title={`Adelantos (${pend.adelantos.length})`} color="gold" defaultOpen={pend.adelantos.length > 0}>
          <div className="bg-gray-50 rounded-xl p-3 space-y-3 mb-4">
            <Input label="Concepto (opcional)" placeholder="Ej: reparación" value={formAdelanto.concepto} onChange={(e) => setFormAdelanto({ ...formAdelanto, concepto: e.target.value })} />
            <Input label="Monto (€)" type="number" value={formAdelanto.monto} onChange={(e) => setFormAdelanto({ ...formAdelanto, monto: e.target.value })} />
            <Button variant="primary" icon={<Plus className="w-4 h-4" />} disabled={!formAdelanto.monto}
              onClick={() => { registrarAdelantoVehiculo(id, formAdelanto.concepto, parseFloat(formAdelanto.monto) || 0); setFormAdelanto({ concepto: '', monto: '' }) }}>
              AÑADIR ADELANTO
            </Button>
          </div>
          {pend.adelantos.length === 0 ? (
            <p className="text-gray-400 text-xs text-center py-4">Sin adelantos pendientes.</p>
          ) : (
            <div className="space-y-2">
              {pend.adelantos.map((a) => (
                <div key={a.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <p className="text-xs text-navy-dark truncate flex-1">{a.concepto || '—'}</p>
                  {editandoAdelantoId === a.id ? (
                    <div className="flex items-center gap-1">
                      <input type="number" autoFocus value={montoAdelantoEdit} onChange={(e) => setMontoAdelantoEdit(e.target.value)}
                        className="w-16 px-1 py-0.5 bg-gray-50 border border-gray-200 rounded text-xs text-right" />
                      <button onClick={() => setConfirmAccion({ tipo: 'editar', id: a.id, monto: parseFloat(montoAdelantoEdit) || 0 })} className="text-primary"><Check className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setEditandoAdelantoId(null)} className="text-gray-400"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-danger">€{Number(a.monto).toFixed(2)}</p>
                      <button onClick={() => { setEditandoAdelantoId(a.id); setMontoAdelantoEdit(String(a.monto)) }} className="text-gray-400 hover:text-navy-dark"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setConfirmAccion({ tipo: 'eliminar', id: a.id })} className="text-gray-400 hover:text-danger"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Collapsible>

        <Collapsible title={`Nómina Actual (${pend.dias.length})`} color="green" defaultOpen={pend.dias.length > 0}>
          {pend.dias.length === 0 ? (
            <p className="text-gray-400 text-xs text-center py-8">Sin registros para el período actual</p>
          ) : (
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="grid grid-cols-4 gap-2 bg-gray-50 p-2 text-[10px] font-semibold text-gray-500 uppercase">
                <span>Fecha</span><span>Plazas</span><span className="text-right">Total</span><span></span>
              </div>
              {pend.dias.map((d) => (
                <div key={d.id} className="grid grid-cols-4 gap-2 p-2 border-t border-gray-100 text-xs text-navy-dark items-center">
                  <span>{d.fecha}</span>
                  {editandoDiaId === d.id ? (
                    <input type="number" autoFocus value={plazasEdit} onChange={(e) => setPlazasEdit(e.target.value)} className="w-14 px-1 py-0.5 bg-gray-50 border border-gray-200 rounded text-xs" />
                  ) : <span>{d.plazas}</span>}
                  <span className="text-right font-semibold">€{(d.plazas * d.tarifa_aplicada).toFixed(2)}</span>
                  {editandoDiaId === d.id ? (
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => { editarPlazasDia(d.id, parseInt(plazasEdit, 10) || 0); setEditandoDiaId(null) }} className="text-primary"><Check className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setEditandoDiaId(null)} className="text-gray-400"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  ) : (
                    <button onClick={() => { setEditandoDiaId(d.id); setPlazasEdit(String(d.plazas)) }} className="flex justify-end text-gray-400 hover:text-navy-dark"><Edit2 className="w-3.5 h-3.5" /></button>
                  )}
                </div>
              ))}
              <div className="grid grid-cols-4 gap-2 p-2 bg-primary/10 border-t border-gray-200 text-xs font-bold text-primary">
                <span className="col-span-2 text-right">SUBTOTAL:</span><span className="text-right">€{pend.totalDevengado.toFixed(2)}</span><span></span>
              </div>
            </div>
          )}
        </Collapsible>

        <Collapsible title={`Nóminas Anteriores (${pagos.length})`} color="gold" defaultOpen={pagos.length > 0}>
          {pagos.length === 0 ? (
            <p className="text-gray-400 text-xs text-center py-4">Sin pagos liquidados todavía.</p>
          ) : (
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="grid grid-cols-4 gap-1 bg-gray-50 p-2 text-[9px] font-semibold text-gray-500 uppercase">
                <span>Período</span><span className="text-right">Ganado</span><span className="text-right">Adelantos</span><span className="text-right">Pagado</span>
              </div>
              {pagos.map((p) => (
                <div key={p.id} className="grid grid-cols-4 gap-1 p-2 border-t border-gray-100 text-[10px] text-navy-dark items-center">
                  <span>{p.periodo_inicio} – {p.periodo_fin}</span>
                  <span className="text-right">€{Number(p.total_devengado).toFixed(2)}</span>
                  <span className="text-right text-danger">−€{Number(p.total_adelantos).toFixed(2)}</span>
                  <span className="text-right font-bold text-primary">€{Number(p.total_pagado).toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </Collapsible>

        <Card>
          <SectionTitle color="gold">Dar de baja</SectionTitle>
          <p className="text-gray-400 text-[10px] mb-3">Calcula lo que se le debe, liquida ese monto y retira la furgoneta de forma permanente.</p>
          <Button variant="outline" icon={<UserX className="w-4 h-4" />} className="!border-danger !text-danger hover:!bg-danger hover:!text-white" onClick={() => setBajaAbierta(true)}>
            DAR DE BAJA
          </Button>
        </Card>

        {pend.totalPagar !== 0 && (
          <div className="bg-gray-50 rounded-xl p-3 space-y-1 text-xs">
            <div className="flex justify-between"><span className="text-gray-500">Devengado</span><span className="font-semibold text-navy-dark">€{pend.totalDevengado.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Adelantos</span><span className="font-semibold text-danger">−€{pend.totalAdelantos.toFixed(2)}</span></div>
            <div className="flex justify-between pt-1 border-t border-gray-200"><span className="text-gray-700 font-semibold">Neto a pagar</span><span className={`font-bold ${pend.totalPagar < 0 ? 'text-danger' : 'text-primary'}`}>€{pend.totalPagar.toFixed(2)}</span></div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={() => navigate(Direccion.CentralVehiculos)}>VOLVER</Button>
          <Button variant="primary" disabled={pend.dias.length === 0 && pend.adelantos.length === 0} onClick={() => setPagarAbierto(true)}>PAGAR</Button>
        </div>
      </div>

      <Modal open={!!confirmAccion} title={confirmAccion?.tipo === 'editar' ? 'Confirmar edición' : 'Confirmar eliminación'} onClose={() => setConfirmAccion(null)}>
        <div className="space-y-4">
          <p className="text-gray-600 text-sm">
            {confirmAccion?.tipo === 'editar' ? `¿Actualizar el monto a €${Number(confirmAccion?.monto ?? 0).toFixed(2)}?` : '¿Eliminar este adelanto? Esta acción no se puede deshacer.'}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={() => setConfirmAccion(null)}>CANCELAR</Button>
            <Button variant="primary" onClick={() => {
              if (confirmAccion.tipo === 'editar') { editarAdelantoVehiculo(confirmAccion.id, confirmAccion.monto); setEditandoAdelantoId(null) }
              else eliminarAdelantoVehiculo(confirmAccion.id)
              setConfirmAccion(null)
            }}>CONFIRMAR</Button>
          </div>
        </div>
      </Modal>

      <Modal open={bajaAbierta} title="Confirmar baja" onClose={() => setBajaAbierta(false)}>
        <div className="space-y-4">
          <p className="text-gray-600 text-sm">¿Seguro que deseas dar de baja a <strong>{vehiculo.nombre}</strong>? Se liquidará lo pendiente y se borrará de forma permanente.</p>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={() => setBajaAbierta(false)}>CANCELAR</Button>
            <Button variant="outline" className="!border-danger !text-danger hover:!bg-danger hover:!text-white"
              onClick={() => { darDeBajaVehiculo(id); navigate(Direccion.CentralVehiculos) }}>
              SÍ, DAR DE BAJA
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={pagarAbierto} title="Confirmar pago" onClose={() => setPagarAbierto(false)}>
        <div className="space-y-4">
          <p className="text-gray-600 text-sm">¿Liquidar el ciclo quincenal de <strong>{vehiculo.nombre}</strong>?</p>
          <div className="bg-gray-50 rounded-xl p-3 space-y-1 text-xs">
            <div className="flex justify-between"><span className="text-gray-500">Devengado</span><span className="font-semibold text-navy-dark">€{pend.totalDevengado.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Adelantos</span><span className="font-semibold text-danger">−€{pend.totalAdelantos.toFixed(2)}</span></div>
            <div className="flex justify-between pt-1 border-t border-gray-200"><span className="text-gray-700 font-semibold">Neto a pagar</span><span className="font-bold text-primary">€{pend.totalPagar.toFixed(2)}</span></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={() => setPagarAbierto(false)}>CANCELAR</Button>
            <Button variant="primary" onClick={() => { pagarVehiculo(id); setPagarAbierto(false) }}>CONFIRMAR PAGO</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
