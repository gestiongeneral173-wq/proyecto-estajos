# Análisis detallado: Control de Ciclos de Pago

## 1. Concepto general

Un **ciclo de pago** es un bloque de días consecutivos durante el cual se acumula trabajo (horas, destajo, plazas de furgoneta) y adelantos, hasta que llega el momento de liquidarlo. El sistema maneja dos tipos de ciclo en paralelo y de forma completamente independiente:

- **Quincenal**: bloques de 14 días.
- **Mensual**: bloques de 30 días.

Cada trabajador, encargado o furgoneta tiene asignado uno de estos dos tipos, y todos los que comparten el mismo tipo se agrupan en el mismo calendario de bloques.

## 2. Cómo se calculan los bloques (el "reloj" del sistema)

El sistema no usa el mes calendario (día 1 a día 30/31) como referencia. En su lugar usa un **ciclo rodante** anclado a una fecha fija de origen:

- Se define una **fecha ancla** (un día concreto desde el cual se empieza a contar).
- A partir de esa ancla, el tiempo se divide en bloques contiguos de 14 o 30 días, sin parar y sin reiniciarse cada mes.
- Para saber a qué bloque pertenece una fecha cualquiera, se calculan los días transcurridos desde la ancla hasta esa fecha, y se hace una división entera entre la duración del bloque (14 o 30). El resultado es el "número de bloque".
- El **día de pago** de un bloque es exactamente el primer día del bloque siguiente. Es decir: si un bloque acumula del día 1 al día 14, el día de pago es el día 15 — y ese día 15 ya es, por definición, el primer día del bloque siguiente (que acumula del 15 al 28).

Este cálculo se hace siempre en una zona horaria fija, para que "en qué bloque estamos hoy" no dependa del huso horario del dispositivo que consulta.

### Por qué importa que los bloques sean contiguos (corrección histórica clave)

Antes de una corrección importante, el día de pago se trataba como un día "puente" que no pertenecía a ningún bloque (ni al que cerraba ni al que empezaba). El problema: en el terreno nada impide que alguien registre trabajo real justo ese día. Cuando eso pasaba, esa jornada quedaba huérfana — no pertenecía a ningún ciclo y se repartía mal entre los cálculos.

La corrección elimina ese "hueco": ahora cada fecha pertenece a **exactamente un** bloque, sin ambigüedad, incluida la fecha que coincide con el día de pago de otro bloque (esa fecha ya ES el inicio del bloque siguiente, por construcción matemática). Esto simplifica todo lo demás porque ya no hace falta ningún caso especial para "el día de pago".

## 3. Lo que este cálculo NO decide

Este mecanismo de bloques solo responde una pregunta muy acotada: **"dado un tipo de ciclo y una fecha, ¿a qué bloque pertenece esa fecha?"**. Es pura aritmética de fechas, sin ninguna consulta a la base de datos ni conocimiento del estado real de nóminas o pagos.

La pregunta de negocio real — **"¿cuál es el ciclo que hay que pagar AHORA mismo?"** — es una decisión distinta y más compleja, que vive en una capa superior. Ahí es donde entra el verdadero control de ciclos.

## 4. El candado global: un ciclo a la vez

Esta es la decisión de negocio central del sistema: **el pago avanza de un ciclo a la vez, para toda la nómina de un mismo tipo de pago simultáneamente** — nunca por persona individual.

Reglas concretas:

- No se puede cobrar el ciclo N+1 mientras quede **cualquier** persona (o furgoneta) con algo pendiente del ciclo N, sin importar cuántos ciclos más recientes ya hayan transcurrido en el calendario real.
- No importa que un empleado en particular no tenga nada pendiente del ciclo viejo — si CUALQUIER OTRO miembro de la nómina de ese tipo de pago sí tiene algo pendiente de un ciclo anterior, todo el sistema se queda "atorado" mostrando ese ciclo viejo como el ciclo a pagar.
- Esto aplica de forma espejada e independiente a dos poblaciones distintas: la nómina de personas (empleados/encargados) y la flota de furgonetas. Cada una tiene su propio candado, pero ambas usan exactamente la misma lógica.

### Cómo se determina el "ciclo candidato"

El sistema busca, entre todo el trabajo sin liquidar y todos los adelantos sin liquidar de ese tipo de pago (sin importar de quién sean), la **fecha pendiente más antigua** de toda la población. Esa fecha se resuelve contra el cálculo de bloques del punto 2, y el bloque que la contiene es "el ciclo candidato a pagar".

Esto significa que basta con que una sola jornada quede sin liquidar en un ciclo viejo para que ese ciclo entero siga siendo "el ciclo activo", bloqueando el avance para todos los demás.

## 5. La confirmación explícita del administrador

Llegar a **0€ pendiente** en un ciclo no es suficiente por sí solo para que el sistema avance al siguiente. Hace falta un paso adicional: el administrador debe **confirmar explícitamente** que ese ciclo ya se dio por cerrado y liquidado por completo.

El flujo es:

1. Cuando un ciclo ya fue pagado por completo (existe registro de pago para esa fecha de cierre) pero todavía no fue confirmado por el admin, el sistema sigue mostrando **ese** ciclo como "el ciclo a pagar" — con su total en 0€ — en vez de saltar automáticamente al siguiente.
2. Solo cuando el admin confirma manualmente ("Ciclo completado"), se registra esa confirmación y el candado se libera, dejando pasar al siguiente ciclo con trabajo pendiente.
3. Si no hay ningún ciclo pagado-pero-sin-confirmar, el sistema simplemente devuelve el candidato genuino calculado en el punto 4.

Esta doble condición (0€ + confirmación explícita) existe para dar al administrador un punto de control humano antes de que el sistema pase de página, evitando que un ciclo se dé por cerrado solo porque los números cuadraron.

## 6. Filtrado de datos mostrados dentro de un ciclo

Una vez que el sistema sabe cuál es "el ciclo a pagar", todas las pantallas que muestran trabajo pendiente, adelantos pendientes o historial de días de una persona/furgoneta concreta se acotan estrictamente a fechas **dentro o antes del cierre de ese ciclo**.

Esto es importante porque, sin ese límite, esas pantallas mezclarían el ciclo ya cerrado (el que realmente toca pagar) con cualquier jornada más reciente que ya pertenezca al bloque activo actual — incluyendo, potencialmente, trabajo registrado el mismo día de pago. El límite garantiza que lo que se muestra como "nómina a pagar ahora" sea exactamente lo que corresponde al ciclo bloqueado por el candado del punto 4, ni un día más.

También existe la variante de "arrastre": si una persona tiene trabajo pendiente que en teoría es más viejo que el inicio oficial del bloque calculado (por ejemplo, porque quedó atascado por el candado global mientras otros no liquidaban), ese trabajo se sigue incluyendo en el pago — el sistema ensancha el rango pagado hacia atrás hasta la fecha real más antigua con algo pendiente para esa persona, en vez de limitarse rígidamente al inicio "oficial" del bloque.

## 7. Ejecución del pago

Cuando se liquida un ciclo:

- El pago se ejecuta de forma atómica en el servidor para cada persona/furgoneta: liquida sus jornadas pendientes y descuenta sus adelantos pendientes dentro del rango exacto del ciclo, y registra un pago con el total realmente liquidado.
- El cálculo mostrado en pantalla antes de pagar es solo una previsualización; el monto que realmente queda registrado es el que calcula el servidor en ese mismo instante, para evitar divergencias si algo cambió entre que se mostró la pantalla y se confirmó el pago (un adelanto de último segundo, una jornada que entró en el ínterin).
- Cuando se pagan varias personas juntas como parte de un lote, la operación no es atómica entre ellas: si un pago individual falla a mitad del lote, los anteriores ya quedaron liquidados y hay que revisar manualmente el que falló.

## 8. Cambios de periodicidad de pago (quincenal ↔ mensual)

Cambiar el tipo de ciclo de una persona (por ejemplo, de quincenal a mensual) **no se aplica de inmediato**. En su lugar:

- El cambio se guarda como "pendiente" mientras la persona sigue operando bajo su ciclo actual.
- El cambio real solo se aplica (se "promueve") **justo después de que se ejecuta con éxito su próximo pago** — nunca antes. Esto evita que un cambio de periodicidad a mitad de ciclo distorsione cómo se agrupa el trabajo ya acumulado.
- Si la persona revierte su elección al valor que ya tenía vigente antes de que se promueva, el cambio pendiente simplemente se descarta.
- Si el intento de promoción falla por cualquier motivo (la persona se dio de baja justo en ese momento, un fallo de red), no se aborta el pago ni se hace fallar el lote completo — el pago ya ocurrió y es irreversible. El cambio pendiente simplemente se queda esperando y se reintenta en el próximo pago exitoso.

## 9. Reversión: cancelar vs. ocultar una lista de pago

Existen dos formas distintas de "deshacer" una lista de pago ya generada, y cuál aplica depende del estado de confirmación del ciclo al que pertenece:

- **Cancelar** (cuando el ciclo todavía NO fue confirmado por el admin): revierte por completo la operación. Vuelve a marcar como pendientes las jornadas y adelantos que se habían liquidado, borra el registro de pago, y — si esa lista había disparado la promoción de un cambio de periodicidad — restaura el tipo de ciclo anterior de la persona, exactamente como estaba antes de pagar. Para esto es indispensable que se haya guardado, en el momento del pago, cuál era el tipo de ciclo *antes* de la promoción: sin ese dato, cancelar devolvería el dinero pero dejaría a la persona atrapada para siempre en el ciclo nuevo.
- **Ocultar** (cuando el ciclo YA fue confirmado/archivado por el admin): no revierte nada — el trabajo y los adelantos siguen liquidados, el dinero sigue movido — solo deja de mostrar esa lista en la vista de listas generadas. Esto existe precisamente para evitar que cancelar algo de un ciclo ya dado por cerrado "resucite" ese ciclo como si todavía estuviera pendiente, lo cual rompería el candado global del punto 4 (haría retroceder el sistema a un ciclo que el admin ya certificó como terminado).

## 10. Resumen del flujo completo

1. El calendario de bloques (ancla + duración) define matemáticamente a qué ciclo pertenece cualquier fecha, sin huecos ni ambigüedades.
2. El sistema busca la fecha pendiente más antigua de toda la nómina (o flota) de un tipo de pago y la resuelve a un bloque: ese es el "ciclo candidato".
3. Si existe un ciclo anterior ya pagado pero sin confirmar, ese manda por encima del candidato — el sistema no avanza solo.
4. El admin paga ese ciclo (por persona o en lote) mediante una operación atómica del lado del servidor.
5. Tras cada pago exitoso, se promueven los cambios de periodicidad pendientes de esa persona.
6. El admin confirma explícitamente que el ciclo quedó cerrado, liberando el candado para el siguiente.
7. Cualquier reversión posterior distingue si el ciclo ya fue confirmado (solo se oculta) o no (se cancela de verdad, restaurando todo el estado previo, incluida la periodicidad).

Este diseño prioriza la integridad del historial de nómina por encima de la comodidad: prefiere bloquear el avance de todo un tipo de pago con tal de no dejar a nadie sin cobrar de un ciclo viejo, y exige confirmación humana en el punto de no retorno (el archivo de un ciclo) en vez de confiar únicamente en que el saldo llegue a cero.