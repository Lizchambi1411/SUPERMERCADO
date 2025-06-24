# SuperMarket Pro - Sistema de Gestión de Inventario

Un sistema completo de gestión para supermercados desarrollado con Flask y Python.

## 🚀 Características

- **Sistema de Ventas (POS)** - Punto de venta completo con carrito de compras
- **Gestión de Inventario** - Control de stock con alertas automáticas
- **Gestión de Productos** - CRUD completo con categorías y proveedores
- **Gestión de Clientes** - Base de datos de clientes con historial
- **Reportes Avanzados** - Análisis de ventas y estadísticas
- **Sistema de Usuarios** - Roles de administrador y vendedor
- **Interfaz Moderna** - Diseño responsivo con Bootstrap 5

## 🛠️ Tecnologías

- **Backend**: Python Flask
- **Base de Datos**: PostgreSQL (Producción) / SQLite (Desarrollo)
- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap 5
- **Autenticación**: Flask-Login
- **Formularios**: Flask-WTF
- **Gráficos**: Chart.js

## 📦 Instalación Local

1. **Clonar el repositorio**
```bash
git clone <tu-repositorio>
cd supermarket-pro
```

2. **Crear entorno virtual**
```bash
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
```

3. **Instalar dependencias**
```bash
pip install -r requirements.txt
```

4. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

5. **Ejecutar la aplicación**
```bash
python run.py
```

La aplicación estará disponible en `http://localhost:5000`

## 🌐 Deployment en Render

### Opción 1: Usando render.yaml (Recomendado)

1. **Subir código a GitHub**
2. **Conectar repositorio en Render**
3. **El archivo `render.yaml` configurará automáticamente:**
   - Servicio web con Python
   - Base de datos PostgreSQL
   - Variables de entorno

### Opción 2: Configuración Manual

1. **Crear Web Service en Render**
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn run:app`
   - Environment: `Python 3.11`

2. **Crear PostgreSQL Database**
   - Nombre: `supermarket-db`
   - Usuario: `supermarket_user`

3. **Configurar Variables de Entorno**
   - `SECRET_KEY`: (generar automáticamente)
   - `DATABASE_URL`: (conectar con la base de datos)
   - `FLASK_ENV`: `production`

## 👥 Usuarios de Prueba

### Desarrollo Local
- **Administrador**: `admin@supermercado.com` / `admin123`
- **Vendedor**: `vendedor@supermercado.com` / `vendedor123`

### Producción
- **Administrador**: `admin@supermarketpro.com` / `SuperMarket2024!`

## 📱 Funcionalidades por Rol

### 👨‍💼 Administrador
- ✅ Dashboard completo con estadísticas
- ✅ Gestión de productos, categorías y proveedores
- ✅ Gestión de clientes y usuarios
- ✅ Sistema de ventas completo
- ✅ Control de inventario y movimientos
- ✅ Reportes avanzados y exportación
- ✅ Configuración del sistema

### 🛒 Vendedor
- ✅ Dashboard con estadísticas básicas
- ✅ Gestión de productos y clientes
- ✅ Sistema de ventas (POS)
- ✅ Consulta de inventario
- ✅ Reportes básicos

## 🔧 Estructura del Proyecto

```
supermarket-pro/
├── app.py                 # Configuración principal de Flask
├── run.py                 # Punto de entrada de la aplicación
├── config.py              # Configuraciones
├── models.py              # Modelos de base de datos
├── forms.py               # Formularios WTF
├── decorators.py          # Decoradores personalizados
├── requirements.txt       # Dependencias Python
├── render.yaml           # Configuración para Render
├── Procfile              # Configuración para deployment
├── runtime.txt           # Versión de Python
├── blueprints/           # Módulos de la aplicación
│   ├── auth.py           # Autenticación
│   ├── main.py           # Dashboard
│   ├── products.py       # Gestión de productos
│   ├── categories.py     # Gestión de categorías
│   ├── suppliers.py      # Gestión de proveedores
│   ├── customers.py      # Gestión de clientes
│   ├── sales.py          # Sistema de ventas
│   ├── inventory.py      # Control de inventario
│   ├── reports.py        # Reportes y análisis
│   └── users.py          # Gestión de usuarios
├── templates/            # Plantillas HTML
├── static/               # Archivos estáticos (CSS, JS, imágenes)
└── README.md
```

## 🚀 Características Técnicas

### Sistema de Ventas (POS)
- Búsqueda de productos en tiempo real
- Carrito de compras interactivo
- Cálculo automático de totales y descuentos
- Control de stock automático
- Generación de recibos imprimibles
- Múltiples métodos de pago

### Gestión de Inventario
- Movimientos de entrada, salida y ajuste
- Alertas de stock bajo y crítico
- Historial completo de movimientos
- Reportes detallados con exportación
- Ajustes individuales por producto

### Sistema de Reportes
- Gráficos interactivos con Chart.js
- Filtros por fecha y categoría
- Exportación a CSV
- Análisis de productos más vendidos
- Estadísticas de clientes

### Seguridad
- Autenticación con roles
- Validación de formularios
- Protección CSRF
- Control de acceso por funcionalidad
- Soft delete para mantener integridad

## 📞 Soporte

Para soporte técnico o consultas, contacta al equipo de desarrollo.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.