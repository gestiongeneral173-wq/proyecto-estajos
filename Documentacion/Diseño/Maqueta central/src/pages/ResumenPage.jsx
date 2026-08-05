import { useState, useMemo } from 'react'
import { Printer, Search, Plus, X, Trash2, Truck, Users, Download, FileSpreadsheet } from 'lucide-react'
import * as XLSX from 'xlsx'

import Header        from '../components/layout/Header.jsx'
import HorizontalNav from '../components/layout/HorizontalNav.jsx'
import Card          from '../components/ui/Card.jsx'
import Button        from '../components/ui/Button.jsx'
import Input         from '../components/ui/Input.jsx'
import SectionTitle  from '../components/ui/SectionTitle.jsx'
import StatCard      from '../components/domain/StatCard.jsx'

import {
  useMockStore, getPendientesEmpleado, getPendientesVehiculo,
  CICLO_EMPLEADO, CICLO_FURGONETA,
} from '../store/mockStore.js'

const CICLO_BADGE = { quincenal: 'bg-purple-50 text-purple-600', mensual: 'bg-blue-50 text-blue-600' }

/**
 * ResumenPage — MAQUETA.
 * Cambio: el bloque de Furgonetas queda separado del de Empleados, cada
 * uno con su propia tarjeta "Ciclo de pago" (con exportar a Excel /
 * planilla), sin selector Quincenal/Mensual en furgonetas porque ya son
 * siempre quincenales. A diferencia de Empleados, Furgonetas NO tiene
 * "Lista de pago" ni historial de listas en Resumen — cada furgoneta se
 * sigue pagando individualmente desde el botón "Pagar" de su Detalle.
 */
export default function ResumenPage() {
  const trabajadores = useMockStore((s) => s.trabajadores)
  const vehiculos = useMockStore((s) => s.vehiculos)
  const choferes = useMockStore((s) => s.choferes)
  const pagarChofer = useMockStore((s) => s.pagarChofer)
  const state = useMockStore()

  const totalEmpleadosPorCiclo = (ciclo) =>
    trabajadores.filter((t) => t.payment_period === ciclo)
      .reduce((acc, t) => acc + getPendientesEmpleado(state, t.id).totalPagar, 0)

  const totalFurgonetas = vehiculos.reduce((acc, v) => acc + getPendientesVehiculo(state, v.id).totalPagar, 0)

  return (
    <div className="min-h-screen bg-app-bg">
      <Header rightLabel="Salir" />
      <HorizontalNav />

      <div className="px-4 pt-4 pb-6 max-w-md mx-auto space-y-4">

        <Card>
          <SectionTitle color="gold">Resumen General</SectionTitle>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className={`rounded-lg px-3 py-2 ${CICLO_BADGE.quincenal}`}>
              <p className="text-[9px] font-bold uppercase tracking-wide opacity-70">Quincenal</p>
              <p className="text-xs font-semibold">{CICLO_EMPLEADO.quincenal.label}</p>
            </div>
            <div className={`rounded-lg px-3 py-2 ${CICLO_BADGE.mensual}`}>
              <p className="text-[9px] font-bold uppercase tracking-wide opacity-70">Mensual</p>
              <p className="text-xs font-semibold">{CICLO_EMPLEADO.mensual.label}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <StatCard value={`€${totalEmpleadosPorCiclo('quincenal').toFixed(2)}`} label="Quincenales" color="gold" />
            <StatCard value={`€${totalEmpleadosPorCiclo('mensual').toFixed(2)}`} label="Mensuales" color="navy" />
          </div>
        </Card>

        <Card>
          <SectionTitle color="gold">Resumen Furgonetas</SectionTitle>
          <div className={`rounded-lg px-3 py-2 mb-3 ${CICLO_BADGE.quincenal}`}>
            <p className="text-[9px] font-bold uppercase tracking-wide opacity-70">Quincenal (único ciclo de furgonetas)</p>
            <p className="text-xs font-semibold">{CICLO_FURGONETA.quincenal.label}</p>
          </div>
          <StatCard value={`€${totalFurgonetas.toFixed(2)}`} label="Pendiente quincenal" color="gold" />
        </Card>

        <Card>
          <SectionTitle color="gold">Choferes</SectionTitle>
          {choferes.length === 0 ? (
            <p className="text-gray-400 text-xs text-center py-4">Sin pagos de chofer pendientes.</p>
          ) : (
            <div className="space-y-2">
              {choferes.map((c) => (
                <div key={c.empleado_id} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-xl">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-navy-dark truncate">{c.nombre}</p>
                    <p className="text-[10px] text-gray-400">{c.veces} {c.veces === 1 ? 'vez' : 'veces'} como chofer · €{Number(c.total).toFixed(2)}</p>
                  </div>
                  <Button variant="pill" active onClick={() => pagarChofer(c.empleado_id)}>PAGAR</Button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* ── Bloque Empleados ── */}
        <div className="flex items-center gap-2 pt-2">
          <Users className="w-3.5 h-3.5 text-navy-dark" />
          <p className="text-navy-dark font-bold text-xs uppercase tracking-wide">Empleados</p>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        <BloqueListaPago tipo="empleado" />

        {/* ── Bloque Furgonetas ── */}
        <div className="flex items-center gap-2 pt-2">
          <Truck className="w-3.5 h-3.5 text-navy-dark" />
          <p className="text-navy-dark font-bold text-xs uppercase tracking-wide">Furgonetas</p>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        <BloqueListaPago tipo="furgoneta" />
      </div>
    </div>
  )
}

/**
 * Bloque de "ciclo de pago + lista de pago + historial", reutilizado tanto
 * para empleados como para furgonetas — misma mecánica, distinta fuente de
 * datos. Para furgonetas no hay selector Quincenal/Mensual (siempre
 * quincenal).
 */
function BloqueListaPago({ tipo }) {
  const esEmpleado = tipo === 'empleado'
  const trabajadores = useMockStore((s) => s.trabajadores)
  const vehiculos = useMockStore((s) => s.vehiculos)
  const listasEmpleados = useMockStore((s) => s.listasEmpleados)
  const listasFurgonetas = useMockStore((s) => s.listasFurgonetas)
  const generarListaEmpleados = useMockStore((s) => s.generarListaEmpleados)
  const generarListaFurgonetas = useMockStore((s) => s.generarListaFurgonetas)
  const cancelarListaEmpleados = useMockStore((s) => s.cancelarListaEmpleados)
  const cancelarListaFurgonetas = useMockStore((s) => s.cancelarListaFurgonetas)
  const state = useMockStore()

  const [ciclo, setCiclo] = useState('quincenal')
  const [modo, setModo] = useState('idle') // idle | seleccion | encargado
  const [busqueda, setBusqueda] = useState('')
  const [seleccionados, setSeleccionados] = useState(new Set())
  const [encargadoNombre, setEncargadoNombre] = useState('')
  const [listaAbierta, setListaAbierta] = useState(null)

  const entidades = esEmpleado ? trabajadores : vehiculos
  const entidadesCiclo = esEmpleado ? entidades.filter((t) => t.payment_period === ciclo) : entidades
  const pendientesPorId = useMemo(() => {
    const map = {}
    entidadesCiclo.forEach((e) => {
      map[e.id] = esEmpleado ? getPendientesEmpleado(state, e.id) : getPendientesVehiculo(state, e.id)
    })
    return map
  }, [entidadesCiclo, state, esEmpleado])

  const disponibles = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    return entidadesCiclo
      .filter((e) => pendientesPorId[e.id].totalPagar > 0)
      .filter((e) => {
        const nombreCompleto = esEmpleado ? `${e.nombre} ${e.apellido}` : e.nombre
        return !q || nombreCompleto.toLowerCase().includes(q)
      })
  }, [entidadesCiclo, pendientesPorId, busqueda, esEmpleado])

  const seleccionadosLista = entidadesCiclo.filter((e) => seleccionados.has(e.id))
  const totalSeleccionado = seleccionadosLista.reduce((acc, e) => acc + pendientesPorId[e.id].totalPagar, 0)

  const listas = esEmpleado ? listasEmpleados.filter((l) => l.ciclo === ciclo) : listasFurgonetas

  const toggle = (id) => setSeleccionados((prev) => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })

  const generar = () => {
    if (!encargadoNombre.trim()) return
    const ids = [...seleccionados]
    if (esEmpleado) generarListaEmpleados({ encargado: encargadoNombre, empleadoIds: ids })
    else generarListaFurgonetas({ encargado: encargadoNombre, vehiculoIds: ids })
    setSeleccionados(new Set()); setEncargadoNombre(''); setModo('idle')
  }

  // Datos con saldo pendiente del ciclo mostrado — mismo criterio que
  // "disponibles" de la lista de pago, es la base de ambos exportes.
  const conSaldo = entidadesCiclo.filter((e) => pendientesPorId[e.id].totalPagar > 0)

  const exportarExcel = () => {
    if (conSaldo.length === 0) return
    const filas = conSaldo.map((e) => [
      esEmpleado ? `${e.nombre} ${e.apellido}` : e.nombre,
      pendientesPorId[e.id].totalPagar.toFixed(2),
    ])
    const hoja = XLSX.utils.aoa_to_sheet([['Nombre', 'A pagar (€)'], ...filas])
    const libro = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(libro, hoja, esEmpleado ? 'Empleados' : 'Furgonetas')
    const sufijo = esEmpleado ? CICLO_EMPLEADO[ciclo].fin : CICLO_FURGONETA.quincenal.fin
    XLSX.writeFile(libro, `Ciclo_${esEmpleado ? 'Empleados' : 'Furgonetas'}_${sufijo}.xlsx`)
  }

  const exportarPlanilla = () => window.print()

  return (
    <>
      <Card>
        <SectionTitle color="green">Ciclo de pago</SectionTitle>
        {esEmpleado ? (
          <div className="flex gap-2 mb-3">
            <Button variant="pill" active={ciclo === 'quincenal'} onClick={() => { setCiclo('quincenal'); setModo('idle') }}>Quincenal</Button>
            <Button variant="pill" active={ciclo === 'mensual'} onClick={() => { setCiclo('mensual'); setModo('idle') }}>Mensual</Button>
          </div>
        ) : (
          <p className="text-[10px] text-gray-400 mb-3">Las furgonetas solo tienen ciclo quincenal — no hay selector.</p>
        )}
        <p className="text-[10px] text-gray-400 mb-3">
          Período activo: {esEmpleado ? CICLO_EMPLEADO[ciclo].label : CICLO_FURGONETA.quincenal.label}
        </p>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" icon={<Download className="w-4 h-4" />} disabled={conSaldo.length === 0} onClick={exportarExcel}>
            EXPORTAR A EXCEL
          </Button>
          <Button variant="dark" icon={<FileSpreadsheet className="w-4 h-4" />} disabled={conSaldo.length === 0} onClick={exportarPlanilla}>
            EXPORTAR PLANILLA
          </Button>
        </div>
        {conSaldo.length === 0 && (
          <p className="mt-2 text-[10px] text-gray-400 text-center">sin datos para exportar</p>
        )}
      </Card>

      {esEmpleado && (ciclo === 'quincenal') && (
        <Card>
          <SectionTitle color="gold">Lista de pago quincenal</SectionTitle>

          {modo === 'idle' && (
            <>
              <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => { setBusqueda(''); setSeleccionados(new Set()); setModo('seleccion') }}>
                GENERAR LISTA
              </Button>
              <p className="mt-2 text-[10px] text-gray-400 text-center">
                Selecciona {esEmpleado ? 'a los empleados' : 'las furgonetas'} con saldo pendiente y ejecuta el pago en efectivo.
              </p>
            </>
          )}

          {modo === 'seleccion' && (
            <>
              <div className="relative mb-3">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input type="text" placeholder={esEmpleado ? 'Buscar empleado…' : 'Buscar furgoneta…'} value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)} className="!pl-9" />
              </div>
              {disponibles.length === 0 ? (
                <p className="text-gray-400 text-xs text-center py-6">
                  {busqueda ? 'Sin coincidencias.' : `No hay ${esEmpleado ? 'empleados' : 'furgonetas'} con pago pendiente.`}
                </p>
              ) : (
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="grid grid-cols-[auto_1fr_auto] gap-2 bg-navy-dark p-2 text-[10px] font-semibold text-gray-300 uppercase">
                    <span></span><span>Nombre</span><span className="text-right">A pagar</span>
                  </div>
                  {disponibles.map((e, i) => (
                    <label key={e.id} className={`grid grid-cols-[auto_1fr_auto] gap-2 p-2 border-t border-gray-100 items-center text-xs ${seleccionados.has(e.id) ? 'bg-primary/10' : i % 2 ? 'bg-gray-50/60' : 'bg-white'}`}>
                      <input type="checkbox" checked={seleccionados.has(e.id)} onChange={() => toggle(e.id)} />
                      <span className="text-navy-dark truncate">{esEmpleado ? `${e.nombre} ${e.apellido}` : e.nombre}</span>
                      <span className="text-right font-semibold text-navy-dark">€{pendientesPorId[e.id].totalPagar.toFixed(2)}</span>
                    </label>
                  ))}
                </div>
              )}
              <div className="mt-3 grid grid-cols-[1fr_auto] gap-2 p-2 rounded-xl bg-primary/10 text-xs font-bold text-primary">
                <span>Seleccionados ({seleccionadosLista.length})</span>
                <span className="text-right">€{totalSeleccionado.toFixed(2)}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <Button variant="outline" icon={<X className="w-4 h-4" />} onClick={() => setModo('idle')}>CANCELAR</Button>
                <Button variant="primary" icon={<Printer className="w-4 h-4" />} disabled={seleccionadosLista.length === 0} onClick={() => setModo('encargado')}>
                  ACEPTAR
                </Button>
              </div>
            </>
          )}

          {modo === 'encargado' && (
            <>
              <div className="grid grid-cols-[1fr_auto] gap-2 p-2 mb-3 rounded-xl bg-primary/10 text-xs font-bold text-primary">
                <span>A pagar ({seleccionadosLista.length})</span>
                <span className="text-right">€{totalSeleccionado.toFixed(2)}</span>
              </div>
              <Input label="Nombre del encargado (quien reparte el efectivo)" type="text" placeholder="Ej. José Martínez"
                value={encargadoNombre} onChange={(e) => setEncargadoNombre(e.target.value)} />
              <div className="grid grid-cols-2 gap-3 mt-4">
                <Button variant="outline" icon={<X className="w-4 h-4" />} onClick={() => setModo('seleccion')}>VOLVER</Button>
                <Button variant="primary" icon={<Printer className="w-4 h-4" />} disabled={!encargadoNombre.trim()} onClick={generar}>
                  GENERAR Y PAGAR
                </Button>
              </div>
            </>
          )}
        </Card>
      )}

      {esEmpleado && ciclo === 'quincenal' && (
        <Card>
          <SectionTitle color="green">Listas generadas · Quincenal</SectionTitle>
          {listas.length === 0 ? (
            <p className="text-gray-400 text-xs text-center py-4">Sin listas generadas en este ciclo.</p>
          ) : (
            <div className="space-y-2">
              {listas.map((l) => (
                <div key={l.id} className="border border-gray-100 rounded-xl p-3 bg-gradient-to-r from-white to-gray-50">
                  <button className="w-full flex items-center justify-between" onClick={() => setListaAbierta(listaAbierta === l.id ? null : l.id)}>
                    <div className="text-left flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${CICLO_BADGE.quincenal}`}>{l.ciclo}</span>
                      <div>
                        <p className="text-xs font-semibold text-navy-dark">{l.periodo_inicio} – {l.periodo_fin}</p>
                        {l.encargado && <p className="text-[10px] text-gray-400 mt-0.5">Encargado: {l.encargado}</p>}
                      </div>
                    </div>
                    <p className="text-xs font-bold text-primary">€{Number(l.total_monto).toFixed(2)}</p>
                  </button>
                  {listaAbierta === l.id && (
                    <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                      {l.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between text-[11px] text-navy-dark">
                          <span>{it.nombre}</span><span className="font-semibold">€{Number(it.total_pagado).toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="pt-2 grid grid-cols-2 gap-2">
                        <Button variant="outline" icon={<Printer className="w-4 h-4" />} onClick={() => window.print()}>IMPRIMIR</Button>
                        <Button variant="outline" icon={<Trash2 className="w-4 h-4" />} className="!border-danger !text-danger hover:!bg-danger hover:!text-white"
                          onClick={() => { esEmpleado ? cancelarListaEmpleados(l.id) : cancelarListaFurgonetas(l.id); setListaAbierta(null) }}>
                          CANCELAR
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </>
  )
}
