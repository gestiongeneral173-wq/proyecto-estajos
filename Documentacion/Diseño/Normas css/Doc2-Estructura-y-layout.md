# ESTAJOS Campo — Diseño Responsivo (Tema Pizarra)
## Documento 2 de 3 — Estructura y layout

Segundo de tres documentos que definen el sistema de diseño responsivo de la app de campo de ESTAJOS, basado en el tema desbloqueado con el PIN 7890 ("Pizarra"). Se mantiene la misma convención del documento 1:

- **(Implementado):** el valor ya existe en el código de la maqueta, verificado directamente.
- **(Propuesta):** el valor no existe todavía en el código; se define aquí para completar el sistema, y debe confirmarse con el equipo antes de programarse.

Los tres dispositivos y sus puntos de quiebre (Teléfono, Tablet desde `sm:` 640px, Computadora desde `lg:` 1024px) están definidos en el Documento 1.

**Este documento cubre:** contenedores y estructura de página, espaciado, radios de borde, navegación y modales.
**Documento 1:** puntos de quiebre, paleta de color y elevación, tipografía.
**Documento 3:** botones e interacción, campos de formulario, tarjetas, iconografía, pantalla de PIN y checklist de integridad.

---

## 3. Contenedores y estructura de página

### 3.1 Anchos máximos por tipo de pantalla (Implementado)

La maqueta ya resuelve el ancho de contenedor de forma distinta según el tipo de contenido, y esto está bien pensado: pantallas de exploración (listados) se ensanchan mucho en computadora, mientras que flujos de formulario se mantienen angostos para no perder legibilidad en líneas de texto muy largas.

| Componente | Teléfono | Tablet | Computadora |
|---|---|---|---|
| Contenido principal (Inicio, listado de furgonetas del día) | 448px (`max-w-md`) | 672px (`max-w-2xl`) | 896px (`max-w-4xl`) |
| Barra de navegación superior | 448px (`max-w-md`) | 672px (`max-w-2xl`) | 1024px (`max-w-5xl`) |
| Flujo de "Nuevo registro" (formulario de varios pasos) | 448px (`max-w-md`) | 576px (`max-w-xl`) | 576px (`max-w-xl`, no crece más) |
| Botón flotante inferior (CTA) | 448px (limitado por el viewport) | 384px (`max-w-sm`) | 384px (`max-w-sm`, hereda de tablet) |
| Hoja / modal inferior | Ancho completo, anclado abajo | 384px (`max-w-sm`), centrado | 384px (`max-w-sm`), centrado |

**Inconsistencia detectada:** en computadora, la barra de navegación llega a 1024px de ancho pero el contenido principal debajo se detiene en 896px. Al ser anchos distintos para elementos que deberían estar alineados verticalmente, la barra de navegación queda más ancha que el contenido que hay debajo, perdiendo alineación visual. **Se recomienda unificar ambos en el mismo ancho máximo** (896px es el más consistente con el resto de las pantallas).

### 3.2 Relleno de página (Propuesta salvo que se indique lo contrario)

| Elemento | Teléfono (Implementado) | Tablet (Propuesta) | Computadora (Propuesta) |
|---|---|---|---|
| Relleno horizontal de página | 16px (`px-4`) | 24px (`px-6`) | 32px (`px-8`) |
| Relleno superior del contenido principal | 28px (`pt-7`) | 36px (`pt-9`) | 48px (`pt-12`) |
| Relleno de la pantalla de PIN | 24px horizontal, 80px superior | Igual (pantalla de ancho fijo, no necesita cambiar) | Igual |

---

## 4. Espaciado

### 4.1 Separación entre elementos (gap)

| Contexto | Teléfono (Implementado) | Tablet (Propuesta) | Computadora (Propuesta) |
|---|---|---|---|
| Entre tarjetas de la cuadrícula principal | 12px (`gap-3`) | 16px (`gap-4`) | 20px (`gap-5`) |
| Entre icono y texto (uso general) | 8px (`gap-2`, el valor dominante) | 8px (igual) | 8px (igual) |
| Entre elementos de una lista vertical | 16px (`space-y-4`, valor más usado) | 16px (igual) | 20px (`space-y-5`) |

El espaciado fino (iconos con texto) se mantiene igual en los tres dispositivos: son relaciones de proximidad que no dependen del tamaño de pantalla. El espaciado que sí crece es el que separa bloques de contenido más grandes, para aprovechar el aire adicional disponible en pantallas más anchas.

### 4.2 Relleno interno de tarjetas y componentes

| Componente | Teléfono (Implementado) | Tablet (Propuesta) | Computadora (Propuesta) |
|---|---|---|---|
| Tarjeta de furgoneta / registro | 12px–16px según variante | 16px | 20px |
| Campo de inline de datos (edición rápida) | 4px vertical, 4px horizontal (compacto) | Igual (es un campo de dato puntual, no de lectura) | Igual |

---

## 5. Radios de borde

Los radios se mantienen constantes en los tres dispositivos: no es una propiedad que deba cambiar con el tamaño de pantalla, y cambiarla sin motivo rompería la identidad visual entre versiones. Se documentan aquí una sola vez, con su frecuencia real de uso.

| Radio | Frecuencia | Dónde se usa |
|---|---|---|
| 12px (`rounded-xl`) | 44 usos (el más frecuente) | Contenedores, tarjetas, teclado numérico del PIN |
| 8px (`rounded-lg`) | 18 usos | Botones de acción, campos de texto, iconos de botón |
| Completo (`rounded-full`) | 11 usos | Indicadores de progreso del PIN, avatares, insignias |
| 4px (`rounded`) | 7 usos | Campos de edición rápida en línea (dato compacto dentro de una tabla) |
| Solo esquinas superiores (`rounded-t-2xl` / `rounded-t-3xl`) | 2 usos | Hoja inferior y panel de "Nuevo registro" al deslizarse desde abajo |

**Nota de coherencia interna:** los botones de acción principal usan 8px de radio en esta app de campo, mientras que en el panel Central los botones equivalentes usan 12px. No es un error dentro de este documento, pero conviene que el equipo confirme si ambas superficies (Central y Campo) deben compartir el mismo radio de botón como parte de una identidad de producto única, o si la diferencia es intencional por tratarse de dos aplicaciones distintas.

---

## 6. Navegación

| Propiedad | Teléfono (Implementado) | Tablet (Implementado) | Computadora (Implementado, con una propuesta) |
|---|---|---|---|
| Patrón | Fila horizontal de pestañas con desplazamiento lateral | Igual, contenedor más ancho (672px) | Igual, contenedor más ancho (1024px, ver inconsistencia en la sección 3.1 de este documento) |
| Pestaña activa | Fondo `primary`, texto blanco | Igual | Igual |
| Pestaña inactiva | Texto `muted`, sin fondo | Igual | Igual, más estado `hover` (propuesta, ver Documento 3, sección 8.2) |

No se propone cambiar el patrón de navegación a un menú lateral fijo en computadora: la maqueta ya resuelve el crecimiento de esta barra ensanchando su contenedor, y ese es el patrón que se mantiene y se corrige (alineándolo con el contenido, sección 3), en vez de introducir un patrón de navegación distinto al que ya está diseñado.

---

## 7. Modales y paneles superpuestos

| Propiedad | Teléfono (Implementado) | Tablet (Implementado) | Computadora (Implementado) |
|---|---|---|---|
| Posición | Hoja anclada a la parte inferior de la pantalla | Diálogo centrado | Diálogo centrado |
| Radio | Solo esquinas superiores (16px) | Todas las esquinas (12px) | Todas las esquinas (12px) |
| Indicador de arrastre (línea superior) | Visible | Oculto | Oculto |
| Ancho | Completo | 384px máximo | 384px máximo |
| Panel de "Nuevo registro" (pantalla completa superpuesta) | Ancho completo, margen superior de 40px | Ancho 576px, margen superior de 64px | Ancho 576px (no crece más, ver sección 3) |

Este comportamiento ya está completamente implementado y es coherente en los tres dispositivos: no se detectaron cambios necesarios.
