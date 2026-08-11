# ESTAJOS Campo — Diseño Responsivo (Tema Pizarra)
## Documento 3 de 3 — Componentes, casos especiales y checklist

Tercero de tres documentos que definen el sistema de diseño responsivo de la app de campo de ESTAJOS, basado en el tema desbloqueado con el PIN 7890 ("Pizarra"). Se mantiene la misma convención de los documentos anteriores:

- **(Implementado):** el valor ya existe en el código de la maqueta, verificado directamente.
- **(Propuesta):** el valor no existe todavía en el código; se define aquí para completar el sistema, y debe confirmarse con el equipo antes de programarse.

Los tres dispositivos y sus puntos de quiebre (Teléfono, Tablet desde `sm:` 640px, Computadora desde `lg:` 1024px) están definidos en el Documento 1.

**Este documento cubre:** botones e interacción, campos de formulario, tarjetas, iconografía, pantalla de PIN y el checklist de integridad final.
**Documento 1:** puntos de quiebre, paleta de color y elevación, tipografía.
**Documento 2:** contenedores, espaciado, radios de borde, navegación y modales.

---

## 8. Botones e interacción

### 8.1 Tamaño de botones (Implementado en teléfono, con propuesta para tablet y computadora)

| Variante | Teléfono (Implementado) | Tablet (Propuesta) | Computadora (Propuesta) |
|---|---|---|---|
| Botón principal (ancho completo) | Alto mínimo 48px, texto 14px | Alto mínimo 48px (igual) | Alto mínimo 44px, texto 15px |
| Botón tipo "pill" (compacto/filtro) | Alto mínimo 36px, texto 13px | Alto mínimo 36px (igual) | Alto mínimo 32px, texto 14px |
| Pestaña de navegación | Alto mínimo 34px, texto 13px | Alto mínimo 34px (igual) | Alto mínimo 32px, texto 14px |

En teléfono y tablet se mantiene el estándar táctil de accesibilidad (áreas de toque de al menos 34–48px, según la importancia de la acción). En computadora se permite reducir ligeramente el tamaño porque se asume precisión de mouse, pero sin bajar del mínimo cómodo de clic (32px), y siempre añadiendo un estado de `hover` que compense la reducción de tamaño (ver 6.2).

### 8.2 Estados de interacción

| Estado | Teléfono y Tablet (Implementado) | Computadora (Propuesta) |
|---|---|---|
| Al presionar (`active`) | Reducción de escala (90%, 95%, 98% o 99% según el botón) | Se mantiene igual, como confirmación adicional al clic |
| Al pasar el cursor (`hover`) | No aplica (no hay cursor en pantalla táctil) | Debe añadirse: cambio sutil de fondo u opacidad en botones y pestañas de navegación, que hoy no lo tienen |
| Deshabilitado | Opacidad reducida (35%–70% según el botón) y cursor bloqueado | Igual |

**Inconsistencia detectada:** las pestañas de navegación no tienen ningún estado `hover` definido. En teléfono y tablet esto no se nota porque no hay cursor, pero en computadora, pasar el mouse sobre una pestaña inactiva no produce ninguna respuesta visual hasta hacer clic. Se recomienda añadir un cambio de fondo sutil (por ejemplo, el color `line` del tema) exclusivamente para computadora.

### 8.3 Bug de integridad detectado — heredado del resto del proyecto

Al igual que en el panel Central, se encontró un uso de `active:scale-97`, un valor que no existe en la escala por defecto de Tailwind y que, verificado contra el CSS compilado de esta maqueta, tampoco genera ninguna regla aquí. Es un solo caso (frente a los 23 de Central), pero confirma que es un error recurrente del equipo al escribir esta clase, no un caso aislado. **Se recomienda revisar todo el proyecto (ambas superficies) en un mismo paso** y sustituir por un valor válido, o añadir `97` como valor personalizado en la configuración de Tailwind si se quiere conservar ese porcentaje exacto.

---

## 9. Campos de formulario

| Propiedad | Teléfono (Implementado) | Tablet (Propuesta) | Computadora (Propuesta) |
|---|---|---|---|
| Alto mínimo | 46px | 46px (igual) | 42px |
| Radio | 8px | 8px (igual) | 8px (igual) |
| Texto | 14px | 14px (igual) | 15px |
| Etiqueta (label) | Clase `eyebrow`: 10px, mayúsculas | Igual | 11px |
| Borde de foco | Verde fijo de Tailwind (ver inconsistencia en el Documento 1, sección 1.3) | Corregido al token `primary` del tema | Corregido al token `primary` del tema |

Los campos de datos en línea (edición rápida dentro de filas de tabla) son un componente aparte, deliberadamente más pequeño y denso; no deben confundirse con los campos de formulario estándar ni seguir esta misma tabla.

---

## 10. Tarjetas y cuadrícula de contenido

### 10.1 Columnas de la cuadrícula principal (Implementado)

La cuadrícula de furgonetas/registros del día ya está resuelta de forma responsiva:

| Teléfono | Tablet | Computadora |
|---|---|---|
| 1 columna | 2 columnas | 3 columnas |

### 10.2 Comportamiento de la tarjeta individual

| Propiedad | Teléfono (Implementado) | Tablet (Propuesta) | Computadora (Propuesta) |
|---|---|---|---|
| Radio | 12px | 12px (igual) | 12px (igual) |
| Sombra | Sin sombra por defecto (se apoya en fondo y borde) | Igual | Sombra suave (`shadow-sm`) al pasar el cursor, para dar affordance de que es interactiva |
| Interacción | Reducción de escala al tocar | Igual | Añadir `hover` con elevación sutil, ya que en computadora no existe el gesto de toque que hoy comunica que la tarjeta es interactiva |

---

## 11. Iconografía

La librería de iconos y sus tamaños se mantienen constantes en los tres dispositivos: los iconos están calibrados para acompañar texto de un tamaño específico, y hacerlos crecer junto con la tipografía en computadora los desalinearía visualmente del resto del sistema.

| Tamaño | Frecuencia | Uso |
|---|---|---|
| 14px | 28 usos | Iconos de pestañas de navegación, texto en línea |
| 16px | 50 usos (el más frecuente) | Iconos de botón, iconos de fila |
| 20px | 3 usos | Iconos de énfasis (botón de borrar del teclado numérico) |
| 12px | 3 usos | Indicadores pequeños |

**Propuesta exclusiva de computadora:** el área de clic alrededor de un icono-botón puede reducirse ligeramente (de 36px a 32px de zona de toque) manteniendo el icono en su tamaño actual, ya que en computadora la precisión del cursor hace innecesario reservar tanto espacio táctil.

---

## 12. Pantalla de PIN — caso especial

La pantalla de bloqueo por PIN no tiene ninguna clase responsiva en el código, y no la necesita: el teclado numérico está limitado a un ancho fijo de 276px y centrado en la pantalla mediante disposición flexible. Este patrón ya funciona correctamente en cualquier tamaño de pantalla sin ajustes adicionales, porque nunca intenta ocupar más espacio del que necesita. Se documenta aquí únicamente para dejar constancia de que su ausencia de reglas responsivas es intencional, y no un punto pendiente por resolver.

Esta pantalla no tiene, por lo tanto, subcategorías de Teléfono, Tablet y Computadora: su comportamiento es idéntico en los tres.

---

## 13. Checklist de integridad antes de desarrollo

- [ ] Corregir el color de foco de los campos de texto para que use el token `primary` del tema activo en vez de un verde fijo de Tailwind (Documento 1, sección 1.3).
- [ ] Unificar el ancho máximo de la barra de navegación con el del contenido principal en computadora (Documento 2, sección 3.1).
- [ ] Definir un tope de ancho adicional para monitores muy grandes, si se prevé ese uso (Documento 1, Puntos de quiebre).
- [ ] Implementar la escala tipográfica responsiva propuesta para tablet y computadora (Documento 1, sección 2.2), hoy inexistente en el código.
- [ ] Añadir estados `hover` a botones, pestañas de navegación y tarjetas interactivas, exclusivos de computadora (sección 8 de este documento, sección 10 de este documento, y sección 6 del Documento 2).
- [ ] Corregir el uso de `active:scale-97`, que no genera ningún efecto visual (sección 8.3 de este documento).
- [ ] Confirmar si el radio de botón de 8px de esta app debe unificarse con el de 12px del panel Central, como parte de una identidad de producto compartida (Documento 2, sección 5).
- [ ] Aplicar el relleno de página y espaciado propuestos para tablet y computadora (Documento 2, secciones 3 y 4), hoy fijos en el valor de teléfono.
