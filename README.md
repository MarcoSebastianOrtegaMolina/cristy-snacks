# 🥜 Cristy Snack's — Sistema de Gestión

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)

Sistema web para gestionar el inventario, ventas, pedidos y finanzas de **Cristy Snack's** — negocio de semillas, frutos secos y snacks artesanales en Hermosillo, Sonora.

## 🎯 ¿Por qué se creó?

Cristian Armando maneja su negocio con archivos Excel: inventario, ventas, gastos y pedidos al proveedor. Esto presentaba varios problemas:

- ❌ Incómodo en iPhone/iPad (su herramienta de trabajo diaria)
- ❌ No hay historial automático de ventas
- ❌ Los pedidos al proveedor se hacían copiando datos a mano
- ❌ No hay control de gastos ni cálculo automático de ganancias
- ❌ Imposible tener datos en tiempo real desde múltiples dispositivos

Este sistema reemplaza todo eso con una **web app responsive** que funciona perfecto en cualquier dispositivo.

## ✨ Funcionalidades

### 📊 Dashboard
- Resumen de ventas, gastos y ganancias por periodo (hoy/semana/mes)
- Alertas de stock bajo
- Productos más vendidos
- Valor total del inventario

### 🥜 Catálogo de Productos
- 48 productos pre-cargados del catálogo real
- CRUD completo (crear, editar, desactivar, eliminar)
- Filtros por categoría y búsqueda por nombre
- Tamaños: Bolsa Completa, Media Bolsa, Bolsa Chica, Pieza

### 📦 Inventario
- Control de stock en tiempo real
- Botones rápidos de +/- para ajustar cantidades
- Entrada masiva de mercancía
- Alertas automáticas de stock bajo

### 💰 Registro de Ventas
- Flujo rápido: toca productos → ajusta cantidad → registra
- Actualización automática del inventario al vender
- Historial con filtros por periodo
- Cálculo automático de ganancia por venta

### 🛒 Generador de Pedidos
- Selecciona productos con cantidades usando botones +/-
- Calcula total en tiempo real
- **Genera archivo Excel** con el formato exacto del proveedor
- Incluye envío a domicilio configurable

### 💸 Control de Gastos
- Categorías personalizables (etiquetas, bolsas, envío, etc.)
- Registro rápido con fecha y descripción
- Resumen por categoría y periodo

### ⚙️ Configuración
- Datos del negocio editables
- **Reparto de ganancias** configurable (30/70, 50/50, etc.)
- Categorías de gastos: añadir, editar, eliminar
- Umbral de alerta de stock bajo personalizable

### 🔐 Autenticación
- Login seguro con email/contraseña
- Datos 100% privados por usuario
- Multi-dispositivo: misma cuenta en iPhone, iPad, laptop

## 🛠️ Stack Tecnológico

| Tecnología | Uso |
|---|---|
| [Next.js 16](https://nextjs.org/) | Framework React con SSR |
| [TypeScript](https://www.typescriptlang.org/) | Tipado estático |
| [Supabase](https://supabase.com/) | Auth + PostgreSQL Database |
| [SheetJS (xlsx)](https://sheetjs.com/) | Generación de Excel |
| [Vercel](https://vercel.com/) | Hosting |
| Vanilla CSS | Diseño personalizado |

## 🚀 Instalación Local

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

## 📱 Diseño Mobile-First

La app está optimizada para uso táctil en iPhone/iPad:
- Sidebar colapsable en mobile
- Botones grandes para selección rápida
- Controles +/- para cantidades sin teclado
- Layout responsive que se adapta a cualquier pantalla

## 👨‍💻 Desarrollado por

**Marco Sebastián Ortega Molina**

Para **Cristian Armando Ortega Molina** — Cristy Snack's
Hermosillo, Sonora, México 🇲🇽
