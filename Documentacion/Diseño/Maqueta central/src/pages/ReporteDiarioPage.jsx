import { useState, useMemo, useEffect } from 'react'
import { Edit2, Check, X, Car, Trash2 } from 'lucide-react'

import Header        from '../components/layout/Header.jsx'
import HorizontalNav from '../components/layout/HorizontalNav.jsx'
import Card          from '../components/ui/Card.jsx'
import Input         from '../components/ui/Input.jsx'
import SectionTitle  from '../components/ui/SectionTitle.jsx'
import Button        from '../components/ui/Button.jsx'
import Modal         from '../components/ui/Modal.jsx'

import { useMockStore } from '../store/mockStore.js'

/**
 * ReporteDiarioPage — MAQUETA.
 * Cambio 1: cada fila muestra una etiqueta "Chófer" cuando ese empleado fue
 * quien manejó la furgoneta del grupo ese día.
 * Cambio 2: cada grupo tiene UN solo botón de basura (sin duplicados). Al
 * tocarlo solo habilita el modo de selección — no borra nada por sí solo.
 * Aparecen checkboxes en cada fila (menos en las ya liquidadas) y recién
 * ahí aparece "ELIMINAR SELECCIONADOS", para elegir exactamente a quién
 * sacar, nunca borrar el grupo entero de un golpe.
 */
export default function ReporteDiarioPage() {
  const jornadas = useMockStore((s) => s.jornadas)
  const trabajadores = useMockStore((s) => s.trabajadores)
  const vehiculos = useMockStore((s) => s.vehiculos)
  const editarJornada = useMockStore((s) => s.editarJornada)
  const eliminarJornadas = useMockStore((s) => s.eliminarJornadas)

  const hoy = () => new Date().toISOString().slice(0, 10)

  const [fecha, setFecha] = useState(hoy())
  const [editandoId, setEditandoId] = useState(null)
  const [edit, setEdit] = useState({ horas: '', destajo: '' })

  // Modo de selección — solo un grupo a la vez puede estar "en selección"
  // (se identifica por su key). Los checkboxes solo aparecen en ese grupo.
  const [grupoSeleccionKey, setGrupoSeleccionKey] = useState(null)
  const [seleccion, setSeleccion] = useState(new Set())
  const [confirmarBorrado, setConfirmarBorrado] = useState(false)

  // Cambiar de fecha cierra cualquier selección/confirmación en curso.
  useEffect(() => { setGrupoSeleccionKey(null); setSeleccion(new Set()) }, [fecha])

  const toggleModoSeleccion = (key) => {
    setGrupoSeleccionKey((actual) => (actual === key ? null : key))
    setSeleccion(new Set())
  }
  const toggleFila = (id) => setSeleccion((prev) => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })

  // Fallback con el mismo texto que usa el sistema real cuando el
  // encargado/vehículo de una jornada vieja ya fue dado de baja.
  const trabajadorInfo = (id) => {
    const t = trabajadores.find((x) => x.id === id)
    return t ? { id: t.id, nombre: `${t.nombre} ${t.apellido}` } : { id: null, nombre: 'Encargado despedido' }
  }
  const vehiculoInfo = (id) => {
    const v = vehiculos.find((x) => x.id === id)
    return v ? v : { id: null, nombre: 'Vehículo dado de baja' }
  }

  const grupos = useMemo(() => {
    const delDia = jornadas.filter((j) => j.fecha === fecha)
    const map = {}
    delDia.forEach((j) => {
      const key = j.origen === 'central' ? 'central' : `${j.encargado_id ?? 's/e'}-${j.vehiculo_id ?? 's/v'}`
      if (!map[key]) {
        map[key] = j.origen === 'central'
          ? { key, encargado: { id: null, nombre: 'Registrado por Central' }, vehiculo: null, empleados: [], esCentral: true }
          : { key, encargado: trabajadorInfo(j.encargado_id), vehiculo: vehiculoInfo(j.vehiculo_id), empleados: [], esCentral: false }
      }
      map[key].empleados.push(j)
    })
    return Object.values(map)
  }, [jornadas, fecha, trabajadores, vehiculos])

  const guardar = (id) => {
    editarJornada(id, { horas: parseFloat(edit.horas) || 0, destajo: parseFloat(edit.destajo) || 0 })
    setEditandoId(null)
  }

  const grupoEnSeleccion = grupos.find((g) => g.key === grupoSeleccionKey)
  const nombresSeleccionados = useMemo(() => {
    if (!grupoEnSeleccion) return []
    return grupoEnSeleccion.empleados
      .filter((emp) => seleccion.has(emp.id))
      .map((emp) => trabajadores.find((t) => t.id === emp.empleado_id))
      .map((t) => t ? `${t.nombre} ${t.apellido}` : '—')
  }, [grupoEnSeleccion, seleccion, trabajadores])

  const confirmarEliminar = () => {
    eliminarJornadas([...seleccion])
    setSeleccion(new Set())
    setGrupoSeleccionKey(null)
    setConfirmarBorrado(false)
  }

  return (
    <div className="min-h-screen bg-app-bg">
      <Header rightLabel="Salir" />
      <HorizontalNav />

      <div className="px-4 pt-4 pb-6 max-w-md mx-auto space-y-4">
        <Card>
          <SectionTitle color="gold">Reporte Diario</SectionTitle>
          <Input label="Fecha" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
        </Card>

        <div className="space-y-3">
          {grupos.length === 0 ? (
            <Card>
              <SectionTitle color="green">Jornadas registradas</SectionTitle>
              <p className="text-gray-400 text-xs text-center py-8">Sin datos para esta fecha.</p>
            </Card>
          ) : grupos.map((grupo) => {
            const enSeleccion = grupoSeleccionKey === grupo.key
            return (
              <div key={grupo.key} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="bg-navy-dark p-3 text-white flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-sm">Encargado: {grupo.encargado?.nombre ?? '—'}</p>
                    <p className="text-xs text-gray-300">Vehículo: {grupo.vehiculo?.nombre ?? '—'}</p>
                  </div>
                  {/* Un solo botón por grupo — solo activa/desactiva el
                      modo de selección; nunca borra nada por sí solo. */}
                  <button
                    onClick={() => toggleModoSeleccion(grupo.key)}
                    className={`shrink-0 active:scale-90 transition-transform duration-150 ${enSeleccion ? 'text-danger' : 'text-gray-300 hover:text-danger'}`}
                    title={enSeleccion ? 'Cancelar selección' : 'Elegir registros a eliminar'}
                  >
                    {enSeleccion ? <X className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
                <div className="p-3 space-y-2">
                  <div className="grid grid-cols-[1fr_3rem_4rem_2rem] gap-3 items-center pb-1 border-b border-gray-200 text-[10px] font-semibold text-gray-400 uppercase">
                    <span>Empleados</span><span className="text-right">Horas</span>
                    <span className="text-right border-l border-gray-300 pl-2">Destajo</span><span />
                  </div>
                  {grupo.empleados.map((emp) => {
                    const t = trabajadores.find((x) => x.id === emp.empleado_id)
                    const editing = editandoId === emp.id
                    return (
                      <div key={emp.id} className="grid grid-cols-[1fr_3rem_4rem_2rem] gap-3 items-center border-b border-gray-100 py-1.5 text-sm">
                        <span className="min-w-0 flex items-center gap-2">
                          {/* Solo visible tras activar el modo de selección
                              de ESTE grupo — elegir exactamente a quién
                              eliminar, nunca "todos de un golpe". No
                              aparece si ya se liquidó. */}
                          {enSeleccion && !emp.fue_liquidado && (
                            <input
                              type="checkbox"
                              checked={seleccion.has(emp.id)}
                              onChange={() => toggleFila(emp.id)}
                              className="shrink-0 w-3.5 h-3.5 accent-danger"
                            />
                          )}
                          <span className="min-w-0">
                            <span className={`truncate block ${emp.fue_liquidado ? 'text-gray-400' : 'text-navy-dark'}`}>{t?.nombre} {t?.apellido}</span>
                            <span className="flex items-center gap-1 flex-wrap">
                              {emp.fue_liquidado && <span className="text-[9px] font-semibold text-primary uppercase">Pagado</span>}
                              {emp.chofer && (
                                <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-gold uppercase bg-gold/10 px-1.5 py-0.5 rounded-full">
                                  <Car className="w-2.5 h-2.5" /> Chófer
                                </span>
                              )}
                            </span>
                          </span>
                        </span>

                        {editing ? (
                          <input type="number" autoFocus value={edit.horas} onChange={(e) => setEdit({ ...edit, horas: e.target.value })}
                            className="w-full px-1 py-0.5 bg-gray-50 border border-gray-200 rounded text-xs text-center" />
                        ) : (
                          <span className={`text-right text-xs ${emp.fue_liquidado ? 'text-gray-400' : 'text-gray-600'}`}>{emp.horas}h</span>
                        )}

                        {editing ? (
                          <input type="number" value={edit.destajo} onChange={(e) => setEdit({ ...edit, destajo: e.target.value })}
                            className="w-full px-1 py-0.5 bg-gray-50 border border-gray-200 rounded text-xs text-center" />
                        ) : (
                          <span className={`text-right text-xs border-l border-gray-300 pl-2 ${emp.fue_liquidado ? 'text-gray-400' : 'text-gray-600'}`}>€{emp.destajo}</span>
                        )}

                        {emp.fue_liquidado ? (
                          <span className="flex justify-end text-primary"><Check className="w-3.5 h-3.5" /></span>
                        ) : editing ? (
                          <div className="flex items-center justify-end -mr-1.5">
                            <button onClick={() => guardar(emp.id)} className="p-1.5 text-primary active:scale-90"><Check className="w-3.5 h-3.5" /></button>
                            <button onClick={() => setEditandoId(null)} className="p-1.5 text-gray-400 active:scale-90"><X className="w-3.5 h-3.5" /></button>
                          </div>
                        ) : (
                          <button
                            onClick={() => { setEditandoId(emp.id); setEdit({ horas: String(emp.horas), destajo: String(emp.destajo) }) }}
                            className="flex justify-end p-1.5 -mr-1.5 text-gray-300 hover:text-navy-dark active:scale-90"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )
                  })}

                  {/* Solo aparece si hay al menos un checkbox marcado en
                      ESTE grupo — elimina exactamente los elegidos, nunca
                      todo el grupo. */}
                  {enSeleccion && seleccion.size > 0 && (
                    <Button
                      variant="outline"
                      icon={<Trash2 className="w-3.5 h-3.5" />}
                      className="!border-danger !text-danger hover:!bg-danger hover:!text-white !mt-2 !py-2 !text-xs"
                      onClick={() => setConfirmarBorrado(true)}
                    >
                      ELIMINAR SELECCIONADOS ({seleccion.size})
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Confirmar eliminación de filas seleccionadas (cualquier grupo) ── */}
      <Modal open={confirmarBorrado} title="Eliminar registros seleccionados" onClose={() => setConfirmarBorrado(false)}>
        <div className="space-y-4">
          <p className="text-sm text-navy-dark">
            Se eliminarán <strong>{seleccion.size}</strong> registro(s) del <strong>{fecha}</strong>:
          </p>
          <ul className="text-xs list-disc list-inside space-y-0.5 text-gray-600 max-h-32 overflow-y-auto">
            {nombresSeleccionados.map((n, i) => <li key={i}>{n}</li>)}
          </ul>
          <p className="text-xs text-gray-500">Esta acción no se puede deshacer.</p>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={() => setConfirmarBorrado(false)}>CANCELAR</Button>
            <Button variant="outline" className="!border-danger !text-danger hover:!bg-danger hover:!text-white" onClick={confirmarEliminar}>
              ELIMINAR
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
