# `src/components` — Organización

Cuatro capas, de menos a más conocimiento del negocio. La regla es una sola: **una capa puede importar de las capas anteriores, nunca de las siguientes.**

```
ui/  ←  layout/  ←  forms/  ←  domain/
```

| Carpeta | Qué contiene | Sabe qué es una furgoneta |
|---|---|---|
| `ui/` | Primitivos visuales: botón, tarjeta, insignia, modal | No |
| `layout/` | Estructura de pantalla: contenedores, cabeceras, cuadrículas | No |
| `forms/` | Composiciones de campos con validación y estado de envío | Parcialmente |
| `domain/` | Piezas de ESTAJOS: tarjeta de furgoneta, buscador de personal, modal de jornada | Sí |

Las dos primeras están documentadas en detalle en `ui/README.md` y `layout/README.md`.

---

## Cómo decidir dónde va un componente

1. **¿Su trabajo es colocar cosas, no pintarlas?** → `layout/`
2. **¿Se entiende sin saber nada de ESTAJOS?** → `ui/`
3. **¿Es un conjunto de campos que se validan y envían juntos?** → `forms/`
4. **En cualquier otro caso** → `domain/`

Ejemplos de la aplicación actual:

- `Badge` → `ui/`. Pinta una letra en un círculo; que "E" signifique encargado es cosa de quien la usa.
- `PageContainer` → `layout/`. Solo decide anchos y relleno.
- `ModalJornada` → `domain/`. Conoce las reglas de horas, destajo y roles.
- `TarjetaFurgonetaCampo` → `domain/`. Sabe que en Campo las insignias Q y M están ocultas a propósito.

---

## Fuente de los valores visuales

Todo color, tamaño de texto, ancho de contenedor y separación sale de `src/lib/theme.js`, que implementa el tema Pizarra. Ningún componente escribe un hex a mano ni una clase de color de Tailwind: el tema se aplica en tiempo de ejecución, y un valor escrito a mano no cambiaría al cambiar de tema.

Los tres documentos de diseño (`Doc1` fundamentos visuales, `Doc2` estructura y layout, `Doc3` componentes e interacción) son la referencia normativa. Cuando un componente se aparta de la maqueta original, la desviación está anotada en el README de su carpeta con el punto del documento que la justifica.
