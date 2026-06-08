# Ecommerce UCT — SDD Academic Edition v1.0

> Repositorio documental maestro del proyecto integrador **Diseño y Desarrollo de Software + IA**.
> Plataforma de ecommerce construida con metodología **Specification Driven Development (SDD)**, arquitectura modular A-H y equipos especializados coordinados en Jira.

---

## Tabla de Contenidos

- [Visión del Producto](#visión-del-producto)
- [Stack Tecnológico](#stack-tecnológico)
- [Metodología](#metodología)
- [Arquitectura Modular](#arquitectura-modular)
- [Modelo de Datos](#modelo-de-datos)
- [Reglas de Negocio](#reglas-de-negocio)
- [Contratos API](#contratos-api)
- [Estructura del Repositorio](#estructura-del-repositorio)
- [Equipo y Gestión](#equipo-y-gestión)

---

## Visión del Producto

**Problema que resuelve:** Las pequeñas tiendas necesitan una plataforma de ventas online simple, administrable y sin dependencia de grandes plataformas externas.

### Usuarios del sistema

| Rol | Descripción |
|---|---|
| **Visitante** | Navega el catálogo sin autenticación |
| **Cliente** | Se registra, compra y gestiona sus pedidos |
| **Administrador** | Gestiona inventario, pedidos y reportes desde el dashboard |

### Capacidades del sistema

- Exploración de catálogo con categorías jerárquicas y variantes de producto (talla, color, SKU)
- Flujo completo de compra: carrito → checkout → pago → confirmación
- Gestión de pedidos con trazabilidad de estados
- Administración de inventario con control de stock mínimo
- Wishlist, reseñas y sistema de cupones/descuentos
- Documentos tributarios (boleta/factura) y gestión de devoluciones
- Panel de administración con reportes y auditoría del sistema

---

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| **Frontend** | HTML5, CSS3, Bootstrap 5.3, JavaScript |
| **Backend** | PHP 8, REST API |
| **Base de datos** | MySQL |
| **Autenticación** | JWT |
| **Intercambio de datos** | JSON |

---

## Metodología

Este proyecto aplica **Specification Driven Development (SDD)**: toda funcionalidad existe primero como especificación formal antes de escribir una sola línea de código.

### Flujo de trabajo

```
Spec → Revisión → Aprobación → Implementación → Testing → PR → Merge
```

- **Scrum** para gestión ágil de sprints (tablero en **Jira**)
- **GitHub Flow** para control de versiones: rama por feature, PR obligatorio, revisión de pares
- Cada módulo tiene su propio equipo responsable con especificaciones independientes

---

## Arquitectura Modular

El sistema se divide en **8 módulos** (A–H), cada uno con equipo y documentación propios:

| Módulo | Nombre | Responsabilidad |
|---|---|---|
| **A** | Catálogo | Listado, búsqueda y detalle de productos. Categorías y variantes |
| **B** | Carrito | Gestión del carrito de compras y cálculo de totales |
| **C** | Autenticación | Registro, login, JWT, roles y permisos (RBAC) |
| **D** | Checkout | Proceso de compra, selección de dirección y método de envío |
| **E** | Pasarela de Pago | Procesamiento de pagos, reintentos y estados de transacción |
| **F** | Inventario | Control de stock por variante, alertas de stock mínimo |
| **G** | Administración | Dashboard, gestión de pedidos, usuarios y reportes |
| **H** | Integración | Coordinación entre módulos, contratos compartidos y eventos |

Cada módulo contiene:

```
modulo-X/
├── spec.md                # Especificación funcional
├── user-stories.md        # Historias de usuario
├── casos-uso.md           # Casos de uso detallados
├── criterios-aceptacion.md
├── api-contract.md        # Contrato de API del módulo
├── tareas.md              # Backlog de tareas
├── checklist.md           # Checklist de completitud
├── testing.md             # Estrategia de testing
└── riesgos.md             # Riesgos identificados
```

---

## Modelo de Datos

El modelo cubre **14 dominios funcionales** con enfoque en escalabilidad, trazabilidad e integridad:

### Dominios

```
Usuarios / Roles / Direcciones
Catálogo / Productos / Variantes / Imágenes
Inventario
Carrito / Items
Pedidos / DetallePedido / EstadosPedido
Pagos
Envíos / MetodosEnvio / EstadosEnvio
Cupones / Descuentos
Impuestos / DocumentosTributarios
Wishlist
Reseñas
Devoluciones / Reembolsos
Auditoría
```

### Relaciones principales

```
Usuario 1:N Direccion
Usuario N:M Rol
Usuario 1:N Pedido
Usuario 1:1 Carrito
Categoria 1:N Producto
Producto 1:N VarianteProducto
VarianteProducto 1:1 Inventario
Carrito 1:N ItemCarrito
Pedido 1:N DetallePedido
Pedido 1:N EstadoPedido
Pedido 1:N Pago
Pedido N:M Cupon
Pedido 1:1 DocumentoTributario
Pedido 1:1 Envio
Pedido 1:N Devolucion
Devolucion 1:N Reembolso
```

> Ver diagrama ERD completo en [`specs/02-modelado/modelo-dominio.md`](specs/02-modelado/modelo-dominio.md)

### Principios de diseño del modelo

- **Soft Delete** en registros históricos (nunca eliminación física)
- **Snapshot inmutable** en DetallePedido (precio y nombre al momento de compra)
- **Roles por tabla** en lugar de ENUM, para escalabilidad RBAC
- **Pago 1:N** por pedido, para soportar reintentos y múltiples pasarelas
- **Stock en variante**, no en producto raíz

---

## Reglas de Negocio

| Código | Regla |
|---|---|
| RN-001 | No se pueden vender productos sin stock disponible |
| RN-002 | Solo los administradores pueden acceder al dashboard |
| RN-003 | El stock se descuenta únicamente tras confirmación de pago |
| RN-004 | Los usuarios deshabilitados no pueden iniciar sesión |
| RN-005 | Todo pedido debe tener trazabilidad completa de estados |

**Estados del pedido:** `pendiente_pago` → `pagado` → `en_preparacion` → `enviado` → `entregado` / `cancelado`

**Estados del pago:** `pendiente` → `aprobado` / `rechazado`

---

## Contratos API

Los contratos OpenAPI 3.0 de cada módulo se encuentran en [`specs/03-contratos-api/`](specs/03-contratos-api/):

| Archivo | Módulo |
|---|---|
| `auth.yaml` | Autenticación y sesiones |
| `catalogo.yaml` | Productos y categorías |
| `carrito.yaml` | Carrito de compras |
| `checkout.yaml` | Proceso de compra |
| `pagos.yaml` | Transacciones |
| `inventario.yaml` | Stock y variantes |
| `admin.yaml` | Panel de administración |

---

## Estructura del Repositorio

```
ecommerce-project-s1-team-1-heavyduty/
├── README.md
└── specs/
    ├── 00-producto/
    │   ├── vision-producto.md
    │   └── reglas-negocio.md
    ├── 01-arquitectura/
    │   └── arquitectura-general.md
    ├── 02-modelado/
    │   └── modelo-dominio.md
    ├── 03-contratos-api/
    │   ├── auth.yaml
    │   ├── catalogo.yaml
    │   ├── carrito.yaml
    │   ├── checkout.yaml
    │   ├── pagos.yaml
    │   ├── inventario.yaml
    │   └── admin.yaml
    └── 04-modulos/
        ├── modulo-a/   ← Catálogo
        ├── modulo-b/   ← Carrito
        ├── modulo-c/   ← Autenticación
        ├── modulo-d/   ← Checkout
        ├── modulo-e/   ← Pasarela de Pago
        ├── modulo-f/   ← Inventario
        ├── modulo-g/   ← Administración
        └── modulo-h/   ← Integración
```

---

## Equipo y Gestión

- **Metodología ágil:** Scrum con sprints gestionados en **Jira**
- **Control de versiones:** GitHub Flow — rama por feature, PR obligatorio con revisión de pares
- **Documentación:** Toda especificación debe estar aprobada antes de iniciar implementación (SDD)
- **Equipo:** Sección 1, Team 1 — Heavy Duty

---

*Ecommerce UCT — SDD Academic Edition v1.0 · Proyecto Integrador DDS + IA*
