import { useState } from 'react'
import { KeyRound, Check } from 'lucide-react'

import Header        from '../components/layout/Header.jsx'
import HorizontalNav from '../components/layout/HorizontalNav.jsx'
import Card          from '../components/ui/Card.jsx'
import Button        from '../components/ui/Button.jsx'
import Input         from '../components/ui/Input.jsx'
import SectionTitle  from '../components/ui/SectionTitle.jsx'

export default function ConfiguracionPage() {
  const [nueva, setNueva] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [error, setError] = useState(null)
  const [exito, setExito] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError(null)
    if (nueva.length < 6) return setError('La contraseña debe tener al menos 6 caracteres.')
    if (nueva !== confirmar) return setError('Las contraseñas no coinciden.')
    setNueva(''); setConfirmar(''); setExito(true)
    setTimeout(() => setExito(false), 2500)
  }

  return (
    <div className="min-h-screen bg-app-bg">
      <Header rightLabel="Salir" />
      <HorizontalNav />

      <div className="max-w-md px-4 pt-4 pb-6 mx-auto space-y-4">
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-navy-dark/5 flex items-center justify-center">
              <KeyRound className="w-4 h-4 text-navy-dark" />
            </div>
            <SectionTitle color="green" className="mb-0">Cambiar contraseña</SectionTitle>
          </div>

          {error && (
            <div className="p-3 mb-3 border border-red-200 bg-red-50 rounded-xl">
              <p className="text-xs font-medium text-center text-danger">{error}</p>
            </div>
          )}
          {exito && (
            <div className="flex items-center justify-center gap-2 p-3 mb-3 border border-green-200 bg-green-50 rounded-xl">
              <Check className="w-4 h-4 text-primary" />
              <p className="text-xs font-semibold text-primary">Contraseña actualizada</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <Input label="Nueva contraseña" type="password" value={nueva} onChange={(e) => setNueva(e.target.value)} />
            <Input label="Confirmar contraseña" type="password" value={confirmar} onChange={(e) => setConfirmar(e.target.value)} />
            <Button variant="dark" type="submit">Guardar contraseña</Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
