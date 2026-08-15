/**
 * ESTAJOS — Tokens del sistema de diseño (tema Pizarra).
 *
 * Fuente de verdad de color, elevación, radios, tipografía y anchos.
 * Todo componente de `ui/` y `layout/` lee de aquí; ningún componente
 * escribe un hex a mano ni una clase de color de Tailwind.
 *
 * Referencias: Doc1 (color, elevación, tipografía), Doc2 (contenedores,
 * espaciado, radios), Doc3 (botones, campos, tarjetas, iconografía).
 */

/* ------------------------------------------------------------------ */
/* 1. Color — Doc1 §1.1                                                */
/* ------------------------------------------------------------------ */

export const theme = {
  navyDark: '#101820',   // texto principal, encabezados, botones oscuros
  navyMedium: '#2B3A4A', // iconos y texto de énfasis medio
  primary: '#24597F',    // acción principal, estado activo, foco
  gold: '#6B7684',       // acento decorativo, uso puntual
  appBg: '#EEF1F4',      // fondo general de la app
  chatBg: '#EEF1F4',     // fondo del flujo de registro (igual a appBg en Pizarra)
  danger: '#A23B3B',     // estados negativos, pendientes, alertas
  line: '#D7DEE5',       // bordes y separadores
  muted: '#66707C',      // texto secundario, etiquetas, iconos neutros
};

/** Gris neutro de apoyo: iconos desactivados y encabezados de tabla. */
export const neutral = '#9DA19C';

/** Convierte un hex del tema en rgba() con la opacidad indicada. */
export function alpha(hex, opacity) {
  const n = parseInt(String(hex).replace('#', ''), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${opacity})`;
}

/* ------------------------------------------------------------------ */
/* 2. Insignias — Doc1 §1.4 / catálogo de roles y ciclos de pago       */
/* ------------------------------------------------------------------ */

export const BADGES = {
  E: { label: 'Encargado',   color: '#2F5C46', tipo: 'rol' },
  C: { label: 'Chofer',      color: '#3D6B8C', tipo: 'rol' },
  A: { label: 'Ayudante',    color: '#A6752B', tipo: 'rol' },
  P: { label: 'Pasajero',    color: '#7C6A8C', tipo: 'rol' },
  X: { label: 'Sin asignar', color: '#9DA19C', tipo: 'rol' },
  Q: { label: 'Quincenal',   color: '#C4883A', tipo: 'pago' },
  M: { label: 'Mensual',     color: '#5B4E7A', tipo: 'pago' },
};

/* ------------------------------------------------------------------ */
/* 3. Escala tipográfica responsiva — Doc1 §2.2                        */
/* ------------------------------------------------------------------ */
/* Cada entrada es la cadena completa de clases de Tailwind, incluidos
 * los prefijos sm: y lg:. Se usa como `className={type.titulo}` para
 * que ningún componente vuelva a escribir un tamaño en píxeles suelto. */

export const type = {
  /** 10 / 10 / 11 — mayúsculas, tracking .1em (clase `eyebrow` global). */
  eyebrow: 'eyebrow lg:text-[11px]',
  /** 11 / 11 / 12 — metadatos, marcas de tiempo, texto de apoyo. */
  micro: 'text-[11px] lg:text-[12px]',
  /** 12 / 12 / 13 — insignias con texto, notas al pie de una tarjeta. */
  bodySm: 'text-[12px] lg:text-[13px]',
  /** 13 / 14 / 14 — listas, pestañas, botones pill. */
  body: 'text-[13px] sm:text-[14px]',
  /** 14 / 14 / 15 — texto de botón principal y de campo de formulario. */
  control: 'text-[14px] lg:text-[15px]',
  /** 15 / 16 / 17 — nombre de persona o furgoneta, título de modal. */
  subtitle: 'text-[15px] sm:text-[16px] lg:text-[17px]',
  /** 17 / 19 / 21 — título de pantalla o de tarjeta. */
  title: 'text-[17px] sm:text-[19px] lg:text-[21px]',
  /** 22 / 25 / 28 — cifra destacada (usar junto a la clase `cifra`). */
  figure: 'text-[22px] sm:text-[25px] lg:text-[28px]',
  /** 26 / 30 / 34 — saludo o encabezado principal de la pantalla de inicio. */
  display: 'text-[26px] sm:text-[30px] lg:text-[34px]',
  /** 15 fijo — logotipo ESTAJOS; es marca, no jerarquía: no crece. */
  wordmark: 'text-[15px]',
};

/* ------------------------------------------------------------------ */
/* 4. Anchos de contenedor — Doc2 §3.1                                 */
/* ------------------------------------------------------------------ */
/* Corrección aplicada: la barra de navegación ya NO llega a max-w-5xl.
 * Comparte `content` con el contenido principal para quedar alineada
 * verticalmente en computadora (checklist Doc3 §13). */

export const width = {
  /** Listados y pantallas de exploración: 448 / 672 / 896. */
  content: 'max-w-md sm:max-w-2xl lg:max-w-4xl',
  /** Flujos de formulario: 448 / 576 / 576 — no crece más, por legibilidad. */
  form: 'max-w-md sm:max-w-xl',
  /** Acciones flotantes y hojas inferiores: 448 / 384 / 384. */
  action: 'max-w-md sm:max-w-sm',
  /** Diálogos y modales estándar. */
  dialog: 'max-w-md',
};

/* ------------------------------------------------------------------ */
/* 5. Espaciado y relleno responsivos — Doc2 §3.2 y §4                 */
/* ------------------------------------------------------------------ */

export const space = {
  /** Relleno horizontal de página: 16 / 24 / 32. */
  pageX: 'px-4 sm:px-6 lg:px-8',
  /** Relleno superior del contenido principal: 28 / 36 / 48. */
  pageTop: 'pt-7 sm:pt-9 lg:pt-12',
  /** Separación entre tarjetas de la cuadrícula: 12 / 16 / 20. */
  gridGap: 'gap-3 sm:gap-4 lg:gap-5',
  /** Separación entre bloques de una lista vertical: 16 / 16 / 20. */
  stack: 'space-y-4 lg:space-y-5',
  /** Separación icono–texto: constante en los tres dispositivos. */
  inline: 'gap-2',
};

/* ------------------------------------------------------------------ */
/* 6. Elevación — Doc1 §1.2                                            */
/* ------------------------------------------------------------------ */
/* Se declaran como clases en tailwind.config.js (ver README de ui/).
 * Se exponen aquí para usos puntuales con estilo en línea. */

export const shadow = {
  raised: '0 0 0 1px rgba(16,24,32,.08), 0 2px 6px rgba(16,24,32,.05)',
  sheet: '0 0 0 1px rgba(16,24,32,.1), 0 -4px 16px rgba(16,24,32,.08)',
};

/* ------------------------------------------------------------------ */
/* 7. Movimiento                                                       */
/* ------------------------------------------------------------------ */

export const motion = {
  sheetIn: 'slideUp 240ms cubic-bezier(0.16,1,0.3,1)',
  sheetInFast: 'slideUp 220ms cubic-bezier(0.16,1,0.3,1)',
};

export default theme;
