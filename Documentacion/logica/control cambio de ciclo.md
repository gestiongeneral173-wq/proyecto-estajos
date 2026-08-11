# Análisis detallado: Cambio de Ciclo de Pago (Quincenal ↔ Mensual) para Empleados

## 1. Qué es este mecanismo

Cada empleado tiene asignado un tipo de ciclo de pago (quincenal o mensual), que determina en qué calendario de bloques se agrupa su trabajo pendiente y bajo qué candado global de nómina queda sujeto su próximo pago.

Cuando el administrador decide cambiar ese tipo de ciclo para un empleado puntual (por ejemplo, pasar a alguien de quincenal a mensual), ese cambio **no se aplica de inmediato al guardarlo**. El sistema lo trata como una intención pendiente que solo se hace efectiva más adelante, en un momento muy concreto: justo después de que a ese empleado se le pague con éxito su próximo ciclo.

## 2. Por qué el cambio no es inmediato

Si el tipo de ciclo cambiara en el mismo instante en que el administrador guarda la edición, se generaría un problema de consistencia: el empleado podría tener trabajo acumulado a mitad de un ciclo quincenal (por ejemplo, 7 días ya trabajados de 14) y, de un momento a otro, ese trabajo pasaría a evaluarse bajo bloques mensuales de 30 días — mezclando dos calendarios distintos sobre el mismo trabajo ya hecho, y complicando cualquier pago que ya estuviera en curso de cálculo para ese empleado bajo el tipo viejo.

Diferir el cambio hasta el momento del próximo pago exitoso resuelve esto de forma limpia: el empleado termina de cobrar todo lo que tiene pendiente bajo las reglas del ciclo con el que ya venía trabajando, y solo a partir de ahí — con su cuenta en cero — empieza a acumular trabajo bajo el nuevo tipo de ciclo. No hay ningún momento en que un mismo bloque de trabajo pendiente se evalúe con dos calendarios distintos.

## 3. Los dos campos involucrados

Cada empleado tiene, en realidad, dos valores relacionados con su tipo de ciclo:

- **El tipo de ciclo vigente**: el que efectivamente se usa hoy para calcular en qué bloque cae su trabajo y bajo qué candado de nómina se le paga. Este es el único que el resto del sistema (cálculo de ciclos, candado global, listas de pago) consulta.
- **El tipo de ciclo pendiente**: un valor "en espera", que solo existe mientras hay un cambio solicitado por el administrador todavía sin aplicar. Vale `null` cuando no hay ningún cambio pendiente.

El formulario de edición del empleado **nunca escribe directamente el tipo de ciclo vigente** — solo puede escribir el campo pendiente. El vigente solo lo modifica el propio sistema, y únicamente en el momento de promoción descrito en la sección 2.

## 4. Cómo se decide qué guardar en "pendiente" al editar

Cada vez que el administrador guarda una edición del empleado, el sistema compara tres valores: el tipo vigente actual, lo que ya estaba pendiente (si algo lo estaba) y lo que el administrador acaba de elegir en el formulario. La regla es simple:

- Si lo elegido en el formulario **coincide con el tipo vigente actual**, se interpreta como que el administrador "se arrepintió" o revirtió un cambio pendiente anterior — el campo pendiente se limpia (vuelve a `null`), sin importar qué hubiera antes ahí.
- Si lo elegido **es distinto del vigente**, se guarda tal cual como el nuevo valor pendiente — reemplazando cualquier valor pendiente anterior si ya existía uno.

Esto permite que el administrador cambie de opinión cuantas veces quiera antes de que el cambio se promueva de verdad: mientras no haya un pago exitoso de por medio, el campo pendiente se puede sobrescribir o limpiar libremente sin ningún efecto en el comportamiento real del empleado.

## 5. El momento exacto de la promoción

El cambio real ocurre en un único punto del sistema: inmediatamente después de que un pago a ese empleado se ejecuta con éxito — ya sea un pago individual o un pago dentro de una lista/lote. En ese momento:

1. Se lee el valor pendiente guardado.
2. Si no hay nada pendiente (`null`), no pasa nada — el empleado sigue con su tipo de ciclo de siempre.
3. Si hay algo pendiente, el tipo de ciclo vigente pasa a tomar ese valor, y el campo pendiente se limpia.

Esta promoción solo se dispara **después** de un pago exitoso, nunca antes ni de forma independiente — no existe un mecanismo separado que aplique el cambio por su cuenta (por ejemplo, al llegar cierta fecha). Si el empleado nunca vuelve a tener un pago (porque queda sin trabajo pendiente indefinidamente), el cambio pendiente simplemente se queda esperando para siempre, sin afectar nada mientras tanto.

## 6. Manejo de fallas: "mejor esfuerzo" a propósito

El intento de promoción se trata como una operación de mejor esfuerzo, no crítica. Si falla por cualquier motivo — el empleado fue dado de baja justo en ese instante, un problema de red, lo que sea — ese fallo **no revierte ni invalida el pago**, que para ese momento ya ocurrió y es irreversible (dinero movido, jornadas liquidadas). Tampoco corta el resto de una lista de pago en curso: si se están pagando varios empleados juntos, el fallo de promoción de uno no detiene a los siguientes.

En ese caso, el cambio pendiente simplemente permanece guardado tal cual estaba, y se vuelve a intentar aplicar en el próximo pago exitoso de ese mismo empleado.

## 7. Reversión: qué pasa si se cancela el pago que disparó el cambio

Cuando un pago se revierte por completo (cancelación de una lista de pago que todavía no fue confirmada como cerrada por el administrador), el sistema no solo debe devolver el dinero — también debe deshacer cualquier promoción de ciclo que ese pago hubiera disparado. De lo contrario, cancelar el pago dejaría al empleado "atrapado" para siempre en el nuevo tipo de ciclo, aunque el pago que lo causó ya no exista.

Para que esto sea posible, en el momento mismo de la promoción se guarda cuál era el tipo de ciclo **anterior** a ese cambio (o ningún valor, si no hubo promoción en ese pago). Ese dato viaja junto con el resto de la información de la lista de pago. Si más adelante esa lista se cancela, el sistema usa ese valor guardado para restaurar exactamente el tipo de ciclo que el empleado tenía antes del pago — dejándolo en el mismo estado que si el pago (y la promoción) nunca hubieran ocurrido.

Esta reversión solo es posible mientras el ciclo no haya sido confirmado/archivado por el administrador. Una vez confirmado, cancelar deja de estar disponible (solo se puede ocultar la lista sin revertir nada), así que tampoco se puede deshacer una promoción de ciclo asociada a un ciclo ya cerrado.

## 8. Consecuencia importante tras el cambio: el nuevo candado global

Un detalle relevante para controlar este mecanismo con criterio: cuando el tipo de ciclo de un empleado se promueve, esa persona pasa a formar parte de una población distinta a efectos del candado global de pago (ver el control de ciclos) — la de todos los empleados que comparten el nuevo tipo de ciclo.

Esto significa que, a partir de ahí, cuándo se le vuelve a poder pagar a ese empleado ya no depende solo de su propio trabajo acumulado, sino también del estado de esa otra población: si el resto de la nómina del tipo de ciclo nuevo todavía tiene ciclos viejos sin liquidar por completo, el candado global mantendrá bloqueado el avance también para este empleado recién movido, aunque su propio trabajo esté al día.

## 9. Resumen del flujo completo

1. El administrador edita al empleado y elige un tipo de ciclo distinto al vigente → se guarda como "pendiente" (sin efecto todavía).
2. El empleado sigue operando con su tipo de ciclo de siempre: sus jornadas se agrupan en los bloques del ciclo viejo, y su pago sigue sujeto al candado global de esa población.
3. El administrador (u otra persona) puede seguir cambiando o limpiando el valor pendiente libremente hasta que ocurra un pago.
4. Cuando ese empleado recibe su próximo pago exitoso (individual o dentro de una lista), justo después se promueve el cambio: el tipo vigente pasa a ser el pendiente, y se guarda el tipo anterior por si hace falta revertir.
5. A partir de ese momento, el empleado acumula trabajo nuevo bajo el tipo de ciclo nuevo, sujeto al candado global de esa otra población.
6. Si esa lista de pago se cancela antes de que el ciclo quede confirmado por el administrador, el cambio de ciclo se revierte junto con el dinero, dejando al empleado exactamente como estaba antes del pago.