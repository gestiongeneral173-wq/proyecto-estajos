import { create } from 'zustand'

/**
 * mockStore — "base de datos" en memoria para la maqueta visual.
 * No hay backend: todo vive acá y se resetea al recargar la página.
 * Las reglas de negocio están simplificadas a propósito (sin bloqueo de
 * pago anticipado, sin arrastre entre ciclos) — el objetivo es mostrar
 * CÓMO SE VE cada cambio, no replicar el motor de reglas real.
 */

let nextId = 1000
const uid = () => String(nextId++)

const hoy = () => new Date().toISOString().slice(0, 10)
const diasAtras = (n) => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

// ─── Ciclos (fijos, solo para mostrar el período en pantalla) ───
export const CICLO_EMPLEADO = {
  quincenal: { inicio: diasAtras(6), fin: diasAtras(-8),  label: `01/${'--'} · paga en 8 días`, diaPago: diasAtras(-8) },
  mensual:   { inicio: diasAtras(6), fin: diasAtras(-23), label: 'Mes en curso · paga fin de mes', diaPago: diasAtras(-23) }
}
export const CICLO_FURGONETA = {
  quincenal: { inicio: diasAtras(6), fin: diasAtras(-8), label: `Del ${fmt(diasAtras(6))} al ${fmt(diasAtras(-8))}`, diaPago: diasAtras(-8) }
}
function fmt(iso) {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}`
}
CICLO_EMPLEADO.quincenal.label = `Del ${fmt(CICLO_EMPLEADO.quincenal.inicio)} al ${fmt(CICLO_EMPLEADO.quincenal.fin)}`
CICLO_EMPLEADO.mensual.label   = `Del ${fmt(CICLO_EMPLEADO.mensual.inicio)} al ${fmt(CICLO_EMPLEADO.mensual.fin)}`

// ─── Seed: Trabajadores ───
const trabajadoresSeed = [
  { id: 't1', nombre: 'Marcos', apellido: 'Ruiz Peña',    telefono: '611 222 001', cuenta: 'ES12 3456 7890 1234 5678', payment_period: 'quincenal', tarifa_hora: 9.5,  es_encargado: true,  de_baja: false },
  { id: 't2', nombre: 'Lucía',  apellido: 'Fernández Gil', telefono: '611 222 002', cuenta: 'ES98 1122 3344 5566 7788', payment_period: 'quincenal', tarifa_hora: 8.75, es_encargado: false, de_baja: false },
  { id: 't3', nombre: 'Iván',   apellido: 'Molina Soto',   telefono: '611 222 003', cuenta: '',                        payment_period: 'mensual',   tarifa_hora: 10.0, es_encargado: false, de_baja: false },
  { id: 't4', nombre: 'Noelia', apellido: 'Cabrera Ortiz', telefono: '611 222 004', cuenta: 'ES44 5566 7788 9900 1122', payment_period: 'quincenal', tarifa_hora: 8.5,  es_encargado: true,  de_baja: false },
  { id: 't5', nombre: 'Pablo',  apellido: 'Domínguez Vera',telefono: '611 222 005', cuenta: '',                        payment_period: 'mensual',   tarifa_hora: 9.25, es_encargado: false, de_baja: false },
  { id: 't6', nombre: 'Andrea', apellido: 'Reyes Campos',  telefono: '611 222 006', cuenta: 'ES77 8899 0011 2233 4455', payment_period: 'quincenal', tarifa_hora: 8.75, es_encargado: false, de_baja: false },
]

// ─── Seed: Vehículos (siempre quincenal — ya no tienen PIN, solo se registran) ───
const vehiculosSeed = [
  { id: 'v1', nombre: 'Furgoneta 1', matricula: '4521-BXR', plazas_totales: 8, tarifa_plaza: 4.5, propietario: 'José Antonio Bravo' },
  { id: 'v2', nombre: 'Furgoneta 2', matricula: '7788-CLD', plazas_totales: 6, tarifa_plaza: 5.0, propietario: 'Rosa María Iglesias' },
  { id: 'v3', nombre: 'Furgoneta 3', matricula: '3350-FTN', plazas_totales: 9, tarifa_plaza: 4.75, propietario: 'Manuel Ortega' },
]

// ─── Seed: jornadas de empleados (ciclo activo, pendientes) ───
const jornadasSeed = [
  { id: uid(), empleado_id: 't1', fecha: diasAtras(1), horas: 8, destajo: 0,  tarifa: 9.5,  fue_liquidado: false, origen: null,      encargado_id: 't1', vehiculo_id: 'v1', chofer: true  },
  { id: uid(), empleado_id: 't2', fecha: diasAtras(2), horas: 7, destajo: 12, tarifa: 8.75, fue_liquidado: false, origen: null,      encargado_id: 't1', vehiculo_id: 'v1', chofer: false },
  { id: uid(), empleado_id: 't2', fecha: diasAtras(1), horas: 8, destajo: 0,  tarifa: 8.75, fue_liquidado: false, origen: null,      encargado_id: 't1', vehiculo_id: 'v1', chofer: false },
  { id: uid(), empleado_id: 't4', fecha: diasAtras(1), horas: 8, destajo: 5,  tarifa: 8.5,  fue_liquidado: false, origen: null,      encargado_id: 't4', vehiculo_id: 'v2', chofer: true  },
  { id: uid(), empleado_id: 't6', fecha: diasAtras(1), horas: 6, destajo: 0,  tarifa: 8.75, fue_liquidado: false, origen: null,      encargado_id: 't4', vehiculo_id: 'v2', chofer: false },
  // Grupo encargado/furgoneta en la fecha de HOY — para que "Rehacer
  // furgoneta" (solo disponible hoy) y la selección por checkbox convivan
  // en el mismo grupo desde que se abre la pantalla.
  { id: uid(), empleado_id: 't4', fecha: hoy(), horas: 8, destajo: 0,  tarifa: 8.5,  fue_liquidado: false, origen: null,      encargado_id: 't4', vehiculo_id: 'v2', chofer: true  },
  { id: uid(), empleado_id: 't6', fecha: hoy(), horas: 7, destajo: 0,  tarifa: 8.75, fue_liquidado: false, origen: null,      encargado_id: 't4', vehiculo_id: 'v2', chofer: false },
  // Uno ya liquidado en la fecha de HOY, mezclado con pendientes en el
  // mismo grupo — para que el identificador "Pagado" se vea apenas se abre
  // la pantalla, sin tener que cambiar de fecha a mano.
  { id: uid(), empleado_id: 't2', fecha: hoy(), horas: 8, destajo: 0,  tarifa: 8.75, fue_liquidado: true,  origen: null,      encargado_id: 't4', vehiculo_id: 'v2', chofer: false },
  // Origen 'central' en la fecha de HOY (no en el pasado) para que el
  // grupo "Registrado por Central" — y su botón de basura — se vean apenas
  // se abre la pantalla, sin tener que cambiar la fecha a mano.
  { id: uid(), empleado_id: 't3', fecha: hoy(), horas: 8, destajo: 0,  tarifa: 10.0, fue_liquidado: false, origen: 'central', encargado_id: null, vehiculo_id: null, chofer: false },
  { id: uid(), empleado_id: 't5', fecha: hoy(), horas: 6, destajo: 8,  tarifa: 9.25, fue_liquidado: false, origen: 'central', encargado_id: null, vehiculo_id: null, chofer: false },
  { id: uid(), empleado_id: 't5', fecha: diasAtras(10), horas: 8, destajo: 0, tarifa: 9.25, fue_liquidado: true,  origen: null,      encargado_id: 't1', vehiculo_id: 'v1', chofer: false },
]

const adelantosSeed = [
  { id: uid(), empleado_id: 't1', fecha: diasAtras(3), monto: 30 },
  { id: uid(), empleado_id: 't2', fecha: diasAtras(2), monto: 15 },
]

const pagosSeed = [
  { id: uid(), empleado_id: 't5', created_at: diasAtras(10), periodo_inicio: diasAtras(24), periodo_fin: diasAtras(10), total_pagado: 340 },
]

// ─── Seed: plazas de furgoneta (ciclo activo, pendientes) ───
const plazasVehiculoSeed = [
  { id: uid(), vehiculo_id: 'v1', encargado_id: 't1', fecha: diasAtras(2), plazas: 6, tarifa_aplicada: 4.5 },
  { id: uid(), vehiculo_id: 'v1', encargado_id: 't1', fecha: diasAtras(1), plazas: 5, tarifa_aplicada: 4.5 },
  { id: uid(), vehiculo_id: 'v2', encargado_id: 't4', fecha: diasAtras(1), plazas: 4, tarifa_aplicada: 5.0 },
  { id: uid(), vehiculo_id: 'v3', encargado_id: 't4', fecha: diasAtras(3), plazas: 7, tarifa_aplicada: 4.75 },
]

const adelantosVehiculoSeed = [
  { id: uid(), vehiculo_id: 'v1', concepto: 'Reparación de espejo', monto: 40 },
]

const pagosVehiculoSeed = []

// ─── Seed: temporales (siempre informativo, sin tarifa) ───
const temporalesSeed = [
  { id: uid(), nombre_completo: 'Rafael Núñez',  horas_trabajadas: 6, destajo: 0 },
  { id: uid(), nombre_completo: 'Carmen Salas',  horas_trabajadas: 8, destajo: 10 },
]

// ─── Seed: choferes pendientes de pago (informativo) ───
const choferesSeed = [
  { empleado_id: 't1', nombre: 'Marcos Ruiz Peña', veces: 3, total: 22.5 },
  { empleado_id: 't4', nombre: 'Noelia Cabrera Ortiz', veces: 1, total: 7.5 },
]

export const useMockStore = create((set, get) => ({
  trabajadores: trabajadoresSeed,
  vehiculos: vehiculosSeed,
  jornadas: jornadasSeed,
  adelantos: adelantosSeed,
  pagos: pagosSeed,
  plazasVehiculo: plazasVehiculoSeed,
  adelantosVehiculo: adelantosVehiculoSeed,
  pagosVehiculo: pagosVehiculoSeed,
  temporales: temporalesSeed,
  choferes: choferesSeed,
  tarifaChofer: 7.5,
  tarifaTemporal: 6.0,
  listasEmpleados: [],
  listasFurgonetas: [],
  pinesEncargado: [],

  // ── Trabajadores ──
  crearTrabajador: (data) => set((s) => ({
    trabajadores: [...s.trabajadores, { id: uid(), es_encargado: false, de_baja: false, cuenta: '', ...data }]
  })),
  actualizarTrabajador: (id, patch) => set((s) => ({
    trabajadores: s.trabajadores.map((t) => t.id === id ? { ...t, ...patch } : t)
  })),
  toggleEncargado: (id) => set((s) => ({
    trabajadores: s.trabajadores.map((t) => t.id === id ? { ...t, es_encargado: !t.es_encargado } : t)
  })),

  // ── PIN de encargado (4 dígitos, uno por encargado) — el admin
  // selecciona a quiénes generarles código y se lo pasa por WhatsApp.
  // Genera de nuevo (reemplaza) el PIN si el encargado ya tenía uno activo.
  generarPinesEncargado: (empleadoIds) => set((s) => {
    const nuevoPin = () => String(Math.floor(1000 + Math.random() * 9000))
    const otros = s.pinesEncargado.filter((p) => !empleadoIds.includes(p.empleado_id))
    const nuevos = empleadoIds.map((id) => ({ id: uid(), empleado_id: id, pin: nuevoPin(), generado_en: new Date().toISOString() }))
    return { pinesEncargado: [...otros, ...nuevos] }
  }),
  eliminarPinEncargado: (id) => set((s) => ({
    pinesEncargado: s.pinesEncargado.filter((p) => p.id !== id)
  })),
  darDeBajaTrabajador: (id) => set((s) => ({
    trabajadores: s.trabajadores.filter((t) => t.id !== id),
    jornadas: s.jornadas.filter((j) => j.empleado_id !== id),
    adelantos: s.adelantos.filter((a) => a.empleado_id !== id),
  })),

  // ── Adelantos empleado ──
  registrarAdelanto: (empleadoId, monto) => set((s) => ({
    adelantos: [...s.adelantos, { id: uid(), empleado_id: empleadoId, fecha: hoy(), monto }]
  })),
  editarAdelanto: (id, monto) => set((s) => ({
    adelantos: s.adelantos.map((a) => a.id === id ? { ...a, monto } : a)
  })),
  eliminarAdelanto: (id) => set((s) => ({
    adelantos: s.adelantos.filter((a) => a.id !== id)
  })),

  // ── Jornadas empleado ──
  registrarHorasCentral: (empleadoId, horas, destajo) => set((s) => {
    const t = s.trabajadores.find((x) => x.id === empleadoId)
    const yaHoy = s.jornadas.find((j) => j.empleado_id === empleadoId && j.fecha === hoy())
    if (yaHoy) return s
    return {
      jornadas: [...s.jornadas, {
        id: uid(), empleado_id: empleadoId, fecha: hoy(), horas, destajo,
        tarifa: t?.tarifa_hora ?? 0, fue_liquidado: false, origen: 'central',
        encargado_id: null, vehiculo_id: null, chofer: false,
      }]
    }
  }),
  editarJornada: (id, { horas, destajo }) => set((s) => ({
    jornadas: s.jornadas.map((j) => j.id === id ? { ...j, horas, destajo } : j)
  })),
  // Borrado selectivo de filas — nunca borra todo el grupo de un golpe,
  // solo los ids que el admin marcó a mano (aplica a cualquier grupo:
  // Central o encargado/furgoneta).
  eliminarJornadas: (ids) => set((s) => ({
    jornadas: s.jornadas.filter((j) => !ids.includes(j.id))
  })),

  // ── Pago individual (Escanear → Pagar Empleado) ──
  pagarEmpleado: (empleadoId) => set((s) => {
    const jor = s.jornadas.filter((j) => j.empleado_id === empleadoId && !j.fue_liquidado)
    const ade = s.adelantos.filter((a) => a.empleado_id === empleadoId)
    const totalDevengado = jor.reduce((acc, j) => acc + j.horas * j.tarifa + Number(j.destajo), 0)
    const totalAdelantos = ade.reduce((acc, a) => acc + Number(a.monto), 0)
    return {
      jornadas: s.jornadas.map((j) => (j.empleado_id === empleadoId && !j.fue_liquidado) ? { ...j, fue_liquidado: true } : j),
      adelantos: s.adelantos.filter((a) => a.empleado_id !== empleadoId),
      pagos: [...s.pagos, {
        id: uid(), empleado_id: empleadoId, created_at: hoy(),
        periodo_inicio: CICLO_EMPLEADO.quincenal.inicio, periodo_fin: CICLO_EMPLEADO.quincenal.fin,
        total_pagado: totalDevengado - totalAdelantos,
      }]
    }
  }),

  // ── Lista de pago — Empleados (quincenal) ──
  generarListaEmpleados: ({ encargado, empleadoIds }) => set((s) => {
    const items = empleadoIds.map((id) => {
      const t = s.trabajadores.find((x) => x.id === id)
      const jor = s.jornadas.filter((j) => j.empleado_id === id && !j.fue_liquidado)
      const ade = s.adelantos.filter((a) => a.empleado_id === id)
      const totalDevengado = jor.reduce((acc, j) => acc + j.horas * j.tarifa + Number(j.destajo), 0)
      const totalAdelantos = ade.reduce((acc, a) => acc + Number(a.monto), 0)
      return { empleado_id: id, nombre: `${t.nombre} ${t.apellido}`, total_devengado: totalDevengado, total_adelantos: totalAdelantos, total_pagado: totalDevengado - totalAdelantos }
    })
    const totalMonto = items.reduce((acc, i) => acc + i.total_pagado, 0)
    const lista = {
      id: uid(), ciclo: 'quincenal', periodo_inicio: CICLO_EMPLEADO.quincenal.inicio, periodo_fin: CICLO_EMPLEADO.quincenal.fin,
      encargado, total_monto: totalMonto, items,
    }
    return {
      listasEmpleados: [lista, ...s.listasEmpleados],
      jornadas: s.jornadas.map((j) => empleadoIds.includes(j.empleado_id) && !j.fue_liquidado ? { ...j, fue_liquidado: true } : j),
      adelantos: s.adelantos.filter((a) => !empleadoIds.includes(a.empleado_id)),
    }
  }),
  cancelarListaEmpleados: (listaId) => set((s) => {
    const lista = s.listasEmpleados.find((l) => l.id === listaId)
    if (!lista) return s
    const ids = lista.items.map((i) => i.empleado_id)
    return {
      listasEmpleados: s.listasEmpleados.filter((l) => l.id !== listaId),
      jornadas: s.jornadas.map((j) => ids.includes(j.empleado_id) && j.fue_liquidado ? { ...j, fue_liquidado: false } : j),
    }
  }),

  // ── Vehículos — ya no tienen PIN, solo se registran ──
  crearVehiculo: (data) => set((s) => ({
    vehiculos: [...s.vehiculos, { id: uid(), propietario: '', ...data }]
  })),
  actualizarVehiculo: (id, patch) => set((s) => ({
    vehiculos: s.vehiculos.map((v) => v.id === id ? { ...v, ...patch } : v)
  })),
  darDeBajaVehiculo: (id) => set((s) => ({
    vehiculos: s.vehiculos.filter((v) => v.id !== id),
    plazasVehiculo: s.plazasVehiculo.filter((d) => d.vehiculo_id !== id),
    adelantosVehiculo: s.adelantosVehiculo.filter((a) => a.vehiculo_id !== id),
  })),

  // ── Adelantos / plazas de vehículo ──
  registrarAdelantoVehiculo: (vehiculoId, concepto, monto) => set((s) => ({
    adelantosVehiculo: [...s.adelantosVehiculo, { id: uid(), vehiculo_id: vehiculoId, concepto, monto }]
  })),
  editarAdelantoVehiculo: (id, monto) => set((s) => ({
    adelantosVehiculo: s.adelantosVehiculo.map((a) => a.id === id ? { ...a, monto } : a)
  })),
  eliminarAdelantoVehiculo: (id) => set((s) => ({
    adelantosVehiculo: s.adelantosVehiculo.filter((a) => a.id !== id)
  })),
  editarPlazasDia: (id, plazas) => set((s) => ({
    plazasVehiculo: s.plazasVehiculo.map((d) => d.id === id ? { ...d, plazas } : d)
  })),

  // ── Pago individual de vehículo ──
  pagarVehiculo: (vehiculoId) => set((s) => {
    const dias = s.plazasVehiculo.filter((d) => d.vehiculo_id === vehiculoId)
    const ade = s.adelantosVehiculo.filter((a) => a.vehiculo_id === vehiculoId)
    const totalDevengado = dias.reduce((acc, d) => acc + d.plazas * d.tarifa_aplicada, 0)
    const totalAdelantos = ade.reduce((acc, a) => acc + Number(a.monto), 0)
    return {
      plazasVehiculo: s.plazasVehiculo.filter((d) => d.vehiculo_id !== vehiculoId),
      adelantosVehiculo: s.adelantosVehiculo.filter((a) => a.vehiculo_id !== vehiculoId),
      pagosVehiculo: [...s.pagosVehiculo, {
        id: uid(), vehiculo_id: vehiculoId, periodo_inicio: CICLO_FURGONETA.quincenal.inicio, periodo_fin: CICLO_FURGONETA.quincenal.fin,
        total_devengado: totalDevengado, total_adelantos: totalAdelantos, total_pagado: totalDevengado - totalAdelantos,
      }]
    }
  }),

  // ── Lista de pago — Furgonetas (nuevo, espejo del de empleados) ──
  generarListaFurgonetas: ({ encargado, vehiculoIds }) => set((s) => {
    const items = vehiculoIds.map((id) => {
      const v = s.vehiculos.find((x) => x.id === id)
      const dias = s.plazasVehiculo.filter((d) => d.vehiculo_id === id)
      const ade = s.adelantosVehiculo.filter((a) => a.vehiculo_id === id)
      const totalDevengado = dias.reduce((acc, d) => acc + d.plazas * d.tarifa_aplicada, 0)
      const totalAdelantos = ade.reduce((acc, a) => acc + Number(a.monto), 0)
      return { vehiculo_id: id, nombre: v.nombre, total_devengado: totalDevengado, total_adelantos: totalAdelantos, total_pagado: totalDevengado - totalAdelantos }
    })
    const totalMonto = items.reduce((acc, i) => acc + i.total_pagado, 0)
    const lista = {
      id: uid(), ciclo: 'quincenal', periodo_inicio: CICLO_FURGONETA.quincenal.inicio, periodo_fin: CICLO_FURGONETA.quincenal.fin,
      encargado, total_monto: totalMonto, items,
    }
    return {
      listasFurgonetas: [lista, ...s.listasFurgonetas],
      plazasVehiculo: s.plazasVehiculo.filter((d) => !vehiculoIds.includes(d.vehiculo_id)),
      adelantosVehiculo: s.adelantosVehiculo.filter((a) => !vehiculoIds.includes(a.vehiculo_id)),
    }
  }),
  cancelarListaFurgonetas: (listaId) => set((s) => ({
    listasFurgonetas: s.listasFurgonetas.filter((l) => l.id !== listaId),
  })),

  // ── Temporales (solo informativo) ──
  eliminarTemporal: (id) => set((s) => ({ temporales: s.temporales.filter((t) => t.id !== id) })),
  eliminarTodosLosTemporales: () => set({ temporales: [] }),

  // ── Chofer ──
  setTarifaChofer: (v) => set({ tarifaChofer: v }),
  setTarifaTemporal: (v) => set({ tarifaTemporal: v }),
  pagarChofer: (empleadoId) => set((s) => ({ choferes: s.choferes.filter((c) => c.empleado_id !== empleadoId) })),
}))

// ─── Selectores derivados ───
export function getPendientesEmpleado(state, empleadoId) {
  const jornadas = state.jornadas.filter((j) => j.empleado_id === empleadoId && !j.fue_liquidado)
  const adelantos = state.adelantos.filter((a) => a.empleado_id === empleadoId)
  const totalDevengado = jornadas.reduce((acc, j) => acc + j.horas * j.tarifa + Number(j.destajo), 0)
  const totalAdelantos = adelantos.reduce((acc, a) => acc + Number(a.monto), 0)
  return { jornadas, adelantos, totalDevengado, totalAdelantos, totalPagar: totalDevengado - totalAdelantos }
}

export function getBalanceEmpleado(state, empleadoId) {
  return getPendientesEmpleado(state, empleadoId).totalPagar
}

export function getPendientesVehiculo(state, vehiculoId) {
  const dias = state.plazasVehiculo.filter((d) => d.vehiculo_id === vehiculoId)
  const adelantos = state.adelantosVehiculo.filter((a) => a.vehiculo_id === vehiculoId)
  const totalDevengado = dias.reduce((acc, d) => acc + d.plazas * d.tarifa_aplicada, 0)
  const totalAdelantos = adelantos.reduce((acc, a) => acc + Number(a.monto), 0)
  return { dias, adelantos, totalDevengado, totalAdelantos, totalPagar: totalDevengado - totalAdelantos }
}
