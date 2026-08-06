# Análisis de Tecnologías del Proyecto

## Resumen General

El proyecto se estructura como una aplicación web progresiva (PWA) multi-página, construida con Vite y React, con enrutamiento del lado del cliente para la navegación entre vistas, Supabase como capa de backend y base de datos, destinada a despliegue en Vercel.

La condición de PWA implica que la aplicación debe ser instalable en dispositivos móviles y de escritorio, funcionar con soporte offline o de red intermitente, y cumplir con los criterios de un manifiesto web y un service worker registrado. El carácter multi-página se resuelve mediante enrutamiento en el cliente, conservando un único punto de entrada HTML compatible con la estrategia offline de la PWA.

---

## Estado Actual de la Base

Este repositorio es la **base inicial del proyecto**, reconstruida desde cero tras la ronda de cambios solicitada por el cliente sobre el diseño anterior. No implementa funcionalidad de negocio todavía: su propósito es dejar el andamiaje técnico (build, enrutamiento, cliente de Supabase, estructura de carpetas) en un estado limpio y arrancable para que el equipo continúe el desarrollo sobre esta base.

Verificado al día de esta actualización:

- `npm run build` y `npm run dev` corren sin errores.
- `src/App.jsx` define una única ruta (`/`) que renderiza `src/pages/Inicio.jsx`, un componente placeholder. Las páginas reales del sistema (Escanear, Reporte Diario, Resumen, Registros, Vehículos, Configuración y sus vistas de detalle — ver `Documentacion/Diseño/ANALISIS-DISENO-CENTRAL-MAQUETA.md`) todavía no están creadas.
- `src/lib/supabaseClient.js` ya está en su ubicación definitiva y funciona con las variables de entorno del `.env`.
- `vite-plugin-pwa` está instalado como devDependency pero **no configurado** en `vite.config.js` (sin manifest, sin service worker registrado, sin set de iconos 192x192/512x512). Pendiente antes de considerar la app instalable.

---

## Stack Tecnológico

### Herramienta de construcción (Build Tool)

**Vite**

Empaquetador y servidor de desarrollo de nueva generación. Sustituye a herramientas tradicionales como Create React App por tiempos de arranque e iteración significativamente más rápidos, gracias al uso de módulos ES nativos durante el desarrollo y esbuild para la transpilación.

- Comando de desarrollo: `npm run dev`
- Puerto por defecto: `5173`
- Archivo de configuración: `vite.config.js`

### Enrutamiento (Multi-página)

**React Router**

Biblioteca de enrutamiento del lado del cliente que permite estructurar la aplicación en múltiples vistas o páginas, cada una accesible mediante una URL distinta, sin recargar el documento HTML base.

Se opta por este enfoque en lugar del modo nativo "multi-page" de Vite (múltiples archivos `.html` como puntos de entrada independientes), dado que este último introduce complejidad significativa en la estrategia de cacheo del service worker de la PWA, al requerir gestión offline de varios documentos HTML por separado. El enrutamiento del lado del cliente mantiene un único punto de entrada (`index.html`), compatible de forma directa con la estrategia de cacheo estándar de `vite-plugin-pwa`.

- Paquete: `react-router-dom`
- Estado actual: rutas definidas directamente en `src/App.jsx` (una sola ruta, `/`, hacia `src/pages/Inicio.jsx`); aún no se extrajeron a un archivo `src/router.jsx` dedicado. Los componentes de página se organizan en `src/pages/`, carpeta ya creada.

### Framework de interfaz

**React**

Biblioteca de JavaScript para construcción de interfaces basadas en componentes. Estructura de entrada:

- `src/main.jsx` — punto de montaje de la aplicación en el DOM
- `src/App.jsx` — componente raíz
- `src/App.css` / `src/index.css` — hojas de estilo asociadas

### Backend y base de datos

**Supabase**

Plataforma de backend como servicio (BaaS) que provee base de datos PostgreSQL, autenticación, almacenamiento de archivos y funciones edge, expuesta mediante una API auto-generada.

- Paquete cliente: `@supabase/supabase-js` (versión `^2.112.2`)
- Cliente inicializado en: `src/lib/supabaseClient.js`
- Variables de entorno requeridas (prefijo `VITE_` obligatorio para exposición en cliente con Vite):
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

### Calidad y análisis de código

**ESLint**

Linter seleccionado durante el scaffolding del proyecto, en lugar de la alternativa Oxlint. Verifica errores de sintaxis, malas prácticas y convenciones de estilo en el código JavaScript/JSX.

- Archivo de configuración: `eslint.config.js`

### Gestor de paquetes

**npm**

Gestor de paquetes estándar de Node.js utilizado para instalación de dependencias y ejecución de scripts definidos en `package.json`.

- Archivo de bloqueo de versiones: `package-lock.json`

### Plataforma de despliegue

**Vercel**

Plataforma de hosting orientada a aplicaciones frontend, con integración nativa para proyectos Vite (detección automática de configuración de build sin necesidad de archivo `vercel.json` adicional en la mayoría de los casos). Vercel sirve los assets estáticos (manifiesto, service worker, iconos) sin configuración adicional, siempre que estos se generen dentro del directorio de build.

### Capacidad de aplicación web progresiva (PWA)

**vite-plugin-pwa**

Plugin de integración entre Vite y Workbox que automatiza la generación del manifiesto web y el registro del service worker durante el proceso de build, evitando la configuración manual de estos elementos.

Componentes que introduce en el proyecto:

- **Manifiesto web** (`manifest.json` o configuración equivalente en `vite.config.js`) — define nombre de la aplicación, iconos, color de tema, orientación y comportamiento de pantalla al instalarse.
- **Service worker** — generado automáticamente, gestiona el cacheo de assets y la estrategia de funcionamiento offline o con red intermitente.
- **Conjunto de iconos** — requeridos en múltiples resoluciones (mínimo 192x192 y 512x512 píxeles) para cumplir criterios de instalabilidad en distintos sistemas operativos.

La instalación se realiza como dependencia de desarrollo, y su configuración se declara dentro de `vite.config.js` junto al resto de plugins del proyecto.

---

## Estructura del Proyecto

```
proyecto-estajos/
├── Documentacion/
├── node_modules/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   ├── lib/
│   │   └── supabaseClient.js
│   ├── pages/
│   │   └── Inicio.jsx        (placeholder — pendiente de páginas reales)
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env                  (variables de entorno, no versionado)
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── README.md
└── vite.config.js
```

Carpetas previstas pero aún no creadas: `src/components/` (con la separación `ui/` / `domain/` / `layout/` usada como referencia en `Documentacion/Diseño/Maqueta central/`), `src/services/` para las llamadas a Supabase por entidad, y una carpeta de autenticación/sesión para el login de administrador y el PIN de encargados descritos en el diseño.

---

## Dependencias Principales

| Paquete | Versión | Tipo | Propósito |
|---|---|---|---|
| `react` | ^19.2.8 | dependency | Framework de interfaz |
| `react-dom` | ^19.2.8 | dependency | Renderizado de React en el DOM |
| `react-router-dom` | ^7.18.2 | dependency | Enrutamiento del lado del cliente |
| `@supabase/supabase-js` | ^2.112.2 | dependency | Cliente de conexión a Supabase (base de datos, autenticación, storage) |
| `vite-plugin-pwa` | ^1.3.0 | devDependency | Generación de manifest y service worker (instalado, **sin configurar** en `vite.config.js`) |
| `eslint` | ^10.8.0 | devDependency | Linter |

*(La tabla se actualizará conforme se agreguen nuevas dependencias al proyecto.)*

---

## Consideraciones de Seguridad

- Las variables de entorno con las credenciales de Supabase se almacenan en `.env`, el cual debe permanecer excluido del control de versiones mediante `.gitignore`.
- La clave utilizada en el cliente (`VITE_SUPABASE_ANON_KEY`) corresponde a la clave anónima/pública de Supabase, diseñada para exposición en el frontend; el control de acceso a los datos debe reforzarse mediante políticas de seguridad a nivel de fila (Row Level Security) en la base de datos.
- El service worker de la PWA debe configurarse para no cachear respuestas de la API de Supabase que contengan datos sensibles o sujetos a cambio frecuente, evitando así el uso de información desactualizada en escenarios offline.