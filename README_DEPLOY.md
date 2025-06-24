# SuperMarket Pro - Despliegue en Render.com

## ✅ Correcciones
✔ Se agregó `email_validator` a requirements.txt.
✔ Se reemplazó el uso de `moment()` en Jinja por Moment.js en el navegador.

## 🚀 Deploy sin fallas:
1. Render detecta `render.yaml` y crea servicio y base de datos.
2. Variables `SECRET_KEY` y `DATABASE_URL` se generan automáticamente.
3. Fecha se renderiza con JavaScript, sin error de `moment` en Jinja.