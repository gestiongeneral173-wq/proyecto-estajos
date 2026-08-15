# `src/lib` — Utilidades centrales

Código compartido que no es un componente visual: conexión a datos y sistema de diseño. Todo lo que vive aquí se importa desde otras partes del proyecto, nunca al revés.

| Archivo | Qué contiene | Quién lo usa |
|---|---|---|
| `theme.js` | Tokens del tema Pizarra: color, tipografía, anchos, espaciado, sombras | Todos los componentes de `ui/` y `layout/` |
| `supabaseClient.js` | Cliente de conexión a la base de datos (Supabase) | Pantallas que lean o escriban datos (todavía ninguna) |

---

## `theme.js`

Fuente de verdad de todo valor visual del proyecto. Ningún componente escribe un hex a mano ni una clase de color de Tailwind: el tema se aplica en tiempo de ejecución, y un valor escrito a mano no cambiaría al cambiar de tema (ver `src/components/README.md`).

Exporta:

- **`theme`** — paleta de color: `navyDark`, `primary`, `danger`, `line`, `muted`, etc.
- **`neutral`** — gris de apoyo para iconos y encabezados de tabla.
- **`alpha(hex, opacity)`** — convierte un color del tema en `rgba()` con la opacidad indicada.
- **`BADGES`** — catálogo de insignias: rol (E/C/A/P/X) y ciclo de pago (Q/M), cada una con su color y etiqueta. Es la única fuente válida de letras de insignia; no se inventan códigos nuevos sin añadirlos aquí primero.
- **`type`** — escala tipográfica responsiva (clases Tailwind completas, con `sm:`/`lg:` incluidos) para cada nivel de texto: `eyebrow`, `body`, `title`, `figure`, etc.
- **`width`** — anchos de contenedor estándar: `content`, `form`, `action`, `dialog`.
- **`space`** — espaciado y relleno responsivos: `pageX`, `pageTop`, `gridGap`, `stack`.
- **`shadow`** — elevación (`raised`, `sheet`), para los casos puntuales que necesitan estilo en línea en vez de una clase de Tailwind.
- **`motion`** — animaciones de hojas inferiores (`sheetIn`, `sheetInFast`).

Los tres documentos de diseño (`Doc1` fundamentos visuales, `Doc2` estructura y layout, `Doc3` componentes e interacción) son la referencia normativa de estos valores.

```jsx
import { theme, type, BADGES } from '../lib/theme';

<span style={{ color: theme.primary }} className={type.title}>
  {BADGES['E'].label}
</span>
```

---

## `supabaseClient.js`

Inicializa un único cliente de Supabase y lo exporta como `supabase`. Lee la URL y la clave anónima desde variables de entorno:

```js
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
```

**Requiere un archivo `.env`** en la raíz del proyecto (no se sube a git, cada persona tiene el suyo — ver la guía de configuración del proyecto) con esas dos claves. Sin ese archivo, el cliente se crea igual pero cualquier consulta que se intente hacer con él falla, porque `supabaseUrl`/`supabaseKey` llegan como `undefined`.

Todavía ningún componente lo importa: es código listo para cuando exista la primera pantalla que necesite leer o escribir datos.

```jsx
import { supabase } from '../lib/supabaseClient';

const { data, error } = await supabase.from('trabajadores').select('*');
```

---

## Al añadir algo nuevo a `lib/`

Solo debe vivir aquí lo que cumpla las dos condiciones: **no es un componente visual** y **más de una parte del proyecto lo necesita**. Si algo solo lo usa una pantalla, va junto a esa pantalla, no en `lib/`.
