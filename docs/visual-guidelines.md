# Guía visual de PlanCity

Esta guía registra el sistema visual existente en `apps/web`; no propone un rediseño.
Al integrar cambios, conservar los componentes, jerarquía, tema y patrones responsive ya
implementados.

## Tecnologías y estilos

- React con Tailwind CSS 4, cargado mediante `@import 'tailwindcss'` en
	`apps/web/src/styles/globals.css` y el plugin de Vite.
- Los controles reutilizables siguen el patrón de shadcn/ui, con primitivas de Radix,
	Base UI y componentes locales. `components.json` define la configuración de shadcn.
- El tema `desert-sands` vive en `apps/web/src/styles/desert-sands.css`; sus tokens
	alimentan las clases semánticas de fondo, primer plano, bordes, sidebar y estados.
	No reemplazarlo ni introducir una paleta paralela.
- `cn()` en `apps/web/src/utils/cn.ts` combina clases condicionales con `clsx` y
	resuelve conflictos de utilidades Tailwind con `tailwind-merge`.

## Jerarquía de componentes

La composición existente va de elementos pequeños a páginas completas:

1. **Átomos** (`apps/web/src/components/atoms/`): botón, input, label, separador,
	 skeleton, textarea e imagen de evento. Son los bloques básicos de interacción.
2. **Moléculas** (`apps/web/src/components/molecules/`): alertas, tarjetas, diálogos,
	 campos, paginación, menús, selector, tema y botón de favorito.
3. **Organismos** (`apps/web/src/components/organisms/`): `AppHeader`, `Sidebar`,
	 `EventCard`, formularios de evento/categoría y sus diálogos.
4. **Templates** (`apps/web/src/components/templates/`): estructura y estados de
	 Inicio, Eventos, detalle, Categorías, Favoritos, autenticación, acceso denegado y
	 página no encontrada.
5. **Páginas y layout** (`apps/web/src/pages/`, `apps/web/src/layouts/`): conectan los
	 templates a las rutas y usan `MainLayout`/`AppShell` para el catálogo.

Mantener esta separación; no duplicar patrones de presentación en cada página ni
trasladar lógica de negocio a los controles de base.

## Estados de interfaz

- Las cargas asíncronas deben conservar los indicadores de carga/skeleton existentes,
	los resultados vacíos y los mensajes de error del template correspondiente.
- `useFetch` y `useEventList` exponen `isLoading` y `error`; el listado de eventos
	también conserva datos paginados en cliente (9 por página por defecto).
- Las acciones y errores de formulario se comunican mediante los componentes de alerta
	y Sonner ya integrados. No silenciar errores de API ni reemplazar mensajes por fallos
	genéricos sin necesidad.
- Respetar los estados activos, hover, disabled y focus proporcionados por variantes de
	controles y tokens del tema.

## Navegación y responsive

- `AppShell` mantiene el sidebar fijo de escritorio y el área de contenido centrada
	hasta `max-w-6xl`. El botón del header permite colapsar el sidebar en escritorio.
- En viewport móvil el sidebar es un drawer sobrepuesto con fondo oscurecido; se cierra
	al elegir un enlace, tocar el fondo o pulsar Escape. Mientras está abierto, se bloquea
	el scroll del documento.
- `Sidebar` filtra los enlaces según sesión/rol: Favoritos requiere autenticación y las
	acciones administrativas solo se muestran a administradores. Los guards de rutas son
	la autoridad de acceso; ocultar un enlace no reemplaza la autorización.
- Verificar interfaces estrechas y anchas sin alterar el comportamiento de rutas,
	guards, servicios, tipos o tema.

## Cambios permitidos en el monorepo

El único ajuste de entorno frontend es `VITE_API_URL`, provisto al build de Vite/Docker.
La aplicación consume la API HTTP; no accede directamente a PostgreSQL ni incluye
scripts de seed, ya que el inicializado de datos corresponde al módulo de base de datos.
