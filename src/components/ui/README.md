# `components/ui` — Primitivos del sistema de diseño

Piezas visuales sin conocimiento del negocio. Un componente de esta carpeta no sabe qué es una furgoneta, un destajo ni un encargado: recibe texto, números y funciones, y los pinta según el tema Pizarra.

**Regla de pertenencia:** si al leer el nombre del componente hace falta conocer ESTAJOS para entenderlo, no va aquí — va en `domain/`. `Badge` va aquí; `TarjetaFurgoneta` no. `Input` va aquí; `CampoDestajo` no.

Todos los valores de color, tipografía y espaciado salen de `src/lib/theme.js`. Ningún componente de esta carpeta escribe un hex a mano ni una clase de color de Tailwind (`text-emerald-600`, `bg-gray-100`), porque el tema se aplica en tiempo de ejecución y una clase escrita a mano no cambiaría al cambiar de tema (Doc1 §1.1).

---

## Inventario

| Componente | Tipo | Para qué sirve |
|---|---|---|
| `Badge` | Dato | Insignia de una letra: rol (E/C/A/P/X) o ciclo de pago (Q/M) |
| `BadgeGroup` | Dato | Fila de insignias de una misma persona |
| `Button` | Acción | Botón en seis variantes, incluida la compacta `pill` |
| `Card` | Contenedor | Contenedor blanco base de todo el sistema |
| `Cifra` | Dato | Envoltorio monoespaciado para cualquier número |
| `ConfirmModal` | Superposición | Confirmación de una acción irreversible |
| `EmptyState` | Contenido | Mensaje de lista vacía con salida hacia la acción |
| `Eyebrow` | Contenido | Etiqueta corta en mayúsculas que abre una sección |
| `IconTile` | Decoración | Mosaico cuadrado con un icono centrado |
| `InlineField` | Formulario | Campo compacto de edición dentro de una fila de tabla |
| `Input` | Formulario | Campo de formulario estándar con etiqueta |
| `Keypad` + `PinDots` | Formulario | Teclado numérico de ancho fijo e indicador de dígitos |
| `Modal` | Superposición | Hoja inferior en teléfono, diálogo centrado en pantallas grandes |
| `OptionTile` | Formulario | Mosaico seleccionable dentro de una cuadrícula de opciones |
| `SearchInput` | Formulario | Campo de filtrado en vivo con lupa y botón de limpiar |
| `StatusDot` | Dato | Punto de color que precede a una etiqueta de estado |
| `Stepper` | Navegación | Barra de progreso con etiqueta por paso |
| `Wordmark` | Marca | Logotipo tipográfico ESTAJOS |

Importación recomendada, a través del barril:

```jsx
import { Card, Eyebrow, Button, Cifra } from '../ui';
```

---

## Cada componente en detalle

### `Badge`

**Propósito.** Codificar rol y ciclo de pago de un vistazo, sin texto, en espacios muy reducidos: filas de tabla, listas densas, encabezados de fila.

**Cuándo usarlo.** Siempre que se muestre una persona junto a su función en la furgoneta o su periodicidad de pago.

**Cuándo NO usarlo.** En todo el flujo de Campo, las insignias Q y M están deliberadamente ocultas: el ciclo de pago es información de gestión, no operativa, y no debe aparecer en la app de la furgoneta. Tampoco se usa `Badge` como decoración genérica: cada letra tiene un significado del catálogo y no se inventan códigos nuevos sin añadirlos antes a `BADGES` en `theme.js`.

**Implementación.** El tamaño no crece entre dispositivos (Doc3 §11): la insignia acompaña texto ya calibrado y crecer la desalinearía de la fila. El radio y el tamaño de letra se derivan de `size`, así que basta con cambiar ese número para escalarla entera.

```jsx
<Badge code="E" />              {/* círculo verde relleno, letra blanca */}
<Badge code="Q" size={16} />    {/* contorno, letra del color del ciclo */}
```

### `BadgeGroup`

**Propósito.** Agrupar las insignias de una misma persona con la separación correcta.

**Cuándo usarlo.** Cuando una persona tiene más de una condición a la vez: encargado y además quincenal, o encargado que también conduce.

**Implementación.** El orden del array es el orden de lectura: primero el rol, después el ciclo. Devuelve `null` si el array está vacío, así que se puede llamar sin condicionales alrededor.

```jsx
<BadgeGroup codes={['E', 'Q']} />
```

### `Button`

**Propósito.** Vocabulario de acción consistente. La variante dice qué tan importante es la acción, no de qué color se quiere el botón.

- `primary` — la acción principal de la pantalla. Una sola por pantalla.
- `dark` — acción principal en una superficie donde `primary` no contrasta.
- `outline` — acciones secundarias: cancelar, volver, alternativas.
- `danger` — acciones destructivas.
- `gold` — acento reservado; hoy comparte estilo con `dark`.
- `pill` — filtros y chips activables. Es la única variante que usa `active`.

**Cuándo NO usarlo.** Para navegación entre secciones se usa `TabBar` de `layout/`. Para elegir entre opciones en una cuadrícula se usa `OptionTile`, que es más grande y admite descripción.

**Implementación.** Alturas de 48px en teléfono y tablet y 44px en computadora; la variante `pill`, 36px y 32px (Doc3 §8.1). La reducción en computadora se compensa con `hover`, que en la maqueta no existía. `disabled` baja la opacidad y bloquea el cursor: un botón deshabilitado siempre debe ir acompañado de un texto que explique qué falta para habilitarlo.

```jsx
<Button variant="primary" icon={<Send className="w-4 h-4" />} onClick={enviar} disabled={!hayChofer}>
  Enviar parte
</Button>

<Button variant="pill" active={filtro === 'todos'} onClick={() => setFiltro('todos')} full={false}>
  Todos
</Button>
```

### `Card`

**Propósito.** Unidad visual mínima del sistema, repetida en toda la app. Fondo blanco, borde de 1px en `line`, radio `rounded-xl`.

**Cuándo usarlo.** Para agrupar información que se lee junta. Casi todo el contenido de una pantalla vive dentro de una `Card`.

**Cuándo NO usarlo.** Anidada dentro de otra `Card`: dos bordes seguidos crean una jerarquía que el sistema no tiene. Para separar contenido dentro de una tarjeta se usa un separador de 1px en `line`.

**Implementación.** No lleva sombra por defecto (Doc3 §10.2): se apoya en el borde. Si la tarjeta es clicable, `interactive` es **obligatorio** — añade la sombra al pasar el cursor y la reducción de escala al pulsar, que son las dos señales de que se puede tocar. Sin ellas, en computadora nada indica que la tarjeta responde.

`padding="none"` es el caso de las tarjetas con tabla interna, que gestionan su propio relleno por filas.

```jsx
<Card>
  <Eyebrow>Día del parte</Eyebrow>
  ...
</Card>

<Card padding="none" className="overflow-hidden">…tabla…</Card>
<Card interactive onClick={abrirFicha}>…</Card>
```

### `Cifra`

**Propósito.** Separar visualmente "dato" de "texto". Aplica IBM Plex Mono con números tabulares, de modo que las cantidades alinean columna con columna aunque cambien de valor.

**Cuándo usarlo.** En **cualquier** número que el usuario vaya a comparar o sumar: horas, destajos, plazas, totales, contadores.

**Cuándo NO usarlo.** En números que forman parte de una frase y no se comparan con nada ("3 de agosto"). Ahí el monoespaciado rompe el ritmo de lectura.

**Implementación.** `size="figure"` aplica la escala de cifra destacada (22 / 25 / 28 px) para totales y montos; el tamaño por defecto es el de una fila de tabla.

```jsx
<span>Total: <Cifra tone="strong" size="figure">1 240,50 €</Cifra></span>
<span><Cifra>{personas.length}</Cifra>/<Cifra>{furgoneta.plazas}</Cifra> plazas</span>
```

### `ConfirmModal`

**Propósito.** Poner una pausa antes de una acción que no se puede deshacer.

**Cuándo usarlo.** Solo ante acciones irreversibles: eliminar jornadas, dar de baja a un trabajador o a un vehículo.

**Cuándo NO usarlo.** Ante acciones reversibles. Pedir confirmación de todo enseña al usuario a confirmar sin leer, y entonces la confirmación deja de proteger nada.

**Implementación.** El botón de confirmar nombra la acción — "Eliminar", no "Aceptar" — para que se pueda decidir leyendo solo el botón. `description` debe decir la consecuencia concreta, no repetir el título.

```jsx
<ConfirmModal
  open={abierto}
  title="Eliminar 3 jornadas"
  description="Se borrarán del parte del 3 de agosto. No se puede deshacer."
  confirmLabel="Eliminar"
  onConfirm={eliminar}
  onCancel={() => setAbierto(false)}
/>
```

### `EmptyState`

**Propósito.** Convertir una lista vacía en una invitación a actuar.

**Cuándo usarlo.** Siempre que una lista pueda quedar vacía. Nunca se deja una zona en blanco sin explicación.

**Implementación.** `title` dice qué ocurre y `hint` dice cómo continuar; los dos cambian según el contexto. El mismo listado dice "Todavía no hay partes de hoy · Registra la primera furgoneta desde el botón de abajo" al mirar hoy, y "No hay partes registrados este día · Prueba con otra fecha" al consultar el pasado. El texto no se disculpa ni es vago sobre lo que pasó.

```jsx
<EmptyState
  title="Todavía no hay partes de hoy"
  hint="Registra la primera furgoneta desde el botón de abajo."
/>
```

### `Eyebrow`

**Propósito.** Ritmo tipográfico constante: toda tarjeta y todo bloque se abren igual, sin importar su contenido.

**Cuándo usarlo.** Como primera línea de una tarjeta o de un bloque, y como etiqueta de campo dentro de formularios (ahí ya lo aplica `Input` por dentro).

**Cuándo NO usarlo.** Como título de pantalla: para eso está `PageHeader` de `layout/`. `Eyebrow` es una etiqueta de categoría, no un titular.

**Implementación.** 10px en teléfono y tablet, 11px en computadora — crece muy poco a propósito (Doc1 §2.2). `as` debe reflejar la jerarquía real del documento (`h2`, `h3`), no elegirse por su tamaño.

```jsx
<Eyebrow>Agregar personal</Eyebrow>
<Eyebrow as="h3" spaced={false}>Sin registrar</Eyebrow>
```

### `IconTile`

**Propósito.** Marcador visual al inicio de una fila o tarjeta, para dar un punto de anclaje a la vista en listas largas.

**Cuándo NO usarlo.** Como único portador de significado. Es decorativo — lleva `aria-hidden` — y el significado siempre lo aporta el texto que lo acompaña.

```jsx
<IconTile icon={Truck} size={32} />
```

### `InlineField`

**Propósito.** Editar un dato numérico sin salir de la fila de la tabla.

**Cuándo usarlo.** Solo en tablas editables, como las horas y el destajo del reporte diario en Central.

**Cuándo NO usarlo.** En formularios. Es un componente aparte, deliberadamente más pequeño y denso, y no sigue la tabla de tamaños de `Input` (Doc3 §9). Confundirlos hace que un formulario parezca una hoja de cálculo.

**Implementación.** Radio de 4px, ancho fijo y texto alineado a la derecha para que las columnas de cifras cuadren. No tiene etiqueta visible — la cabecera de la columna hace ese trabajo — así que **`ariaLabel` es obligatorio**.

```jsx
<InlineField ariaLabel={`Horas de ${persona.nombre}`} type="number" inputMode="decimal" value={horas} onChange={…} />
```

### `Input`

**Propósito.** Unificar todos los formularios del sistema, desde "Horas" en el modal de jornada hasta "Nombre" al crear un trabajador.

**Implementación.** Altura de 46px en teléfono y tablet y 42px en computadora; texto de 14px que sube a 15px en computadora (Doc3 §9).

**Corrección aplicada:** en la maqueta el borde de foco era `focus:border-emerald-600`, un verde fijo de Tailwind que rompía la paleta al activar el tema Pizarra. Aquí el foco usa el token `primary` (Doc1 §1.3, punto 1 del checklist).

`mono` aplica la tipografía de cifra al valor: úsalo en todo campo numérico. `error` sustituye a `hint`, tiñe el borde y marca `aria-invalid`.

```jsx
<Input label="Horas" type="number" inputMode="decimal" mono value={horas} onChange={e => setHoras(e.target.value)} />
<Input label="Teléfono" hint="Se usará para avisos de pago." />
<Input label="Destajo €" mono error="Introduce una cantidad válida." />
```

### `Keypad` y `PinDots`

**Propósito.** Introducir un PIN con guantes, de pie y a pleno sol. Teclas grandes, cuadradas y muy separadas del resto de la interfaz.

**Implementación.** Ancho tope de 276px y centrado: nunca intenta ocupar más espacio del que necesita, por lo que funciona igual en los tres dispositivos sin una sola regla responsiva (Doc3 §12). Esa ausencia es intencional y no un punto pendiente.

Es presentacional: no conoce el PIN, no lo valida y no decide qué pasa al completarlo. Esa lógica vive en la pantalla.

```jsx
<PinDots length={pin.length} shake={error} />
<Keypad
  onPress={d => pin.length < 4 && setPin(pin + d)}
  onDelete={() => setPin(pin.slice(0, -1))}
  canDelete={pin.length > 0}
/>
```

### `Modal`

**Propósito.** Pedir un dato o confirmar algo sin abandonar la pantalla actual.

**Implementación.** Hoja anclada abajo en teléfono, diálogo centrado desde tablet (Doc2 §7). Ese cambio de posición ya es el comportamiento correcto del sistema y no debe alterarse: en teléfono la hoja queda al alcance del pulgar. El indicador de arrastre solo se muestra en teléfono. Cierra con el botón, con clic en el fondo y con la tecla Escape.

**Cuándo NO usarlo.** Para flujos de varios pasos: eso es `FullScreenPanel` de `layout/`. Un modal aloja una decisión, no un proceso.

```jsx
<Modal open={abierto} eyebrow="Jornada de" title={persona.nombre} onClose={cerrar}>
  <div className="grid grid-cols-2 gap-3">
    <Input label="Horas" mono … />
    <Input label="Destajo €" mono … />
  </div>
</Modal>
```

### `OptionTile`

**Propósito.** Patrón de elección del sistema: elegir la furgoneta, marcar los roles de una persona. Sustituye al radio y al checkbox nativos, demasiado pequeños para usarse en campo.

**Implementación.** El estado seleccionado se marca con borde de color **y** con una palomita — o con la insignia que se pase en `leading` — nunca solo con color. `disabled` es para opciones no disponibles, como una furgoneta ya registrada hoy o un rol ya ocupado por otra persona; conviene acompañarlo de `note` explicando por qué.

`layout="row"` es la variante compacta horizontal, pensada para las casillas de rol.

```jsx
<OptionTile
  title="Hedwig" meta="8 plazas"
  note={ocupada ? 'Ya registrada hoy' : 'Libre'}
  selected={elegida === 'hedwig'} disabled={ocupada}
  onClick={() => setElegida('hedwig')}
/>

<OptionTile layout="row" leading={<Badge code="C" size={20} />} title="Chofer" selected={esChofer} onClick={…} />
```

### `SearchInput`

**Propósito.** Filtrar una lista en vivo.

**Implementación.** Es un filtro, no un formulario: no lleva etiqueta visible ni botón de enviar, y la lista de abajo se reduce mientras se escribe. `onChange` recibe el texto ya extraído, no el evento. El botón de limpiar aparece solo cuando hay algo que limpiar. El foco usa `primary`, no el anillo verde de la maqueta.

Conviene mostrar bajo la lista un contador del tipo "X de Y disponibles", para que quede claro que se está viendo un subconjunto.

```jsx
<SearchInput value={texto} onChange={setTexto} placeholder="Buscar persona por nombre" />
```

### `StatusDot`

**Propósito.** Señal de estado compacta al inicio de una etiqueta.

**Cuándo NO usarlo.** Solo. El color por sí mismo no es accesible: siempre va seguido del texto del estado.

```jsx
<span className="flex items-center gap-1.5 text-[11px]"><StatusDot tone="ok" /> Cerrada</span>
<span className="flex items-center gap-1.5 text-[11px]"><StatusDot tone="pendiente" /> Pendiente</span>
```

### `Stepper`

**Propósito.** Decir en qué punto de un flujo está el usuario y cuánto queda.

**Implementación.** Cada paso ocupa el mismo ancho y se colorea según su estado: completado (`primary`), actual (`navyDark`) o pendiente (`line`, con la etiqueta atenuada). No se muestra numeración: las etiquetas ya nombran el paso y el número sería redundante. `current` empieza en 1.

```jsx
<Stepper steps={['Furgoneta', 'Equipo', 'Enviar']} current={paso} />
```

### `Wordmark`

**Propósito.** Presencia de marca en la pantalla de acceso y en la cabecera de Central.

**Implementación.** 15px fijos en los tres dispositivos: es marca, no jerarquía, y no participa de la escala tipográfica (Doc1 §2.2). Lo único que cambia entre variantes es el interletrado. Usar `as="h1"` solo cuando el logotipo es realmente el título de la pantalla.

```jsx
<Wordmark variant="lock" />
<Wordmark variant="header" as="p" />
```

---

## Requisitos del proyecto

Estos componentes dan por hecho tres cosas fuera de la carpeta.

**1. Tokens en `src/lib/theme.js`.** Colores, escala tipográfica, anchos y espaciado. Si un valor no está ahí, no debe escribirse en un componente: se añade primero al tema.

**2. Configuración de Tailwind.** Los radios y las sombras del tema Pizarra deben declararse en `tailwind.config.js`, no en un archivo CSS de parches:

```js
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      borderRadius: { DEFAULT: '4px', lg: '0.3rem', xl: '0.4rem', '2xl': '0.5rem', '3xl': '0.5rem' },
      boxShadow: {
        raised: '0 0 0 1px rgba(16,24,32,.08), 0 2px 6px rgba(16,24,32,.05)',
        sheet:  '0 0 0 1px rgba(16,24,32,.1), 0 -4px 16px rgba(16,24,32,.08)',
      },
      scale: { 97: '.97' }, // corrige el uso de active:scale-97 heredado del prototipo
    },
  },
};
```

**3. CSS global.** Las dos clases tipográficas del sistema, la animación de las hojas y el color del foco:

```css
.cifra   { font-family: 'IBM Plex Mono', ui-monospace, monospace;
           font-variant-numeric: tabular-nums; letter-spacing: -.02em; }
.eyebrow { font-size: 10px; font-weight: 500; letter-spacing: .1em; text-transform: uppercase; }

:focus-visible { outline: 1.5px solid #24597F; outline-offset: 2px; border-radius: 6px; }

@keyframes slideUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
@keyframes shake {
  10%,90% { transform: translateX(-2px); } 20%,80% { transform: translateX(4px); }
  30%,50%,70% { transform: translateX(-6px); } 40%,60% { transform: translateX(6px); }
}
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: .01ms !important; } }
```

Solo se usan dos pesos de texto en toda la app: 500 para texto estándar e interactivo y 600 para títulos y énfasis (Doc1 §2.1). No se usa 400 ni 700.

---

## Estado del checklist de integridad (Doc3 §13)

| Punto | Estado en esta carpeta |
|---|---|
| Foco de los campos con el token `primary` | Corregido en `Input`, `SearchInput` e `InlineField` |
| Escala tipográfica responsiva | Implementada vía `type` en `theme.js` |
| Estados `hover` en botones, pestañas y tarjetas | Añadidos en `Button`, `Card interactive`, `OptionTile`, `TabBar` |
| `active:scale-97` sin efecto | Eliminado del código; queda pendiente declarar `scale.97` en la configuración de Tailwind |
| Radio de botón unificado entre Campo y Central | **Pendiente de decisión del equipo.** Hoy ambos usan `rounded-lg`, que el tema Pizarra reescribe a `.3rem` |
| Tope de ancho para monitores muy grandes | **Pendiente de decisión.** Hoy el contenido deja de crecer en 896px |

---

## Al añadir un componente nuevo

1. Comprobar que no conoce el negocio; si lo conoce, va en `domain/`.
2. Leer todos sus colores y tamaños de `theme.js`.
3. Aplicar la escala responsiva con `type`, nunca con un tamaño en píxeles suelto.
4. Áreas táctiles de al menos 34px en teléfono y tablet; en computadora se puede bajar a 32px, pero solo si se añade `hover`.
5. Foco visible por teclado y nombre accesible en todo control sin texto.
6. Añadirlo a `index.js` y a la tabla de inventario de este documento.
