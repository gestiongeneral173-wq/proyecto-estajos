# `components/layout` — Estructura de pantalla

Componentes que no pintan contenido: lo colocan. Deciden el ancho máximo, el relleno de página, la posición de las barras fijas y cuántas columnas hay en cada dispositivo.

**Regla de pertenencia:** un componente va aquí si su trabajo es responder a *dónde* se coloca algo. Si responde a *qué* se muestra, va en `ui/` o en `domain/`.

**Motivo de existir:** la maqueta repetía la misma cadena `px-4 pt-7 max-w-md sm:max-w-2xl lg:max-w-4xl mx-auto` en cada pantalla. Con eso, cambiar un ancho obliga a tocar todas las pantallas y las inconsistencias aparecen solas — de hecho ya había una, con la barra de navegación llegando a 1024px y el contenido de debajo parándose en 896px. Aquí esa decisión vive en un único sitio.

---

## Inventario

| Componente | Responde a | Se usa en |
|---|---|---|
| `AppShell` | Fondo y altura de la pantalla completa | Toda pantalla de nivel superior |
| `PageContainer` | Ancho máximo y relleno de página | Todo contenido dentro de `AppShell` |
| `AppHeader` | Barra superior fija | Pantallas con navegación o salida |
| `TabBar` | Navegación entre secciones | Raíz de Central |
| `PageHeader` | Titular del contenido de la pantalla | Primera pieza del contenido |
| `Section` | Agrupación de bloques con espaciado propio | Pantallas largas de varios asuntos |
| `ContentGrid` | Columnas responsivas de tarjetas | Colecciones de elementos comparables |
| `BottomActionBar` | Acción principal fija al pie | Pantallas con una sola acción dominante |
| `FullScreenPanel` | Superposición a pantalla completa | Flujos de varios pasos |
| `CenteredScreen` | Columna única centrada | Acceso por PIN, carga, error |

```jsx
import { AppShell, PageContainer, AppHeader, ContentGrid } from '../layout';
```

---

## Anatomía de una pantalla

El orden de anidamiento es siempre el mismo y no debe alterarse:

```
AppShell                     fondo appBg + altura de viewport
├── AppHeader                barra fija, respeta la zona segura superior
├── TabBar                   (solo Central) navegación entre secciones
├── PageContainer            ancho máximo + relleno de página
│   ├── PageHeader           etiqueta + titular + contexto
│   ├── Section              bloque de contenido
│   └── ContentGrid          cuadrícula de tarjetas
└── BottomActionBar          acción principal fija al pie
```

Pantalla de inicio de Campo, completa:

```jsx
<AppShell hasBottomBar>
  <AppHeader wordmark onLogout={salir} />

  <PageContainer as="main" padTop>
    <PageHeader
      eyebrow="Parte del día"
      title={formatearFecha(fecha)}
      meta={<><Cifra>{cerradas.length}</Cifra> de <Cifra>{vehiculos.length}</Cifra> furgonetas cerradas</>}
      action={<SelectorFecha value={fecha} onChange={setFecha} />}
      below={fecha !== hoy && (
        <button onClick={() => setFecha(hoy)} className="text-[12px] font-medium" style={{ color: theme.primary }}>
          ← Volver a hoy
        </button>
      )}
    />

    {cerradas.length === 0
      ? <EmptyState title="Todavía no hay partes de hoy" hint="Registra la primera furgoneta desde el botón de abajo." />
      : <ContentGrid>{cerradas.map(v => <TarjetaFurgoneta key={v.id} … />)}</ContentGrid>}
  </PageContainer>

  <BottomActionBar>
    <Button variant="primary" icon={<Plus className="w-4 h-4" />} className="shadow-raised" onClick={abrirRegistro}>
      Registrar furgoneta
    </Button>
  </BottomActionBar>
</AppShell>
```

---

## Cada componente en detalle

### `AppShell`

**Propósito.** Fijar el fondo `appBg` y la altura mínima de viewport.

**Cuándo usarlo.** Como primer elemento de toda pantalla de nivel superior. Sin él, en pantallas de contenido corto el fondo blanco del navegador se ve por debajo y el fondo del tema queda partido.

**Cuándo NO usarlo.** Anidado. Solo hay un `AppShell` por pantalla.

**Implementación.** `hasBottomBar` reserva 112px al pie para que la última tarjeta no quede tapada por `BottomActionBar`. Es fácil olvidarlo: si el último elemento de una lista queda debajo del botón flotante, falta esta propiedad. `surface="flow"` usa el fondo del flujo de registro, que en el tema Pizarra coincide con `appBg` pero puede divergir en otro tema.

```jsx
<AppShell hasBottomBar>…</AppShell>
```

### `PageContainer`

**Propósito.** Centrar el contenido, darle su ancho máximo y su relleno horizontal. Es el componente más importante de la carpeta.

**Cuándo usarlo.** Envolviendo todo contenido dentro de `AppShell`. Ningún otro componente debe escribir `max-w-*` ni `px-*` de página por su cuenta.

**Implementación.** Los tres tamaños salen de Doc2 §3.1 y responden a tipos de contenido distintos:

| `size` | Teléfono | Tablet | Computadora | Para qué |
|---|---|---|---|---|
| `content` | 448 | 672 | 896 | Listados y pantallas de exploración |
| `form` | 448 | 576 | 576 | Flujos de formulario |
| `action` | 448 | 384 | 384 | Barras de acción y hojas |

Que `form` deje de crecer en 576px es deliberado: una línea de formulario más ancha obliga al ojo a recorrer demasiada distancia y se pierde la relación entre la etiqueta y su campo.

`padX` aplica el relleno horizontal de página (16 / 24 / 32) y `padTop` el relleno superior del contenido principal (28 / 36 / 48), ambos de Doc2 §3.2. `as="main"` en el contenido principal de cada pantalla, por accesibilidad.

```jsx
<PageContainer as="main" padTop>…</PageContainer>
<PageContainer size="form" className="py-4">…</PageContainer>
```

### `AppHeader`

**Propósito.** Barra superior fija: dónde estoy, cómo vuelvo, cómo salgo.

**Cuándo usarlo.** En toda pantalla que necesite orientación o una salida. Una sola por pantalla, salvo dentro de `FullScreenPanel`, que lleva la suya propia porque es una capa independiente.

**Implementación.** Una sola cabecera sirve a las dos superficies: `wordmark` sustituye el título por el logotipo en las pantallas raíz, mientras que las pantallas de detalle usan el título real de la ficha. `subtitle` da el contexto secundario ("Central"). El relleno superior respeta `env(safe-area-inset-top)`, imprescindible en teléfonos con muesca.

`right` permite añadir acciones antes del botón Salir, sin necesidad de crear una cabecera nueva.

```jsx
<AppHeader wordmark subtitle="Central" onLogout={salir} />
<AppHeader title={trabajador.nombre} subtitle="Ficha de trabajador" onBack={volver} />
```

### `TabBar`

**Propósito.** Cambiar de sección sin perder el contexto de dónde se está.

**Implementación.** Se mantiene el patrón de pestañas con desplazamiento lateral en los tres dispositivos (Doc2 §6). No se propone un menú lateral fijo en computadora: la barra ya resuelve el crecimiento ensanchando su contenedor, y cambiar de patrón entre dispositivos obliga a aprender dos navegaciones distintas para la misma app.

**Dos correcciones respecto a la maqueta:**

1. La barra comparte ancho máximo con el contenido principal (`width.content`). Antes llegaba a 1024px mientras el contenido se detenía en 896px, y en computadora quedaba visiblemente descolgada por la derecha (punto 2 del checklist de Doc3 §13).
2. Las pestañas inactivas tienen estado `hover`. Antes, en computadora, pasar el cursor sobre una pestaña no producía ninguna respuesta hasta hacer clic (Doc3 §8.2).

La pestaña activa usa fondo `primary` con texto blanco y marca `aria-current="page"`.

```jsx
<TabBar items={SECCIONES} value={tab} onChange={setTab} label="Secciones de Central" />

const SECCIONES = [
  { key: 'escanear', label: 'Escanear', icon: Scan },
  { key: 'reporte',  label: 'Reporte Diario', icon: ClipboardList },
  …
];
```

### `PageHeader`

**Propósito.** Abrir el contenido de la pantalla con su titular.

**Cuándo NO usarlo.** Confundido con `AppHeader`. Aquel es la barra fija de navegación; este es el titular del contenido y se desplaza con él. Una pantalla puede tener los dos; nunca dos `PageHeader`.

**Implementación.** La estructura es fija — etiqueta pequeña, título grande, línea de contexto — y ese orden es el ritmo de lectura del sistema. El título usa la escala de título grande (26 / 30 / 34 px), la más responsiva de todas, porque es el elemento que más acusa la distancia de lectura entre un teléfono en la mano y un monitor.

`action` es para un control alineado con el título, como el selector de fecha. `below` es para un enlace secundario que aparece de forma condicional, como "← Volver a hoy".

```jsx
<PageHeader eyebrow="Parte del día" title="Hoy · 3 de agosto de 2026" meta={…} action={…} below={…} />
```

### `Section`

**Propósito.** Agrupar bloques que pertenecen al mismo asunto dentro de una pantalla larga, con el espaciado vertical correcto.

**Cuándo NO usarlo.** Si el bloque contiene una sola tarjeta. En ese caso el `Eyebrow` va dentro de la propia `Card` y esta capa sobra.

**Implementación.** Aplica el espaciado entre bloques del sistema (16 / 16 / 20 px). El título se renderiza como `Eyebrow`, de modo que el ritmo es el mismo que el de las tarjetas.

```jsx
<Section title="Personal temporal" action={<Button variant="pill" full={false}>Ver todos</Button>}>
  <Card>…</Card>
  <Card>…</Card>
</Section>
```

### `ContentGrid`

**Propósito.** Cuadrícula responsiva: una columna en teléfono, dos en tablet, tres en computadora (Doc3 §10.1), con separación creciente de 12 / 16 / 20 px.

**Cuándo usarlo.** Para colecciones de elementos comparables entre sí — las furgonetas del día, las fichas de vehículo.

**Cuándo NO usarlo.** Para bloques distintos apilados en vertical: eso es `Section`. Una cuadrícula comunica "estos elementos son del mismo tipo y se comparan entre sí", y usarla con contenido heterogéneo miente sobre la relación entre las piezas.

**Implementación.** `maxCols={2}` limita a dos columnas en computadora. Conviene cuando la tarjeta contiene una tabla: a tres columnas, las columnas de horas y destajo se comprimen hasta romper.

```jsx
<ContentGrid>{furgonetas.map(f => <TarjetaFurgoneta key={f.id} … />)}</ContentGrid>
<ContentGrid maxCols={2}>…</ContentGrid>
```

### `BottomActionBar`

**Propósito.** Mantener siempre visible y al alcance del pulgar la acción principal de la pantalla.

**Cuándo usarlo.** Cuando una pantalla tiene una acción claramente dominante. Aloja **una sola**: dos botones en la barra inferior obligan a decidir antes de leer el contenido.

**Implementación.** El degradado hacia el fondo evita el corte duro cuando el contenido pasa por debajo, y el relleno inferior respeta `env(safe-area-inset-bottom)` para no quedar bajo la barra de gestos del teléfono. En tablet y computadora la barra se estrecha a 384px y queda centrada (Doc2 §3.1).

Dos requisitos que se olvidan con facilidad: la pantalla debe usar `<AppShell hasBottomBar>`, y el botón de dentro debe llevar `className="shadow-raised"`, que es lo que lo despega visualmente del contenido que pasa por detrás.

```jsx
<BottomActionBar>
  <Button variant="primary" className="shadow-raised" icon={<Plus className="w-4 h-4" />} onClick={…}>
    Registrar furgoneta
  </Button>
</BottomActionBar>
```

### `FullScreenPanel`

**Propósito.** Presentar un flujo de varios pasos por encima de la pantalla actual.

**Cuándo usarlo.** Para procesos: el registro de un parte, un alta larga. Cada paso reemplaza al anterior dentro del panel; los pasos no se apilan.

**Cuándo NO usarlo.** Para pedir un dato o confirmar algo: eso es `Modal` de `ui/`. Un modal aloja una decisión; un panel aloja un proceso.

**Implementación.** Deja ver el contenido anterior desenfocado en el margen superior, lo que mantiene la sensación de seguir dentro de la misma pantalla y de poder volver. En computadora no crece más allá de 576px. Lleva su propio `AppHeader` en `header`, con `onBack` para cerrar.

```jsx
<FullScreenPanel
  open={registroAbierto}
  title="Nuevo registro"
  header={<AppHeader title="Nuevo registro" onBack={cerrar} />}
>
  <PageContainer size="form" className="flex-1 overflow-y-auto py-4 space-y-3">
    <Stepper steps={['Furgoneta', 'Equipo', 'Enviar']} current={paso} />
    …
  </PageContainer>
</FullScreenPanel>
```

### `CenteredScreen`

**Propósito.** Pantallas de columna única sin navegación ni contenido desplazable: acceso por PIN, carga, error de conexión.

**Implementación.** No lleva reglas responsivas y no las necesita (Doc3 §12). Su contenido tiene ancho fijo y nunca intenta ocupar más espacio del que pide, así que se comporta igual en los tres dispositivos. Esa ausencia es intencional y no un punto pendiente por resolver.

El hueco flexible entre el contenido y `footer` empuja el pie al fondo de la pantalla sin recurrir a posicionamiento fijo, lo que evita que el teclado del teléfono lo tape al abrirse.

```jsx
<CenteredScreen
  footer={
    <button onClick={abrirCentral} className="flex items-center gap-1.5 text-[13px] font-medium min-h-[44px] px-4" style={{ color: theme.muted }}>
      <Lock className="w-4 h-4" /> Acceso Central
    </button>
  }
>
  <Wordmark variant="lock" />
  <p className="text-[13px] mt-3 text-center" style={{ color: error ? theme.danger : theme.muted }}>
    {error ? 'PIN incorrecto' : 'Introduce el PIN de la furgoneta'}
  </p>
  <PinDots length={pin.length} shake={error} />
  <Keypad onPress={…} onDelete={…} canDelete={pin.length > 0} />
</CenteredScreen>
```

---

## Puntos de quiebre

Solo hay dos, y son los de la maqueta (Doc1). No se añaden niveles intermedios: cada punto de quiebre nuevo multiplica los estados que hay que revisar en cada cambio.

| Dispositivo | Rango | Prefijo |
|---|---|---|
| Teléfono | 0 – 639px | sin prefijo |
| Tablet | 640 – 1023px | `sm:` |
| Computadora | desde 1024px | `lg:` |

**Pendiente de decisión del equipo:** no existe un tope para monitores muy grandes. A partir de 1024px el contenido deja de crecer y queda centrado en pantallas de 1440px o más. Si se confirma ese uso, se añade un cuarto ancho a `width` en `theme.js` — no una clase suelta en una pantalla.

---

## Qué NO hacer

- Escribir `max-w-*` o `px-4` de página fuera de `PageContainer`. Es lo que produjo el desalineado entre la barra de navegación y el contenido.
- Anidar dos `AppShell`, o poner dos `PageHeader` en la misma pantalla.
- Poner más de una acción dentro de `BottomActionBar`.
- Usar `ContentGrid` para bloques heterogéneos.
- Cambiar el patrón de navegación entre dispositivos.
- Usar `FullScreenPanel` para pedir un solo dato, o `Modal` para un flujo de varios pasos.

---

## Al añadir un componente nuevo

1. Comprobar que su trabajo es colocar, no pintar.
2. Leer anchos, rellenos y separaciones de `width` y `space` en `theme.js`, nunca de clases sueltas.
3. Respetar las zonas seguras del dispositivo en todo elemento fijo, arriba y abajo.
4. Verificar en los tres puntos de quiebre antes de darlo por terminado.
5. Añadirlo a `index.js` y a la tabla de inventario de este documento.
