# PlanCity — Prueba de Desempeño Módulo Typescript-React

**SuperApp** está lanzando **PlanCity**, su nueva vertical para descubrir y organizar eventos y actividades locales (conciertos, talleres, eventos deportivos, etc.). El equipo de backend ya construyó y dejó funcionando la API REST (NestJS + PostgreSQL) que maneja usuarios con roles, categorías de evento, eventos y favoritos, con autenticación por JWT.

Este proyecto es la interfaz frontend que consume correctamente esa API, respetando las reglas de negocio que ya existen en el servidor. No es un frontend abstracto: es una integración contra un backend real, con sus mismas reglas y sus mismos errores.

## Autor

**Jose D. Romero** - [@Its-JrDev](https://github.com/Its-JrDev)

## Objetivo

Construir una interfaz web utilizando React, TypeScript y Vite que consuma la API REST de PlanCity (ya construida y en funcionamiento) para la gestión de eventos y actividades locales.

## Stack Tecnológico

| Categoría | Tecnología |
|-----------|------------|
| Framework | React 19 + Vite 8 |
| Lenguaje | TypeScript 6 |
| Estilos | Tailwind CSS 4 + shadcn/ui |
| Routing | React Router 7 |
| Estado | React Context + Hooks |
| HTTP Client | Axios |
| Iconos | Lucide React |
| Notificaciones | Sonner |
| Formularios | Zod (validación) |
| Tablas | Tanstack Table |
| Testing | Vitest + Testing Library |
| Calidad de código | ESLint + Prettier |

## Arquitectura del Proyecto

### Arquitectura Basada en Tipos + Diseño Atómico

Este proyecto combina dos patrones complementarios:

1. **Arquitectura Basada en Tipos** (organización horizontal): Los archivos se agrupan según su responsabilidad técnica — `components/`, `hooks/`, `services/`, `types/`, etc. Es el patrón tradicional en frameworks como React, Angular o Express.

2. **Diseño Atómico** (organización vertical dentro de componentes): Los componentes UI siguen una jerarquía de complejidad creciente: átomos → moléculas → organismos → templates.

```
src/
├── components/
│   ├── atoms/          # Elementos base indivisibles (Button, Input, Badge)
│   ├── molecules/      # Composiciones simples (Card, Popover, ProfileMenu)
│   ├── organisms/      # Componentes complejos con lógica (AppHeader, Sidebar, EventCard)
│   └── templates/      # Layouts de página (AppShell, EventsTemplate)
├── types/              # Definiciones TypeScript centralizadas
├── hooks/              # Custom hooks reutilizables
├── services/           # Capa de API (axios + servicios por dominio)
├── contexts/           # Estado global (AuthContext, FavoritesContext)
├── providers/          # Proveedores de contexto
├── router/             # Enrutamiento con guards
│   └── guards/         # AuthGuard, GuestGuard, RoleGuard
├── layouts/            # Layouts de página
├── pages/              # Componentes de página
├── utils/              # Utilidades (cn para tailwind-merge + clsx)
├── styles/             # Temas y estilos globales
└── config/             # Configuración (axios.config)
```

### ¿Por qué esta combinación?

Este proyecto fue construido en **~7 horas** como entrega de una prueba de desempeño. La decisión de combinar ambos patrones se justifica así:

**Arquitectura Basada en Tipos — ¿Por qué?**

- **Velocidad de desarrollo**: No hay tiempo que perder diseñando módulos de negocio. Saber que todos los hooks van en `hooks/`, los servicios en `services/`, y los tipos en `types/` permite escribir código inmediatamente.
- **Curva de aprendizaje cero**: El revisor o cualquier developer que lea el proyecto entiende la estructura al instante. No hay convenciones personalizadas que memorizar.
- **Ubicación predecible**: En un desarrollo contra reloj, si necesitas un servicio vas a `services/`, si necesitas un tipo vas a `types/`.

**Diseño Atómico — ¿Por qué?**

- **Reutilización inmediata**: Los átomos (Button, Input, Badge) se reutilizan en todas las moléculas y organismos sin duplicar código.
- **Consistencia visual**: Al tener building blocks definidos, toda la UI mantiene coherencia sin esfuerzo adicional.
- **Escalabilidad de componentes**: Agregar nuevas vistas es rápido porque se componen de piezas ya existentes.

### Trade-offs aceptados

| Ventaja aprovechada | Trade-off aceptado |
|---------------------|-------------------|
| Desarrollo inmediato | Posible fragmentación futura de features entre carpetas |
| Estructura ubicable | Cambio de contexto entre carpetas al modificar una feature |
| Reutilización de átomos | Overhead de abstracción en componentes muy simples |
| Sin overhead de diseño de dominio | No escala tan bien como Domain-Driven en proyectos grandes |

## Decisiones de Diseño

### ¿Por qué shadcn/ui?

shadcn/ui no es una biblioteca tradicional que se instala vía npm como dependencia. En su lugar, los componentes se copian directamente al proyecto, lo que significa:

- **Control total**: Cada componente es tuyo. Puedes modificarlo sin esperar PRs ni luchar con APIs restrictivas.
- **Sin sobrecarga de dependencias**: Solo usas lo que necesitas. Radix UI como primitiva accesible, Tailwind para estilos.
- **Consistencia**: Todos los componentes siguen el mismo patrón de diseño basado en CVA (class-variance-authority) para variantes.

### ¿Por qué Axios?

- **Interceptores**: Permite centralizar la lógica de tokens JWT (inyección automática del header `Authorization` y manejo de 401).
- **Mejor manejo de errores**: A diferencia de `fetch`, Axios lanza errores en respuestas 4xx/5xx, simplificando el try/catch.
- **Cancelación de requests**: Importante para evitar race conditions en búsquedas y filtros.
- **Transformación de datos**: Serialización/deserialización automática.

### ¿Por qué React Router 7?

- **Data APIs**: Soporte nativo para loaders y actions, separando la lógica de obtención de datos del renderizado.
- **Guards declarativos**: Los componentes `AuthGuard`, `GuestGuard` y `RoleGuard` se integran naturalmente como wrappers en la definición de rutas.
- **Navegación tipo-safe**: Mejor integración con TypeScript.

### ¿Por qué Tailwind CSS 4?

- **Rendimiento**: Compila solo las clases que usas, generando CSS mínimo.
- **DX**: Elimina el contexto-switching entre archivos. Los estilos viven junto al markup.
- **Configuración como CSS**: La v4 usa directivas nativas de CSS (`@import 'tailwindcss'`), simplificando la configuración.
- **Utilidad `cn()`**: Combinamos `clsx` + `tailwind-merge` para resolver conflictos de clases condicionales.

### ¿Por qué React Context + Hooks en lugar de Redux/Zustand?

Para una app de este alcance, Context es suficiente y evita dependencias adicionales. Los proveedores están separados por dominio (`AuthProvider`, `FavoritesProvider`) para minimizar re-renders.

## Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia servidor de desarrollo (Vite) |
| `npm run build` | Compila para producción |
| `npm run preview` | Vista previa del build de producción |
| `npm run typecheck` | Verificación de tipos (tsc -b) |
| `npm run lint` | Ejecuta ESLint |
| `npm run lint:fix` | ESLint con auto-fix |
| `npm run format` | Formatea código con Prettier |
| `npm run format:check` | Verifica formato sin modificar |
| `npm run test` | Tests en modo watch (Vitest) |
| `npm run test:run` | Tests una sola vez |
| `npm run ui:add` | Agrega componentes shadcn al proyecto |
| `npm run ui:normalize` | Normaliza imports (`src/` → `@/`) y gestiona directivas ESLint |

### Razón de los Scripts Custom

- **`ui:normalize`**: shadcn genera componentes con imports relativos (`../../../utils/cn`). Este script los convierte a alias (`@/utils/cn`) para mantener limpio el código. También gestiona automáticamente la directiva `eslint-disable react-refresh/only-export-components` que shadcn requiere en archivos barrel.

## Configuración del Entorno

En el monorepo, `VITE_API_URL` se configura en `apps/web/.env` para desarrollo local
o como argumento de build al construir el contenedor. El seed y la inicialización de
datos pertenecen a la configuración de base de datos del monorepo, no a la web.

```env
VITE_API_URL=http://localhost:3000
```

## Cómo Ejecutar

```bash
# Desde apps/web del monorepo
npm install

# Iniciar desarrollo contra la API local
npm run dev
```

## Características

- **Autenticación JWT**: Login/Register con persistencia de sesión
- **Roles**: Vista diferenciada para `user` y `admin`
- **CRUD completo**: Eventos y categorías (admin)
- **Favoritos**: Toggle de favoritos por usuario
- **Búsqueda**: Command palette (Cmd+K) para navegación rápida
- **Paginación**: Con selector de items por página
- **Temas**: Light/Dark con el preset "Desert Sands"
- **Responsive**: Sidebar colapsable + drawer móvil
- **Toasts**: Notificaciones con Sonner
- **Protección de rutas**: Guards por auth y por rol
