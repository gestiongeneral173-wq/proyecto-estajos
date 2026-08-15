import { Delete } from 'lucide-react';
import { theme, neutral } from '../../lib/theme';

/**
 * Keypad — teclado numérico táctil de ancho fijo.
 *
 * Ancho tope de 276px y centrado: nunca intenta ocupar más espacio del
 * que necesita, así que funciona igual en los tres dispositivos sin
 * una sola regla responsiva (Doc3 §12). Esa ausencia es intencional.
 *
 * Es presentacional: no conoce el PIN ni lo valida.
 *
 * @param {(digito: string) => void} onPress
 * @param {() => void} onDelete
 * @param {boolean} [canDelete=true] Atenúa el botón de borrar si no hay nada que borrar.
 */
export default function Keypad({ onPress, onDelete, canDelete = true }) {
  const teclaBase =
    'aspect-square rounded-xl text-xl cifra bg-white border flex items-center ' +
    'justify-center active:scale-95 transition-all hover:brightness-[0.98]';

  return (
    <div className="grid grid-cols-3 gap-2 w-full max-w-[276px]">
      {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
        <button
          key={d}
          type="button"
          onClick={() => onPress(d)}
          className={teclaBase}
          style={{ borderColor: theme.line, color: theme.navyDark }}
        >
          {d}
        </button>
      ))}

      <div />

      <button
        type="button"
        onClick={() => onPress('0')}
        className={teclaBase}
        style={{ borderColor: theme.line, color: theme.navyDark }}
      >
        0
      </button>

      <button
        type="button"
        onClick={onDelete}
        aria-label="Borrar último dígito"
        className="aspect-square rounded-xl flex items-center justify-center active:scale-95 transition-all"
        style={{ color: canDelete ? theme.muted : neutral }}
      >
        <Delete className="w-5 h-5" />
      </button>
    </div>
  );
}

/**
 * PinDots — indicador de cuántos dígitos se han introducido.
 *
 * @param {number} length Dígitos introducidos.
 * @param {number} [total=4] Longitud del PIN.
 * @param {boolean} [shake=false] Activa la animación de error.
 */
export function PinDots({ length, total = 4, shake = false }) {
  return (
    <div
      className={`flex gap-2.5 my-9 ${shake ? 'animate-[shake_0.4s]' : ''}`}
      role="status"
      aria-label={`${length} de ${total} dígitos`}
    >
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-full transition-all"
          style={{ background: i < length ? theme.navyDark : theme.line }}
        />
      ))}
    </div>
  );
}
