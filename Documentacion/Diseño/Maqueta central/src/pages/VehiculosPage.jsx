import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Truck } from 'lucide-react'

import Header        from '../components/layout/Header.jsx'
import HorizontalNav from '../components/layout/HorizontalNav.jsx'
import Card          from '../components/ui/Card.jsx'
import Button        from '../components/ui/Button.jsx'
import Input         from '../components/ui/Input.jsx'
import Modal         from '../components/ui/Modal.jsx'
import CircleIcon    from '../components/ui/CircleIcon.jsx'
import SectionTitle  from '../components/ui/SectionTitle.jsx'

import { useMockStore, getPendientesVehiculo } from '../store/mockStore.js'
import { Direccion } from '../utils/constants.js'

/* Cambio: se elimina el PIN por completo — las furgonetas ya no se
   controlan con código, solo se registran. Sin PIN no hay nada que rotar
   ni contar regresivamente, así que también desaparece ese bloque de la
   tarjeta. El resto (registro, historial, adelantos) sigue igual. */
function VehicleCard({ vehiculo, onViewDetails }) {
  const state = useMockStore()
  const pend = getPendientesVehiculo(state, vehiculo.id)

  return (
    <Card>
      <div className="flex items-center gap-3">
        <CircleIcon icon={Truck} size="md" />
        <div className="flex-1 min-w-0 cursor-pointer" onClick={onViewDetails}>
          <p className="text-navy-dark font-bold text-sm hover:text-primary transition-colors">{vehiculo.nombre}</p>
          <p className="text-gray-500 text-[10px]">{vehiculo.matricula ?? '—'} · {vehiculo.plazas_totales} plazas</p>
        </div>
      </div>

      <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-100">
        <div className="bg-gray-50 rounded-lg px-3 py-1.5 text-center flex-1">
          <p className="text-[9px] text-gray-400 uppercase">Tarifa/plaza</p>
          <p className="text-navy-dark font-bold text-xs">€{vehiculo.tarifa_plaza}</p>
        </div>
        <div className="bg-red-50 rounded-lg px-3 py-1.5 text-center flex-1">
          <p className="text-[9px] text-gray-400 uppercase">Adelantos</p>
          <p className="text-danger font-bold text-xs">€{pend.totalAdelantos.toFixed(0)}</p>
        </div>
      </div>

      <Button variant="dark" className="mt-3" onClick={onViewDetails}>VER ADELANTOS Y DETALLE</Button>
    </Card>
  )
}

export default function VehiculosPage() {
  const navigate = useNavigate()
  const vehiculos = useMockStore((s) => s.vehiculos)
  const crearVehiculo = useMockStore((s) => s.crearVehiculo)
  const [modalVeh, setModalVeh] = useState(false)

  return (
    <div className="min-h-screen bg-app-bg">
      <Header rightLabel="Salir" />
      <HorizontalNav />

      <div className="px-4 pt-4 pb-6 max-w-md mx-auto space-y-4">
        <Card>
          <SectionTitle color="gold">Vehículos</SectionTitle>
          <p className="text-[10px] text-gray-400 mb-3">Todas las furgonetas cobran quincenal — ya no existe un tipo de pago a elegir.</p>
          <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setModalVeh(true)}>AÑADIR VEHÍCULO</Button>
        </Card>

        <div className="space-y-2">
          {vehiculos.length === 0 ? (
            <Card><p className="text-gray-400 text-xs text-center py-6">No hay vehículos.</p></Card>
          ) : vehiculos.map((v) => (
            <VehicleCard key={v.id} vehiculo={v} onViewDetails={() => navigate(`${Direccion.CentralVehiculos}/${v.id}`)} />
          ))}
        </div>
      </div>

      <ModalVehiculo open={modalVeh} onClose={() => setModalVeh(false)} onSave={crearVehiculo} />
    </div>
  )
}

/* ─── Alta de vehículo — sin PIN, sin selector de tipo de pago (siempre quincenal) ─── */
function ModalVehiculo({ open, onClose, onSave }) {
  const [form, setForm] = useState({ nombre: '', matricula: '', plazas_totales: '', tarifa_plaza: '' })
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const guardar = () => {
    onSave({
      nombre: form.nombre.trim(), matricula: form.matricula.trim() || null,
      plazas_totales: parseInt(form.plazas_totales, 10) || 0, tarifa_plaza: parseFloat(form.tarifa_plaza) || 0,
    })
    setForm({ nombre: '', matricula: '', plazas_totales: '', tarifa_plaza: '' })
    onClose()
  }

  return (
    <Modal open={open} title="Nuevo Vehículo" onClose={onClose}>
      <div className="space-y-4">
        <Input label="Nombre *" value={form.nombre} onChange={set('nombre')} />
        <Input label="Matrícula (opcional)" value={form.matricula} onChange={set('matricula')} />
        <Input label="Plazas totales" type="number" value={form.plazas_totales} onChange={set('plazas_totales')} />
        <Input label="Tarifa por plaza (€) *" type="number" value={form.tarifa_plaza} onChange={set('tarifa_plaza')} />
        <p className="text-[10px] text-gray-400 -mt-2">Ciclo de pago: Quincenal (fijo, no editable).</p>
        <Button variant="primary" disabled={!form.nombre} onClick={guardar}>GUARDAR</Button>
      </div>
    </Modal>
  )
}
