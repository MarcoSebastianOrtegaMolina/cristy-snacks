# Cristy Snack's — Sistema de Gestion

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)

Sistema web para gestionar el inventario, ventas, pedidos y finanzas de **Cristy Snack's** — negocio de semillas, frutos secos y snacks artesanales en Hermosillo, Sonora.

## Por que se creo?

Cristian Armando maneja su negocio con archivos Excel: inventario, ventas, gastos y pedidos al proveedor. Esto presentaba varios problemas:

- Incomodo en iPhone/iPad (su herramienta de trabajo diaria)
- No hay historial automatico de ventas
- Los pedidos al proveedor se hacian copiando datos a mano
- No hay control de gastos ni calculo automatico de ganancias
- Imposible tener datos en tiempo real desde multiples dispositivos

Este sistema reemplaza todo eso con una **web app responsive** que funciona perfecto en cualquier dispositivo.

## Funcionalidades

### Dashboard
- Resumen de ventas, gastos y ganancias por periodo (hoy/semana/mes)
- Alertas de stock bajo
- Productos mas vendidos
- Valor total del inventario

### Catalogo de Productos
- 48 productos pre-cargados del catalogo real
- CRUD completo (crear, editar, desactivar, eliminar)
- Filtros por categoria y busqueda por nombre
- Tamanos: Bolsa Completa, Media Bolsa, Bolsa Chica, Pieza

### Inventario
- Control de stock en tiempo real
- Botones rapidos de +/- para ajustar cantidades
- Entrada masiva de mercancia
- Alertas automaticas de stock bajo

### Registro de Ventas
- Flujo rapido: toca productos, ajusta cantidad, registra
- Actualizacion automatica del inventario al vender
- Historial con filtros por periodo
- Calculo automatico de ganancia por venta

### Generador de Pedidos
- Selecciona productos con cantidades usando botones +/-
- Calcula total en tiempo real
- **Genera archivo Excel** con el formato exacto del proveedor
- Incluye envio a domicilio configurable

### Control de Gastos
- Categorias personalizables (etiquetas, bolsas, envio, etc.)
- Registro rapido con fecha y descripcion
- Resumen por categoria y periodo

### Configuracion
- Datos del negocio editables
- **Reparto de ganancias** configurable (30/70, 50/50, etc.)
- Categorias de gastos: anadir, editar, eliminar
- Umbral de alerta de stock bajo personalizable

### Autenticacion
- Login seguro con email/contrasena
- Datos 100% privados por usuario
- Multi-dispositivo: misma cuenta en iPhone, iPad, laptop

## Stack Tecnologico

| Tecnologia | Uso |
|---|---|
| [Next.js 16](https://nextjs.org/) | Framework React con SSR |
| [TypeScript](https://www.typescriptlang.org/) | Tipado estatico |
| [Supabase](https://supabase.com/) | Auth + PostgreSQL Database |
| [SheetJS (xlsx)](https://sheetjs.com/) | Generacion de Excel |
| [Vercel](https://vercel.com/) | Hosting |
| Vanilla CSS | Diseno personalizado |

## Instalacion Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/MarcoSebastianOrtegaMolina/cristy-snacks.git
cd cristy-snacks

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.local.example .env.local
# Editar .env.local con tus credenciales de Supabase

# 4. Crear tablas en Supabase
# Ir al SQL Editor de Supabase y ejecutar supabase-setup.sql

# 5. Iniciar servidor de desarrollo
npm run dev
```

## Diseno Mobile-First

La app esta optimizada para uso tactil en iPhone/iPad:
- Sidebar colapsable en mobile
- Botones grandes para seleccion rapida
- Controles +/- para cantidades sin teclado
- Layout responsive que se adapta a cualquier pantalla

## Desarrollado por

**Marco Sebastian Ortega Molina**

Para **Cristian Armando Ortega Molina** — Cristy Snack's
Hermosillo, Sonora, Mexico