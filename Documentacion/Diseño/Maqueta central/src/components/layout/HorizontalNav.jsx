import { NavLink } from 'react-router-dom'
import { ScanLine, FileText, BarChart3, Users, Truck, Settings } from 'lucide-react'
import { Direccion } from '../../utils/constants.js'

const TABS = [
  { to: Direccion.centralEscanear,     icon: ScanLine,  label: 'Escanear' },
  { to: Direccion.centralReporte,      icon: FileText,  label: 'Reporte Diario' },
  { to: Direccion.CentralResumen,      icon: BarChart3, label: 'Resumen' },
  { to: Direccion.CentralTrabajadores, icon: Users,     label: 'Registros' },
  { to: Direccion.CentralVehiculos,    icon: Truck,     label: 'Vehículos' },
  { to: Direccion.CentralConfiguracion, icon: Settings, label: 'Configuración' }
]

export default function HorizontalNav() {
  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="flex overflow-x-auto px-2 py-2 gap-1 scrollbar-hide">
        {TABS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-full text-xs whitespace-nowrap transition-all ${
                isActive ? 'bg-primary text-white font-semibold' : 'text-gray-600 hover:bg-gray-100 font-medium'
              }`
            }
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
