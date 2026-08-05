import { Routes, Route, Navigate } from 'react-router-dom'

import EscanearPage          from './pages/EscanearPage.jsx'
import ReporteDiarioPage     from './pages/ReporteDiarioPage.jsx'
import ResumenPage           from './pages/ResumenPage.jsx'
import RegistrosPage         from './pages/RegistrosPage.jsx'
import TrabajadorDetallePage from './pages/TrabajadorDetallePage.jsx'
import VehiculosPage         from './pages/VehiculosPage.jsx'
import VehiculoDetallePage   from './pages/VehiculoDetallePage.jsx'
import ConfiguracionPage     from './pages/ConfiguracionPage.jsx'

/**
 * App — maqueta visual del Panel Central con los cambios propuestos.
 * Sin login: entra directo a Escanear. Sin backend: todo vive en
 * mockStore.js, en memoria, y se reinicia al recargar la página.
 */
export default function App() {
  return (
    <>
      <div className="maqueta-banner h-1.5 w-full sticky top-0 z-50" />
      <Routes>
        <Route path="/" element={<Navigate to="/escanear" replace />} />
        <Route path="/escanear" element={<EscanearPage />} />
        <Route path="/reporte" element={<ReporteDiarioPage />} />
        <Route path="/resumen" element={<ResumenPage />} />
        <Route path="/registros" element={<RegistrosPage />} />
        <Route path="/registros/:id" element={<TrabajadorDetallePage />} />
        <Route path="/vehiculos" element={<VehiculosPage />} />
        <Route path="/vehiculos/:id" element={<VehiculoDetallePage />} />
        <Route path="/configuracion" element={<ConfiguracionPage />} />
        <Route path="*" element={<Navigate to="/escanear" replace />} />
      </Routes>
    </>
  )
}
