# Análisis detallado: Ejecución de Pagos en el Sistema

## 1. Qué se está pagando, en el fondo

Cada pago liquida dos tipos de deuda pendiente para una entidad (empleado/encargado o furgoneta) dentro de un rango de fechas concreto:

- **Trabajo devengado**: jornadas registradas y aún no liquidadas. Para personas, cada jornada aporta `horas × tarifa` + `destajo`. Para furgonetas, cada día aporta `plazas_ocupadas × tarifa_por_plaza`.
- **Adelantos**: montos ya entregados por adelantado y aún no descontados, que se restan del total devengado.

El resultado (`total devengado − total adelantos`) es el monto neto que efectivamente se entrega en el pago.

### La tarifa queda congelada al momento de trabajar, no al momento de pagar

Cada jornada guarda, en el momento en que se crea, la tarifa vigente en ese instante (una "foto" de la tarifa). Cuando llega el pago, se usa esa tarifa guardada por fila — nunca la tarifa *actual* de la persona o furgoneta. Esto es deliberado: si la tarifa sube a mitad de un ciclo, ese aumento no debe recalcular retroactivamente horas que ya se trabajaron con la tarifa vieja. Sin esta protección, un aumento de sueldo terminaría "regalando" dinero por trabajo pasado que nunca se pactó a ese precio.

## 2. Los distintos canales de pago que existen

El sistema no tiene un único "botón de pagar" — tiene varios flujos, cada uno pensado para una situación operativa distinta:

### a) Pago individual de un empleado (canal principal)

Un administrador busca o escanea a un empleado puntual, ve su liquidación pendiente del ciclo activo y confirma el pago uno por uno. Este es el único canal que sirve tanto para empleados quincenales como mensuales.

### b) Pago en lote / lista de pago (solo ciclo quincenal)

Pensado para cuando el efectivo se reparte a través de un tercero (un encargado que entrega el dinero en el campo, no el propio administrador). En vez de pagar persona por persona, se genera una lista con varios empleados seleccionados a la vez; cada uno se liquida individualmente por dentro (mismo mecanismo que el pago individual), pero el conjunto queda agrupado como un solo documento imprimible con el nombre de quien reparte el efectivo. Aplica exclusivamente al ciclo quincenal — el mensual no tiene esta modalidad de lote.

### c) Pago de furgonetas

Siempre individual, nunca en lote. Un administrador entra al detalle de una furgoneta puntual y liquida su ciclo activo (plazas ocupadas × tarifa, menos adelantos de la furgoneta).

### d) Pago del chofer del día (modelo aparte, fuera de ciclos)

El rol de "chofer" (alguien que además de su trabajo normal maneja la furgoneta ese día) tiene un pago completamente independiente del resto del sistema:

- No se acumula por ciclos ni se mezcla con la nómina normal de esa persona.
- Es puramente informativo: nunca aparece en los totales pendientes generales ni en ninguna lista de pago.
- Al pagarlo, los registros correspondientes se **borran** en vez de marcarse como liquidados — es una decisión explícita de no dejar historial de este concepto en particular.

### e) Baja con liquidación forzada

Cuando se da de baja a un empleado o una furgoneta, el sistema no espera a que llegue su ciclo de pago normal: liquida absolutamente todo lo pendiente que tenga acumulado, sin importar de qué fecha sea ni a qué bloque de ciclo pertenezca, y borra a la entidad del sistema en la misma operación. Es un mecanismo de cierre total, no un pago de ciclo más.

## 3. El patrón de "calcular, luego confirmar contra el servidor"

Para las operaciones más sensibles o irreversibles (bajas, pago del chofer), el sistema separa el pago en dos pasos:

1. **Fase de cálculo (de solo lectura, repetible)**: se le muestra al administrador cuánto se le debe a esa entidad, sin escribir nada todavía. Se puede volver a consultar cuantas veces haga falta sin efectos secundarios.
2. **Fase de ejecución (transaccional)**: cuando el administrador confirma, se le envía al servidor el monto que vio en pantalla. El servidor **recalcula el monto de nuevo en ese instante** y lo compara contra lo que se le mandó; si no coincide (por ejemplo, porque entre que se mostró la pantalla y se confirmó pasó algo — una jornada nueva, un adelanto de último segundo), la operación se aborta y devuelve la cifra actualizada en vez de cobrar un monto que ya quedó desactualizado.

Este patrón existe para cerrar la ventana de tiempo entre "lo que ve el administrador" y "lo que realmente se paga", evitando pagos de más o de menos por una carrera de datos.

El pago normal de ciclo (tanto individual como en lista) sigue una variante más simple de esta misma idea: el total mostrado en pantalla es solo una previsualización, pero lo que realmente queda registrado como pagado es el monto que el propio servidor calcula al momento de ejecutar — nunca el número calculado en el navegador.

## 4. Atomicidad: qué pasa exactamente al ejecutar un pago de ciclo

Pagar el ciclo activo de una persona o furgoneta dispara una única operación en el servidor que hace, todo junto o nada:

- Marca como liquidadas todas las jornadas pendientes dentro del rango de fechas indicado.
- Marca como liquidados los adelantos pendientes dentro de ese mismo rango.
- Genera un registro de pago con el monto neto resultante, asociado a ese rango de fechas.

Al ser una sola operación atómica del lado del servidor, no puede quedar a medio camino (jornadas marcadas como pagadas pero sin el registro de pago, o viceversa).

**Importante**: esta atomicidad es *por persona/furgoneta*, no por lote. Cuando se pagan varios empleados juntos en una lista, cada uno dispara su propia operación atómica por separado — si el pago del tercer empleado de la lista falla, los dos primeros ya quedaron liquidados de forma irreversible y solo el tercero (y los siguientes) quedan pendientes de revisión manual.

## 5. Qué rango de fechas se liquida realmente

El rango que se paga nunca es simplemente "el ciclo oficial completo" — se ajusta a lo que esa persona/furgoneta específica tiene realmente pendiente:

- El **fin** del rango siempre es el cierre del ciclo activo que determina el candado global (el mismo para toda la nómina de ese tipo de pago).
- El **inicio** del rango se calcula por entidad: si tiene trabajo o adelantos pendientes más antiguos que el inicio oficial de ese bloque (arrastre de un ciclo previo que quedó atascado por el candado global), el pago se ensancha hacia atrás hasta la fecha real más antigua con algo pendiente para esa persona. Si no hay arrastre, coincide con el inicio oficial del bloque.

Esto garantiza que un pago siempre liquide *todo* lo pendiente de esa entidad hasta el cierre del ciclo activo, sin dejar fechas sueltas fuera por casualidad de cómo cayeron los bloques.

## 6. Bloqueo de pago anticipado

No se puede pagar un ciclo si esa persona/furgoneta no tiene absolutamente nada pendiente dentro del rango ya acotado al ciclo activo (ver el análisis de control de ciclos): sin jornadas ni adelantos en ese rango, el botón de pago queda deshabilitado. Esto evita "adelantar" un pago vacío solo porque el ciclo ya llegó a su fecha de cierre en el calendario, cuando esa persona en particular todavía no tiene nada que cobrar ahí.

## 7. Qué pasa justo después de un pago exitoso

Inmediatamente después de que un pago individual se ejecuta con éxito (tanto en el canal individual como dentro de cada ítem de una lista), el sistema revisa si esa persona tenía un cambio de periodicidad de pago pendiente (de quincenal a mensual o viceversa) y, si lo tenía, lo aplica en ese momento — nunca antes. Este paso es "best effort": si falla, no se deshace el pago (que ya es irreversible), simplemente el cambio de periodicidad se queda esperando para el próximo pago exitoso.

## 8. Reversión de pagos

No todos los pagos se pueden deshacer de la misma manera:

- Una **lista de pago** de un ciclo que el administrador todavía no confirmó como cerrado se puede **cancelar** de verdad: se revierte la liquidación de jornadas y adelantos, se borra el registro de pago, y si esa lista había promovido un cambio de periodicidad, ese cambio también se revierte, dejando a la persona exactamente como estaba antes de pagar.
- Una lista que pertenece a un ciclo **ya confirmado/archivado** por el administrador ya no se puede cancelar de verdad — solo se puede **ocultar** de la vista, sin tocar nada de lo ya liquidado. Esto evita que deshacer algo de un ciclo cerrado haga que ese ciclo vuelva a aparecer como pendiente.
- Los pagos individuales de furgonetas y el pago normal de una persona fuera de una lista no tienen, hoy, un mecanismo de cancelación equivalente.
- La baja con liquidación forzada y el pago del chofer del día son, por diseño, irreversibles — la primera borra a la entidad, el segundo borra los registros de origen sin dejar rastro que revertir.

## 9. Historial de pagos

Cada pago de ciclo (individual o dentro de una lista) queda registrado con su rango de fechas y el monto total pagado. Como el sistema no guarda por separado "cuánto se devengó" en el momento del pago, ese dato se reconstruye después sumando el monto pagado más los adelantos que se descontaron en ese mismo pago — así el historial puede mostrar tanto el neto entregado como el bruto devengado sin duplicar información.

## 10. Resumen del flujo típico de un pago de ciclo

1. El administrador entra a un empleado, furgoneta, o a la lista de pago quincenal.
2. El sistema resuelve cuál es el ciclo activo a pagar para esa entidad (candado global) y calcula, con fechas ya acotadas a ese ciclo (arrastre incluido), cuánto hay pendiente.
3. Si no hay nada pendiente en ese rango, el pago queda bloqueado.
4. Al confirmar, el servidor recalcula el monto en el instante, liquida jornadas y adelantos, y genera el registro de pago — todo en una sola operación atómica por entidad.
5. Si había un cambio de periodicidad esperando, se aplica justo después.
6. Si el pago fue parte de una lista y el ciclo aún no está confirmado por el admin, queda disponible para cancelación completa; una vez confirmado el ciclo, solo queda la opción de ocultar la lista, nunca revertir el dinero ya movido.