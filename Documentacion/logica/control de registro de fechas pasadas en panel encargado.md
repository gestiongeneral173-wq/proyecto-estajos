# Análisis detallado: Registro y Corrección de Fechas Pasadas por el Encargado

## 1. Contexto: dos calendarios independientes

La pantalla del encargado maneja **dos fechas seleccionables por separado**, cada una con su propio selector de calendario y sin relación entre sí:

- **La fecha del buscador de equipo**: para buscar y registrar/corregir la jornada de cualquier empleado de su furgoneta.
- **La fecha de "Mis horas"**: exclusivamente para la jornada propia del encargado.

Cambiar la fecha en uno de los dos calendarios nunca recarga ni afecta al otro. Esto es deliberado: antes compartían una sola fecha, y cambiar de día para completar el propio turno del encargado también recargaba (y podía confundir) el buscador del equipo, y viceversa.

## 2. El límite universal: nunca fechas futuras

Ambos calendarios están topados en el día de hoy — no es posible seleccionar una fecha posterior a la actual en ninguno de los dos flujos. Esto aplica por igual al registro de empleados y al de las horas propias del encargado. El sistema solo trabaja con lo que ya ocurrió (hoy) o lo que ya pasó, nunca con proyecciones a futuro.

## 3. Qué se muestra al elegir una fecha para el equipo

Al elegir una fecha en el buscador, el sistema consulta, para **esa fecha exacta**, el estado de cada empleado: si ya tiene una jornada registrada ese día, si esa jornada está completa (ambos campos — horas y destajo — con valor), y si está incompleta, cuál de los dos campos falta.

Este estado es puramente por combinación de **persona + fecha**, sin relación alguna con si esa persona ya fue pagada, si su ciclo está cerrado, o cualquier otra cosa del lado de nómina — es una vista operativa de "qué se registró ese día", no una vista financiera.

## 4. Los tres estados posibles al elegir una persona en una fecha

Una vez elegida la fecha y la persona (empleado o el propio encargado), el sistema decide entre exactamente tres comportamientos, según lo que ya exista para esa combinación:

- **Sin jornada registrada** → se ofrece **crear** una jornada nueva desde cero, con la fecha elegida (pasada o de hoy) como fecha real de trabajo.
- **Jornada existente con un campo todavía en 0** (horas o destajo, no ambos) → se ofrece **corregir/completar**: el formulario se precarga con lo que ya hay, y solo permite llenar lo que falta.
- **Jornada existente con ambos campos ya cargados** → **solo lectura**: se muestra la información pero no hay ninguna acción disponible, ni siquiera para el mismo encargado que la registró.

La fecha en sí **nunca es editable dentro de estos sub-formularios** — se fija en el paso anterior (elegir la fecha en el calendario) y el formulario de horas/destajo no tiene forma de cambiarla. Corregir un día pasado nunca lo mueve a otra fecha.

## 5. La particularidad de "Mis horas": el encargado no puede crear jornadas propias en el pasado

Aquí hay una asimetría importante frente al flujo de los empleados normales: para su **propia** jornada, el encargado solo tiene cuatro estados posibles, y "crear" está restringido a hoy:

- **Sin jornada, y la fecha elegida es hoy** → puede crear (cerrar su turno por primera vez).
- **Sin jornada, y la fecha elegida es un día pasado** → estado de "nada que hacer": el sistema interpreta que simplemente no trabajó ese día, y no ofrece ninguna forma de crear una jornada propia retroactiva desde cero.
- **Jornada ya existente con un campo en 0** (sin importar si es de hoy o de un día pasado) → puede completar lo que falta.
- **Jornada ya existente y completa** → solo lectura.

La razón de esta diferencia: la jornada propia del encargado se origina siempre como un cierre de turno en tiempo real (un "estoy aquí, hoy, cerrando mi día"), nunca como una declaración retroactiva de que trabajó un día que no dejó ningún registro. En cambio, sí se le permite **completar** un día pasado que ya había quedado a medias (por ejemplo, si cerró su turno con las horas pero olvidó cargar el destajo ese día) — eso no es inventar un turno nuevo, es terminar de cargar uno que ya existía.

Los empleados normales, en cambio, sí pueden recibir una jornada nueva creada directamente en una fecha pasada — el encargado puede declarar en cualquier momento que un empleado trabajó tal día, con la fecha real de ese día, sin que haga falta que exista ningún registro previo.

## 6. Qué cambia y qué NO cambia al corregir un día pasado

Reglas estrictas que gobiernan cualquier corrección, sea de un empleado o del propio encargado:

- **Solo se completa lo que falta.** Si un campo (horas o destajo) ya tiene un valor cargado, la corrección nunca lo sobrescribe — únicamente rellena el campo que sigue en 0. No existe, desde este flujo, una forma de editar un valor que ya fue cargado una vez.
- **La fecha de la jornada nunca se toca.** Corregir o completar una jornada nunca cambia el día al que pertenece ese trabajo.
- **Una jornada ya liquidada (ya pagada) no se puede corregir.** El sistema lo valida del lado del servidor antes de aceptar cualquier cambio — si ese día ya entró en un pago, queda congelado para el encargado.
- **Solo se puede corregir lo propio.** El servidor valida que la jornada pertenezca al encargado que está haciendo la corrección (o, en el caso de un empleado, que haya sido registrada bajo su gestión) — nadie puede completar o alterar el registro de un turno que no le corresponde.

## 7. Relación con el cierre de sesión del encargado

Solo existe **un** punto en todo el sistema donde registrar la jornada propia del encargado cierra su sesión y termina su día: el primer cierre de turno de **hoy**. Cualquier otra acción sobre "Mis horas" — completar un campo faltante de un día pasado ya cerrado — es una corrección pura, sin ningún efecto sobre la sesión activa ni sobre el estado de las furgonetas.

Esto es intencional: si completar un día pasado cerrara la sesión, el encargado quedaría desconectado a mitad de su turno actual solo por estar poniendo al día un registro atrasado.

## 8. Efecto colateral compartido: el cupo de la furgoneta

Registrar la jornada de un empleado — sin importar si la fecha elegida es hoy o un día pasado — puede completar el cupo de plazas de la furgoneta activa y cerrarla automáticamente. Esta regla de cupo no distingue por fecha: el sistema cuenta cuántas personas están registradas y, al llegar al límite, cierra el turno sin importar qué día se estaba registrando en ese momento.

## 9. Lo que NO sigue estas reglas: los empleados temporales

El alta de un empleado temporal es un flujo completamente aparte que **no tiene selector de fecha en absoluto** — siempre se registra con la fecha de hoy, se paga en efectivo de inmediato y no genera ningún registro de jornada dentro del sistema de nómina. Por lo tanto, ninguna de las reglas de "fecha pasada" descritas arriba (crear/corregir/ver, corrección parcial, bloqueo por liquidación) aplica a los temporales — son un mecanismo de un solo paso, sin historial ni posibilidad de edición posterior.

## 10. Qué información nunca se expone en este flujo

Independientemente de la fecha que se esté viendo, la pantalla del encargado nunca muestra montos acumulados, saldos ni nada relacionado con el estado de pago de un empleado — ni al ver un día pasado en modo solo lectura, ni al completar un campo faltante. Lo único que se ve son las horas y el destajo del día puntual que se está consultando, nunca un total acumulado ni si esa persona ya fue pagada en su ciclo.

## 11. Resumen del flujo completo

1. El encargado elige una fecha (hoy o un día pasado, nunca futuro) en el calendario correspondiente — el del equipo o el propio.
2. Para un empleado del equipo: si no hay jornada ese día, puede crear una nueva con esa fecha; si hay una jornada incompleta, solo puede completar el campo que falta; si ya está completa, solo puede verla.
3. Para sí mismo: solo puede "crear" si la fecha es hoy; en un día pasado sin jornada, no hay nada que hacer; si hay una jornada incompleta (de hoy o de un día pasado), puede completarla; si ya está completa, solo puede verla.
4. Ninguna corrección sobrescribe un valor ya cargado, cambia la fecha del registro, ni se permite sobre una jornada ya liquidada.
5. Completar un día pasado nunca cierra la sesión del encargado — eso ocurre únicamente al cerrar el turno de hoy por primera vez.
6. Registrar a alguien (en cualquier fecha) puede disparar el cierre automático de la furgoneta si se completa su cupo.
7. Los temporales quedan totalmente fuera de este sistema de fechas: siempre son de hoy, sin edición posterior.