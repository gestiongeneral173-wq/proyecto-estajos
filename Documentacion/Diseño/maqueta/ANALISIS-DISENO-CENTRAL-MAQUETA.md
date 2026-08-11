# Análisis del Sistema — Panel Central (diseño final de la maqueta)

Documento descriptivo del estado actual y definitivo de `Central-Maqueta`: qué páginas tiene, qué
secciones contiene cada una, y qué permite o no permite hacer cada sección. Mismo formato que el
análisis original del sistema — sirve como documentación de diseño de referencia, no describe código
ni la forma en que las pantallas se conectarían a una base de datos real.

La maqueta tiene **6 páginas** navegables por pestañas (Escanear, Reporte Diario, Resumen, Registros,
Vehículos, Configuración) y dos páginas de detalle a las que se llega tocando un elemento de una
lista (Detalle de Trabajador, Detalle de Vehículo). No tiene pantalla de login — es una simplificación
propia de la maqueta al no tener backend real, no representa un cambio de diseño.

---

## Página: Escanear

Punto de entrada para localizar a un trabajador y actuar sobre él.

**Sección Buscar trabajador**
Te permite: buscar por nombre o teléfono en una lista que se filtra al escribir; ver primero a los
que tienen algo pendiente y, atenuados en verde, a los que ya están pagados en el ciclo (por si hay
que darles un adelanto igual).
No te permite: escanear un código QR — esa vía se eliminó por completo, la búsqueda es la única forma
de llegar a un trabajador.

**Sección Información del trabajador** (siempre visible en cuanto se selecciona a alguien)
Te permite: ver nombre, teléfono, tipo de ciclo (badge) y, si corresponde, el aviso "PAGADO EN ESTE
CICLO".
No te permite: editar ningún dato desde aquí.

**Sección "¿Qué deseas hacer?" (menú)**
Te permite: elegir entre Dar Adelanto, Pagar Empleado, Agregar Horas, o cancelar y volver al buscador.
No te permite: pagar o dar un adelanto sin pasar primero por este menú.

**Sub-sección Dar Adelanto**
Te permite: ver el historial de adelantos del ciclo activo (fecha y monto, con total); registrar uno
nuevo indicando solo el monto — la fecha es siempre la de hoy.
No te permite: elegir otra fecha, ni editar/eliminar un adelanto ya dado desde aquí (eso vive en el
Detalle del trabajador).

**Sub-sección Pagar Empleado**
Te permite: ver la liquidación del ciclo — tabla de días trabajados, total de días, adelantos del
ciclo y total neto a pagar; confirmar el pago.
No te permite: pagar si ya está pagado o si no hay ningún día pendiente.

**Sub-sección Agregar Horas**
Te permite: registrar la jornada de HOY de este trabajador directamente desde Central, sin encargado
ni furgoneta de por medio (horas y destajo).
No te permite: elegir otra fecha distinta de hoy.

---

## Página: Reporte Diario

Vista de auditoría del día: quién trabajó, con qué furgoneta y bajo qué encargado.

**Sección Selector de fecha**
Te permite: elegir cualquier fecha (pasada o presente) para ver las jornadas registradas ese día.

**Sección Jornadas registradas** (agrupadas por encargado + vehículo; lo dado de alta desde Central
aparece agrupado aparte, bajo "Registrado por Central")
Te permite: ver por grupo la lista de empleados con horas y destajo; editar horas y destajo de
cualquier jornada que no esté liquidada; identificar de un vistazo:
  - la etiqueta **"Chófer"** en el empleado que manejó la furgoneta de ese grupo ese día;
  - la etiqueta **"Pagado"** en las jornadas ya liquidadas (en gris, sin opción de editar).
No te permite: editar una jornada ya liquidada, ni eliminar una fila individual desde la vista
normal (para eso está la selección, ver abajo).

**Sección Selección y borrado** (un solo botón de basura en el header de CADA grupo, sin excepción)
Te permite: tocar el botón para habilitar el modo de selección de ese grupo — aparecen checkboxes en
cada fila que no esté liquidada; marcar exactamente a quién sacar; recién con al menos una fila
marcada aparece "ELIMINAR SELECCIONADOS", que pide confirmación antes de borrar.
No te permite: borrar todo el grupo de un solo golpe — el botón nunca actúa directo, solo habilita la
selección; tampoco permite seleccionar una fila ya liquidada (no tiene checkbox).

---

## Página: Resumen

Centro de control de pagos: totales globales, generación de listas de pago y liquidación de choferes.

**Sección Resumen General** (empleados)
Te permite: ver el ciclo activo (quincenal y mensual) y el total pendiente en cada uno.
No te permite: ninguna acción, es solo informativo.

**Sección Resumen Furgonetas**
Te permite: ver el ciclo activo de furgonetas (siempre quincenal — se aclara que es el único ciclo
que tienen) y el total pendiente.
No te permite: ver una columna "Mensual" — no existe, las furgonetas nunca cobran mensual.

**Sección Choferes**
Te permite: ver la lista de empleados que hicieron de chofer, cuántas veces y el monto acumulado; y
"pagarles" — un pago informativo (el dinero real lo entrega el cliente por fuera del sistema) que al
confirmarse borra el registro.
No te permite: ver un historial de estos pagos después de confirmados, ni deshacerlo.

**Bloque Empleados** (separado visualmente con un divisor "EMPLEADOS")

- *Ciclo de pago*: te permite cambiar entre quincenal/mensual, ver el período activo, y exportar los
  datos del ciclo elegido a **Excel** (nombre + total a pagar) o a una **planilla imprimible**.
  No te permite: exportar si el ciclo no tiene datos pendientes (botones deshabilitados).
- *Lista de pago quincenal* (solo visible en el ciclo quincenal — el mensual se cobra por nómina
  presencial, fuera de este flujo): te permite iniciar "Generar lista" → buscar y seleccionar
  empleados con saldo pendiente → capturar el nombre del encargado que reparte el efectivo → generar
  la lista y ejecutar el pago de inmediato para todos los seleccionados.
  No te permite: seleccionar a alguien sin saldo pendiente, ni generar sin nombre de encargado.
- *Listas generadas · Quincenal*: te permite ver cada lista (fecha, encargado, total), abrir el
  detalle por empleado, reimprimir cuantas veces haga falta, y cancelarla (revierte el pago, vuelve a
  quedar pendiente).
  No te permite: cancelar sin confirmar, ni editar los montos de una lista ya generada.

**Bloque Furgonetas** (separado visualmente con un divisor "FURGONETAS")

- *Ciclo de pago*: te permite ver el período activo (siempre quincenal, sin selector) y exportar a
  **Excel** o **planilla imprimible**, igual que el de empleados.
  No te permite: elegir entre quincenal/mensual — no hay selector, ni exportar sin datos pendientes.
No te permite (a diferencia de Empleados): generar una "lista de pago" masiva ni ver un historial de
listas para furgonetas — cada furgoneta se sigue pagando **individualmente**, desde el botón "Pagar"
de su propio Detalle.

---

## Página: Registros (antes "Trabajadores")

Listado general de empleados con accesos a configuración relacionada.

**Sección de cabecera (acciones)**
Te permite: añadir un trabajador nuevo (modal); ver los temporales del día; configurar la tarifa de
chofer; generar PIN de encargados.
No te permite: generar un código de autoregistro para que un empleado se dé de alta solo — esa
función se eliminó por completo, ya no existe "AUTORIZAR NUEVOS REGISTROS".

**Modal "Nuevo Trabajador"**
Te permite: cargar Nombre, Apellido, Número (teléfono), Ciclo (mensual/quincenal), **Cuenta bancaria**
y Pago por hora.
No te permite: guardar sin nombre, apellido, ciclo (mensual/quincenal) y pago por hora.

**Modal "Ver temporales"**
Te permite: ver y editar la **tarifa de temporales** (€/h, bloque editable arriba de todo, mismo
patrón que la tarifa de chofer); ver el listado del día (nombre, horas, destajo) y eliminar uno o
todos.
No te permite: ver un total "Pagado" calculado en el listado — el registro diario del temporal sigue
siendo informativo (el encargado anota horas y destajo, el sistema no calcula nada); la tarifa queda
como dato de referencia para el admin, no alimenta ningún cálculo automático. Se eliminan solos todos
los días a la 1 AM.

**Modal "Configurar chofer"**
Te permite: editar solo la tarifa por hora del chofer (se copia a cada chofer del día al asignarlo,
sin afectar a los ya registrados).
No te permite: ver ni pagar a los choferes desde aquí (eso vive en Resumen).

**Modal "Generar PIN de encargados"** *(nuevo)*
Te permite: buscar y seleccionar uno o varios encargados con un checklist; generar de una sola vez un
PIN de 4 dígitos por cada uno seleccionado; copiar cada PIN recién generado para pasarlo por
WhatsApp; ver siempre abajo la lista de "PINs activos" con copiar/eliminar individual; volver a
generar (reemplaza) el PIN de alguien que ya tenía uno.
No te permite: generar sin seleccionar a nadie.

**Sección Filtros y búsqueda**
Te permite: filtrar por Todos, Mensual, Quincenal o **Encargados** (muestra a todo el personal marcado
como encargado); buscar por texto libre.

**Sección Listado de trabajadores**
Te permite: ver cada trabajador con su tipo de ciclo y su saldo pendiente; entrar a su ficha
completa tocándolo; si es un encargado con PIN ya generado, ver el **PIN directo en la tarjeta**
(en dorado, debajo del teléfono) sin tener que abrir ningún modal.
No te permite: editar sus datos o darlo de baja desde este listado.

---

## Página: Detalle de Trabajador

Ficha completa de un trabajador, a la que se llega desde Registros o desde Escanear.

**Cabecera**
Te permite: ver nombre, teléfono, **cuenta bancaria**, tipo de ciclo, saldo neto y tarifa por hora;
editar nombre, apellido, teléfono, cuenta, tipo de ciclo y tarifa.
No te permite: editar el destajo como tarifa fija — se registra jornada por jornada.

**Sección Rol de Encargado**
Te permite: activar/desactivar que el trabajador actúe como encargado (aplica en su próximo login).

**Sección Dar adelanto**
Te permite: registrar un adelanto rápido con solo el monto (fecha de hoy automática).

**Sección Adelantos** (desplegable)
Te permite: ver el historial del ciclo activo; editar el monto de uno existente (la fecha nunca se
toca) o eliminarlo, ambas acciones con confirmación.

**Sección Nómina Actual** (desplegable)
Te permite: ver las jornadas pendientes del ciclo activo (fecha, horas, destajo, tarifa, subtotal);
editar horas y destajo de cualquiera.
No te permite: editar la fecha de una jornada.

**Sección Nóminas Anteriores** (desplegable)
Te permite: consultar el historial de pagos ya liquidados.
No te permite: ninguna edición — es de solo lectura.

**Sección Dar de baja**
Te permite: calcular lo que se le debe, revisar el monto y, tras confirmar, liquidarlo y eliminarlo de
forma permanente en un solo paso.
No te permite: dar de baja sin ver antes el cálculo, ni deshacerlo después.

---

## Página: Vehículos

Listado general de furgonetas.

**Sección de cabecera**
Te permite: añadir un vehículo nuevo (nombre, matrícula opcional, plazas, tarifa por plaza, propietario).
No te permite: elegir un tipo de pago al crearlo — toda furgoneta nueva queda quincenal de forma fija,
sin selector.
No te permite: guardar sin nombre y tarifa por plaza.


**Tarjeta de cada vehículo**
Te permite: ver nombre, matrícula, plazas, tarifa por plaza, total de adelantos pendientes; entrar al
detalle completo.
No te permite: nada relacionado a un PIN — **se eliminó por completo**, las furgonetas ya no se
controlan con código, solo se registran. No hay ícono de PIN, cuenta regresiva, ni botón de rotarlo en
ningún lado de esta página.

---

## Página: Detalle de Vehículo

Ficha completa de una furgoneta, a la que se llega desde Vehículos.

**Cabecera**
Te permite: ver la tarifa por plaza y el tipo de ciclo (siempre "Quincenal", como dato fijo); editar
nombre, matrícula, plazas, tarifa y propietario.
No te permite: ver ni editar un PIN — no existe; tampoco editar el tipo de ciclo, ya no es un campo
del formulario.

**Sección Adelantos** (desplegable)
Te permite: añadir un adelanto/gasto (concepto opcional + monto); editar el monto de uno existente o
eliminarlo, con confirmación.
No te permite: añadir un adelanto sin monto.

**Sección Nómina Actual** (desplegable)
Te permite: ver los días del ciclo activo pendientes (fecha, plazas, total); editar el número de
plazas de un día puntual.
No te permite: editar la fecha de un día.

**Sección Nóminas Anteriores** (desplegable)
Te permite: consultar los pagos ya liquidados (período, ganado, adelantos, pagado).
No te permite: ninguna edición — es de solo lectura.

**Sección Dar de baja**
Te permite: calcular lo que se le debe, y tras confirmar, liquidarla y eliminarla de forma permanente.

**Acción Pagar**
Te permite: liquidar el ciclo activo de la furgoneta de un solo golpe, con confirmación mostrando
devengado, adelantos y neto a pagar.
No te permite: pagar si no hay absolutamente nada pendiente.

---

## Página: Configuración

**Sección Cambiar contraseña**
Te permite: cambiar la contraseña del administrador (dos veces, mínimo 6 caracteres), con confirmación
de éxito o el motivo del error.
No te permite: ninguna otra configuración por ahora.

---

## Resumen de decisiones de diseño acumuladas

1. **Escanear**: solo búsqueda, sin QR.
2. **Reporte Diario**: etiqueta "Chófer" visible; selección por checkbox (un solo botón por grupo, sin
   duplicados) reemplaza cualquier borrado atómico de grupo completo.
3. **Resumen**: bloques Empleados/Furgonetas separados y rotulados; ambos con exportar a Excel/
   planilla en su tarjeta de ciclo; solo Empleados tiene lista de pago masiva — Furgonetas se paga
   individual desde su Detalle.
4. **Registros**: sin PIN de autoregistro; temporales con tarifa de referencia pero sin cálculo de
   pago; alta con Nombre/Apellido/Número/Ciclo/Cuenta/Pago por hora; filtro Encargados restaurado;
   PIN de encargados nuevo (generación múltiple, copiar, listado activo, visible directo en la
   tarjeta).
5. **Detalle de Trabajador**: campo Cuenta agregado; terminología "tipo de ciclo".
6. **Vehículos / Detalle de Vehículo**: sin PIN en ningún lado; siempre quincenal, sin selector de tipo
   de pago.
