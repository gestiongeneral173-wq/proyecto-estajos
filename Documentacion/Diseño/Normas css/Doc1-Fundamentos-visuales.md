# ESTAJOS Campo — Diseño Responsivo (Tema Pizarra)
## Documento 1 de 3 — Fundamentos visuales

Este es el primero de tres documentos que definen el sistema de diseño responsivo de la app de campo de ESTAJOS (el flujo de registro de furgonetas y trabajadores), tomando como base visual el tema desbloqueado con el PIN 7890 ("Pizarra"). Los valores se extrajeron directamente del código de la maqueta, verificando cada uno sobre su uso real. Se distinguen dos tipos de valor en los tres documentos:

- **(Implementado):** el valor ya existe en el código de la maqueta, verificado directamente.
- **(Propuesta):** el valor no existe todavía en el código; se define aquí para completar el sistema de forma coherente con lo ya implementado, y debe confirmarse con el equipo antes de programarse.

La maqueta actual solo define comportamiento responsivo para contenedores, cuadrículas y modales. Tipografía, espaciado interno y tamaños de botón son, hoy, fijos para cualquier tamaño de pantalla. Buena parte de estos documentos son las propuestas necesarias para que esos elementos también respondan correctamente en tablet y computadora.

**Este documento cubre:** puntos de quiebre, paleta de color y elevación, y tipografía.
**Documento 2:** contenedores, espaciado, radios de borde, navegación y modales.
**Documento 3:** botones e interacción, campos de formulario, tarjetas, iconografía, pantalla de PIN y checklist de integridad.

---

## Puntos de quiebre

La maqueta define únicamente dos puntos de quiebre (no existe un nivel intermedio tipo "md"). Este conjunto de documentos adopta esos mismos dos puntos para separar los tres dispositivos:

| Dispositivo | Rango | Prefijo de clase |
|---|---|---|
| Teléfono | 0 – 639px | Sin prefijo (estilos base) |
| Tablet | 640 – 1023px | `sm:` |
| Computadora | 1024px en adelante | `lg:` |

**Punto pendiente:** no hay un tercer punto de quiebre para pantallas muy grandes (por ejemplo 1440px o más); en computadora, el contenido deja de crecer a partir de 1024px. Si se prevé uso en monitores grandes, conviene definir un tope adicional (`xl:`) para que el contenido no se vea perdido en el centro de la pantalla.

---

## 1. Paleta de color y elevación — Tema Pizarra

La paleta no cambia entre dispositivos: los mismos colores se usan en teléfono, tablet y computadora. Se documenta una sola vez.

### 1.1 Colores del tema (Implementado)

| Token | Hex | Función |
|---|---|---|
| `navyDark` | #101820 | Texto principal, encabezados, botones oscuros, keypad de PIN |
| `navyMedium` | #2B3A4A | Iconos y texto de énfasis medio |
| `primary` | #24597F | Acción principal, estado activo, elementos confirmados |
| `gold` | #6B7684 | Acento decorativo (uso puntual, fondos suaves) |
| `appBg` | #EEF1F4 | Fondo general de la app |
| `chatBg` | #EEF1F4 | Fondo de la pantalla de flujo de registro (igual a `appBg` en este tema) |
| `danger` | #A23B3B | Estados negativos, pendientes, alertas |
| `line` | #D7DEE5 | Bordes y separadores |
| `muted` | #66707C | Texto secundario, etiquetas, iconos neutros |

A diferencia del panel Central (que usa clases de Tailwind precompiladas para el color), aquí los colores se aplican en tiempo real mediante estilos en línea que leen el objeto del tema activo. Esto permite cambiar de tema sin recompilar el CSS, pero exige que **todo color nuevo que se agregue use este mismo mecanismo**, no una clase de color de Tailwind escrita a mano — de lo contrario, ese elemento no cambiará de color si se cambia de tema, como ya ocurre en un caso detectado (ver 1.3).

### 1.2 Elevación (sombras) — específica del tema Pizarra (Implementado)

Las sombras también cambian de tono según el tema activo, usando el color oscuro del propio tema en vez de negro puro. Para Pizarra:

| Clase | Valor | Uso |
|---|---|---|
| `shadow-raised` | `0 0 0 1px rgba(16,24,32,.08), 0 2px 6px rgba(16,24,32,.05)` | Botón flotante principal, elementos que deben "flotar" sobre el contenido |
| `shadow-sheet` | `0 0 0 1px rgba(16,24,32,.1), 0 -4px 16px rgba(16,24,32,.08)` | Panel/hoja que se desliza desde abajo (modales, formulario superpuesto) |
| `shadow-sm` | Sombra estándar de Tailwind (sin teñir) | Uso puntual, no ligado al tema |

### 1.3 Inconsistencia detectada: color de foco no sigue el tema

El campo de texto base tiene el borde de foco escrito como `focus:border-emerald-600`, un verde fijo de Tailwind, en vez de usar el token `primary` del tema activo. Con el tema Pizarra activo (`primary` = azul #24597F), al tocar un campo de texto el borde se pone verde esmeralda en lugar de azul, rompiendo la paleta del tema. **Debe corregirse antes de desarrollo**, sustituyendo el color fijo por el token `primary` aplicado dinámicamente, igual que el resto de los colores del sistema.

### 1.4 Colores semánticos estándar (Implementado)

Al igual que en el resto del proyecto, ciertos estados usan la paleta estándar de Tailwind en vez de los tokens del tema, de forma consistente:

| Color | Significado |
|---|---|
| Verde (`green-100/700`, `green-300` de borde) | Confirmación / envío exitoso |
| Rojo (`red-50/200`, `red-500` en hover) | Eliminar, advertencia dentro de un formulario |

---

## 2. Tipografía

### 2.1 Fuentes (Implementado)

Se cargan dos familias tipográficas desde Google Fonts, a diferencia del panel Central, que no carga ninguna:

- **Instrument Sans** (pesos 400, 500, 600): tipografía base de toda la interfaz.
- **IBM Plex Mono** (pesos 400, 500): reservada exclusivamente para cifras monetarias, mediante una clase propia (`cifra`) que además fija números tabulares y un espaciado de letras ligeramente negativo, para que las cantidades se alineen con precisión.

Solo se usan dos pesos de texto en toda la app: **medium (500)** para texto estándar e interactivo, y **semibold (600)** para títulos y énfasis. No se usa el peso regular (400) de forma explícita ni el peso bold (700).

### 2.2 Escala tipográfica

La maqueta ya tiene una escala deliberada y precisa en píxeles (no la escala por defecto de Tailwind), verificada por frecuencia de uso real. Esta escala es la que se mantiene como base en teléfono; tablet y computadora son una propuesta de crecimiento moderado, dejando el texto de lectura densa casi sin cambios y creciendo más en los títulos y cifras, que es donde más se nota la diferencia de distancia de lectura entre un teléfono en la mano y un monitor de escritorio.

| Nivel | Teléfono (Implementado) | Tablet (Propuesta) | Computadora (Propuesta) | Uso |
|---|---|---|---|---|
| Eyebrow / etiqueta | 10px, medium, mayúsculas, tracking 0.1em | 10px (igual) | 11px | Labels de campo, encabezados de sección menores |
| Micro-texto | 11px (el valor más usado de la app) | 11px (igual) | 12px | Metadatos, marcas de tiempo, texto truncado secundario |
| Cuerpo pequeño | 12px | 12px (igual) | 13px | Badges, texto de apoyo |
| Cuerpo estándar / pestañas | 13px | 14px | 14px | Texto de pestañas de navegación, botones tipo "pill", listas |
| Cuerpo de botón e input | 14px | 14px (igual) | 15px | Botones de acción principal, campos de formulario |
| Subtítulo / nombre de elemento | 15px | 16px | 17px | Nombre de trabajador o furgoneta, título de modal |
| Título de pantalla | 17px | 19px | 21px | Encabezado de cada pantalla o tarjeta |
| Cifra destacada (mono) | 22px | 25px | 28px | Montos de dinero, totales |
| Título grande / saludo | 26px | 30px | 34px | Encabezado principal de la pantalla de inicio |
| Logotipo (ESTAJOS) | 15px, tracking 0.3em, mayúsculas | 15px (igual) | 15px (igual) | Pantalla de PIN; no necesita crecer, es un elemento de marca fijo |

**Regla:** el micro-texto y las etiquetas (eyebrow) casi no crecen entre dispositivos a propósito — sirven para metadatos que deben mantenerse discretos y compactos incluso en pantallas grandes. El crecimiento se concentra en títulos, subtítulos y cifras, que son los elementos que definen la jerarquía visual de cada pantalla.
