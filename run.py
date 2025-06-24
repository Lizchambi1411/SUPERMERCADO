#!/usr/bin/env python3
"""
SuperMarket Pro - Sistema de Gestión de Inventario
Aplicación Flask con patrón MVC
"""

import os
from app import create_app

app = create_app()

if __name__ == '__main__':
    # Para desarrollo local
    app.run(debug=True, host='0.0.0.0', port=5000)
else:
    # Para producción (Render)
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)