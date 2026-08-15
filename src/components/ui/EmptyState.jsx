import { theme, type } from '../../lib/theme';
import Card from './Card';

/**
 * EmptyState — mensaje de lista vacía dentro de una tarjeta.
 *
 * Un estado vacío es una invitación a actuar: `title` dice qué falta y
 * `hint` dice cómo resolverlo. Nunca se deja una lista vacía sin este
 * componente.
 *
 * @param {string} title Qué ocurre. Ej.: "Todavía no hay partes de hoy".
 * @param {string} [hint] Cómo continuar. Ej.: "Registra la primera furgoneta...".
 * @param {React.ReactNode} [action] Botón opcional bajo el texto.
 */
export default function EmptyState({ title, hint, action, className = '' }) {
  return (
    <Card className={`text-center py-14 ${className}`}>
      <p className="text-[15px] font-medium" style={{ color: theme.navyDark }}>
        {title}
      </p>
      {hint && (
        <p className={`${type.body} mt-1.5`} style={{ color: theme.muted }}>
          {hint}
        </p>
      )}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </Card>
  );
}
