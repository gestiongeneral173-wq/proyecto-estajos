import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Edit2, X, Check, TrendingDown, Wallet, ChevronDown, ChevronUp, UserX, Trash2 } from 'lucide-react'

import Header        from '../components/layout/Header.jsx'
import HorizontalNav from '../components/layout/HorizontalNav.jsx'
import Card          from '../components/ui/Card.jsx'
import Button        from '../components/ui/Button.jsx'
import Input         from '../components/ui/Input.jsx'
import SectionTitle  from '../components/ui/SectionTitle.jsx'
import Badge         from '../components/ui/Badge.jsx'
import Modal         from '../components/ui/Modal.jsx'

import { useMockStore, getPendientesEmpleado, getBalanceEmpleado } from '../store/mockStore.js'
import { Direccion } from '../utils/constants.js'

function StatBox({ label, value, color = 'navy' }) {
  const map = { navy: 'text-navy-dark', green: 'text-primary', danger: 'text-danger', gold: 'text-gold' }
  return (
    <div className="bg-gray-50 rounded-xl p-3 text-center">
      <p className="text-[9px] font-semibold text-gray-400 uppercase mb-1">{label}</p>
      <p className={`font-bold text-sm ${map[color]}`}>{value}</p>
    </div>
  )
}

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

export default function TrabajadorDetallePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const trabajadores = useMockStore((s) => s.trabajadores)
  const pagos = useMockStore((s) => s.pagos)
  const actualizarTrabajador = useMockStore((s) => s.actualizarTrabajador)
  const toggleEncargado = useMockStore((s) => s.toggleEncargado)
  const registrarAdelanto = useMockStore((s) => s.registrarAdelanto)
  const editarAdelanto = useMockStore((s) => s.editarAdelanto)
  const eliminarAdelanto = useMockStore((s) => s.eliminarAdelanto)
  const editarJornada = useMockStore((s) => s.editarJornada)
  const darDeBajaTrabajador = useMockStore((s) => s.darDeBajaTrabajador)
  const state = useMockStore()

  const trabajador = trabajadores.find((t) => t.id === id)

  const [editando, setEditando] = useState(false)
  const [formEdit, setFormEdit] = useState(trabajador ? { ...trabajador } : {})
  const [montoAdelanto, setMontoAdelanto] = useState('')
  const [editandoAdelantoId, setEditandoAdelantoId] = useState(null)
  const [montoAdelantoEdit, setMontoAdelantoEdit] = useState('')
  const [confirmAccion, setConfirmAccion] = useState(null)
  const [editandoJornadaId, setEditandoJornadaId] = useState(null)
  const [jornadaEdit, setJornadaEdit] = useState({ horas: '', destajo: '' })
  const [bajaAbierta, setBajaAbierta] = useState(false)

  if (!trabajador) {
    return (
      <div className="min-h-screen bg-app-bg">
        <Header rightLabel="Salir" />
        <HorizontalNav />
        <div className="px-4 pt-8 max-w-md mx-auto">
          <Card>
            <p className="text-danger text-xs text-center py-4">Trabajador no encontrado.</p>
            <Button variant="outline" icon={<ArrowLeft className="w-4 h-4" />} onClick={() => navigate(Direccion.CentralTrabajadores)}>
              VOLVER A REGISTROS
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  const pend = getPendientesEmpleado(state, id)
  const balance = getBalanceEmpleado(state, id)
  const pagosTrabajador = pagos.filter((p) => p.empleado_id === id)
  const fmtEur = (v) => `€${Number(v ?? 0).toFixed(2)}`

  const bajaCalculo = { total_devengado: pend.totalDevengado, total_adelantos: pend.totalAdelantos, monto_neto: balance }

  return (
    <div className="min-h-screen bg-app-bg">
      <Header rightLabel="Salir" />
      <HorizontalNav />

      <div className="px-4 pt-4 pb-6 max-w-md mx-auto space-y-4">
        <button onClick={() => navigate(Direccion.CentralTrabajadores)} className="flex items-center gap-2 text-gray-500 hover:text-navy-dark text-xs font-semibold">
          <ArrowLeft className="w-4 h-4" /> Volver a Registros
        </button>

        <Card>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-navy-dark font-bold text-base">{trabajador.nombre} {trabajador.apellido}</h2>
                <Badge variant={trabajador.payment_period} />
              </div>
              <p className="text-gray-500 text-xs mt-1">{trabajador.telefono}</p>
              <p className="text-gray-400 text-[10px] mt-0.5">Cuenta: {trabajador.cuenta || 'sin registrar'}</p>
            </div>
            <button onClick={() => { setFormEdit({ ...trabajador }); setEditando((e) => !e) }} className="ml-3 p-2 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100">
              {editando ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
            </button>
          </div>

          <div className={`rounded-xl p-4 mb-4 ${balance >= 0 ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100' : 'bg-gradient-to-r from-red-50 to-rose-50 border border-red-100'}`}>
            <p className="text-[10px] font-semibold uppercase text-gray-400 mb-1">Saldo neto</p>
            <p className={`font-bold text-2xl ${balance >= 0 ? 'text-primary' : 'text-danger'}`}>{fmtEur(balance)}</p>
          </div>

          <StatBox label="Tarifa/hora" value={fmtEur(trabajador.tarifa_hora)} />
        </Card>

        {editando && (
          <Card>
            <SectionTitle color="gold">Editar datos</SectionTitle>
            <div className="space-y-3">
              <Input label="Nombre" value={formEdit.nombre} onChange={(e) => setFormEdit({ ...formEdit, nombre: e.target.value })} />
              <Input label="Apellido" value={formEdit.apellido} onChange={(e) => setFormEdit({ ...formEdit, apellido: e.target.value })} />
              <Input label="Teléfono" value={formEdit.telefono} onChange={(e) => setFormEdit({ ...formEdit, telefono: e.target.value })} />
              <Input label="Cuenta bancaria" value={formEdit.cuenta} onChange={(e) => setFormEdit({ ...formEdit, cuenta: e.target.value })} />
              <div>
                <label className="label-base">Tipo de ciclo</label>
                <select value={formEdit.payment_period} onChange={(e) => setFormEdit({ ...formEdit, payment_period: e.target.value })} className="input-base">
                  <option value="mensual">Mensual</option>
                  <option value="quincenal">Quincenal</option>
                </select>
              </div>
              <Input label="Tarifa/hora (€)" type="number" value={formEdit.tarifa_hora} onChange={(e) => setFormEdit({ ...formEdit, tarifa_hora: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={() => setEditando(false)}>CANCELAR</Button>
                <Button variant="primary" onClick={() => { actualizarTrabajador(id, formEdit); setEditando(false) }}>GUARDAR</Button>
              </div>
            </div>
          </Card>
        )}

        <Card>
          <SectionTitle color="gold">Rol de Encargado</SectionTitle>
          <div className="flex items-center justify-between">
            <div className="min-w-0 pr-3">
              <p className="text-xs font-semibold text-navy-dark">{trabajador.es_encargado ? 'Es encargado' : 'No es encargado'}</p>
              <p className="text-[10px] text-gray-400">Aplica en su próximo inicio de sesión.</p>
            </div>
            <button
              type="button" role="switch" aria-checked={!!trabajador.es_encargado} onClick={() => toggleEncargado(id)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${trabajador.es_encargado ? 'bg-primary' : 'bg-gray-300'}`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${trabajador.es_encargado ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </Card>

        <Card>
          <SectionTitle color="green">Dar adelanto</SectionTitle>
          <div className="flex gap-2">
            <Input type="number" placeholder="Monto (€)" value={montoAdelanto} onChange={(e) => setMontoAdelanto(e.target.value)} className="flex-1" />
            <Button variant="primary" className="w-auto px-4" disabled={!montoAdelanto}
              onClick={() => { registrarAdelanto(id, parseFloat(montoAdelanto) || 0); setMontoAdelanto('') }}>
              DAR
            </Button>
          </div>
        </Card>

        <Collapsible title={`Adelantos (${pend.adelantos.length})`} color="gold" defaultOpen={pend.adelantos.length > 0}>
          {pend.adelantos.length === 0 ? (
            <p className="text-gray-400 text-xs text-center py-4">Sin adelantos.</p>
          ) : (
            <div className="space-y-2">
              {pend.adelantos.map((a) => (
                <div key={a.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-3 h-3 text-danger" />
                    <p className="text-xs text-gray-500">{a.fecha}</p>
                  </div>
                  {editandoAdelantoId === a.id ? (
                    <div className="flex items-center gap-1">
                      <input type="number" autoFocus value={montoAdelantoEdit} onChange={(e) => setMontoAdelantoEdit(e.target.value)}
                        className="w-16 px-1 py-0.5 bg-gray-50 border border-gray-200 rounded text-xs text-right" />
                      <button onClick={() => setConfirmAccion({ tipo: 'editar', id: a.id, monto: parseFloat(montoAdelantoEdit) || 0 })} className="text-primary"><Check className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setEditandoAdelantoId(null)} className="text-gray-400"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-danger">{fmtEur(a.monto)}</p>
                      <button onClick={() => { setEditandoAdelantoId(a.id); setMontoAdelantoEdit(String(a.monto)) }} className="text-gray-400 hover:text-navy-dark"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setConfirmAccion({ tipo: 'eliminar', id: a.id })} className="text-gray-400 hover:text-danger"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Collapsible>

        <Collapsible title={`Nómina Actual (${pend.jornadas.length})`} color="green">
          {pend.jornadas.length === 0 ? (
            <p className="text-gray-400 text-xs text-center py-4">Sin jornadas.</p>
          ) : (
            <div className="space-y-1">
              <div className="grid grid-cols-6 gap-1 pb-2 border-b border-gray-100">
                {['Fecha', 'Horas', 'Destajo', 'Tarifa', 'Subtotal', ''].map((h, i) => (
                  <p key={i} className="text-[9px] font-semibold text-gray-400 uppercase text-center first:text-left">{h}</p>
                ))}
              </div>
              {pend.jornadas.map((j) => {
                const editing = editandoJornadaId === j.id
                const subtotal = j.horas * j.tarifa + Number(j.destajo)
                return (
                  <div key={j.id} className="grid grid-cols-6 gap-1 py-1.5 border-b border-gray-50 last:border-0 items-center">
                    <p className="text-[10px] text-navy-dark">{j.fecha}</p>
                    {editing ? (
                      <input type="number" autoFocus value={jornadaEdit.horas} onChange={(e) => setJornadaEdit({ ...jornadaEdit, horas: e.target.value })}
                        className="w-full px-1 py-0.5 bg-gray-50 border border-gray-200 rounded text-[10px] text-center" />
                    ) : <p className="text-[10px] text-center text-navy-dark">{j.horas}</p>}
                    {editing ? (
                      <input type="number" value={jornadaEdit.destajo} onChange={(e) => setJornadaEdit({ ...jornadaEdit, destajo: e.target.value })}
                        className="w-full px-1 py-0.5 bg-gray-50 border border-gray-200 rounded text-[10px] text-center" />
                    ) : <p className="text-[10px] text-center text-navy-dark">{fmtEur(j.destajo)}</p>}
                    <p className="text-[10px] text-center text-gray-400">{fmtEur(j.tarifa)}/h</p>
                    <p className="text-[10px] text-right font-semibold text-navy-dark">{fmtEur(subtotal)}</p>
                    {editing ? (
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => { editarJornada(j.id, { horas: parseFloat(jornadaEdit.horas) || 0, destajo: parseFloat(jornadaEdit.destajo) || 0 }); setEditandoJornadaId(null) }} className="text-primary"><Check className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setEditandoJornadaId(null)} className="text-gray-400"><X className="w-3.5 h-3.5" /></button>
                      </div>
                    ) : (
                      <button onClick={() => { setEditandoJornadaId(j.id); setJornadaEdit({ horas: String(j.horas), destajo: String(j.destajo) }) }} className="flex justify-end text-gray-400 hover:text-navy-dark">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </Collapsible>

        <Collapsible title={`Nóminas Anteriores (${pagosTrabajador.length})`} color="green">
          {pagosTrabajador.length === 0 ? (
            <p className="text-gray-400 text-xs text-center py-4">Sin pagos registrados.</p>
          ) : (
            <div className="space-y-2">
              {pagosTrabajador.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-xs text-navy-dark font-semibold">{p.created_at}</p>
                    <p className="text-[10px] text-gray-400">{p.periodo_inicio} – {p.periodo_fin}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wallet className="w-3 h-3 text-primary" />
                    <p className="text-xs font-bold text-primary">{fmtEur(p.total_pagado)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Collapsible>

        <Card>
          <SectionTitle color="gold">Dar de baja</SectionTitle>
          <p className="text-gray-400 text-[10px] mb-3">Calcula lo que se le debe, liquida ese monto y retira al trabajador de forma permanente.</p>
          <Button variant="outline" icon={<UserX className="w-4 h-4" />} className="!border-danger !text-danger hover:!bg-danger hover:!text-white" onClick={() => setBajaAbierta(true)}>
            DAR DE BAJA
          </Button>
        </Card>
      </div>

      <Modal open={!!confirmAccion} title={confirmAccion?.tipo === 'editar' ? 'Confirmar edición' : 'Confirmar eliminación'} onClose={() => setConfirmAccion(null)}>
        <div className="space-y-4">
          <p className="text-gray-600 text-sm">
            {confirmAccion?.tipo === 'editar' ? `¿Actualizar el monto de este adelanto a ${fmtEur(confirmAccion?.monto ?? 0)}?` : '¿Eliminar este adelanto? Esta acción no se puede deshacer.'}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={() => setConfirmAccion(null)}>CANCELAR</Button>
            <Button variant="primary" onClick={() => {
              if (confirmAccion.tipo === 'editar') { editarAdelanto(confirmAccion.id, confirmAccion.monto); setEditandoAdelantoId(null) }
              else eliminarAdelanto(confirmAccion.id)
              setConfirmAccion(null)
            }}>CONFIRMAR</Button>
          </div>
        </div>
      </Modal>

      <Modal open={bajaAbierta} title="Confirmar baja" onClose={() => setBajaAbierta(false)}>
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-3 space-y-1 text-xs">
            <div className="flex justify-between"><span className="text-gray-500">Devengado</span><span className="font-semibold text-navy-dark">{fmtEur(bajaCalculo.total_devengado)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Adelantos</span><span className="font-semibold text-danger">−{fmtEur(bajaCalculo.total_adelantos)}</span></div>
            <div className="flex justify-between pt-1 border-t border-gray-200"><span className="text-gray-700 font-semibold">Neto a liquidar</span><span className={`font-bold ${bajaCalculo.monto_neto < 0 ? 'text-danger' : 'text-primary'}`}>{fmtEur(bajaCalculo.monto_neto)}</span></div>
          </div>
          <p className="text-gray-600 text-sm">¿Seguro que deseas dar de baja a <strong>{trabajador.nombre} {trabajador.apellido}</strong>?</p>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={() => setBajaAbierta(false)}>CANCELAR</Button>
            <Button variant="outline" className="!border-danger !text-danger hover:!bg-danger hover:!text-white"
              onClick={() => { darDeBajaTrabajador(id); navigate(Direccion.CentralTrabajadores) }}>
              SÍ, DAR DE BAJA
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
