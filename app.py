from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_wtf.csrf import CSRFProtect
from config import Config
import os


db = SQLAlchemy()
login_manager = LoginManager()
csrf = CSRFProtect()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
   
    db.init_app(app)
    login_manager.init_app(app)
    csrf.init_app(app)
    
    
    login_manager.login_view = 'auth.login'
    login_manager.login_message = 'Por favor inicia sesión para acceder a esta página.'
    login_manager.login_message_category = 'info'
    
    
    from blueprints.auth import auth_bp
    from blueprints.main import main_bp
    from blueprints.products import products_bp
    from blueprints.categories import categories_bp
    from blueprints.suppliers import suppliers_bp
    from blueprints.customers import customers_bp
    from blueprints.sales import sales_bp
    from blueprints.inventory import inventory_bp
    from blueprints.reports import reports_bp
    from blueprints.users import users_bp
    
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(main_bp)
    app.register_blueprint(products_bp, url_prefix='/products')
    app.register_blueprint(categories_bp, url_prefix='/categories')
    app.register_blueprint(suppliers_bp, url_prefix='/suppliers')
    app.register_blueprint(customers_bp, url_prefix='/customers')
    app.register_blueprint(sales_bp, url_prefix='/sales')
    app.register_blueprint(inventory_bp, url_prefix='/inventory')
    app.register_blueprint(reports_bp, url_prefix='/reports')
    app.register_blueprint(users_bp, url_prefix='/users')
    
    # Crear tablas y datos de ejemplo
    with app.app_context():
        db.create_all()
        # Solo crear datos de ejemplo en desarrollo
        if not os.environ.get('FLASK_ENV') == 'production':
            create_sample_data()
        else:
            # En producción, crear solo el usuario admin si no existe
            create_admin_user()
    
    return app

def create_admin_user():
    """Crear usuario administrador en producción si no existe"""
    from models import User
    from werkzeug.security import generate_password_hash
    
    # Solo crear admin si no hay usuarios
    if User.query.count() == 0:
        admin = User(
            username='admin',
            email='admin@supermarketpro.com',
            password_hash=generate_password_hash('SuperMarket2024!'),
            first_name='Administrador',
            last_name='Sistema',
            role='admin',
            is_active=True
        )
        db.session.add(admin)
        db.session.commit()
        print("✅ Usuario administrador creado: admin@supermarketpro.com / SuperMarket2024!")

def create_sample_data():
    """Crear datos de ejemplo si no existen"""
    from models import User, Category, Supplier, Product, Customer
    from werkzeug.security import generate_password_hash
    
    # Solo crear datos si no hay usuarios
    if User.query.count() == 0:
        # Crear usuario administrador
        admin = User(
            username='admin',
            email='admin@supermercado.com',
            password_hash=generate_password_hash('admin123'),
            first_name='María',
            last_name='González',
            role='admin',
            is_active=True
        )
        db.session.add(admin)
        
        # Crear usuario vendedor
        vendedor = User(
            username='vendedor',
            email='vendedor@supermercado.com',
            password_hash=generate_password_hash('vendedor123'),
            first_name='Carlos',
            last_name='Rodríguez',
            role='vendedor',
            is_active=True
        )
        db.session.add(vendedor)
        
        # Crear categorías de ejemplo
        categories_data = [
            {'name': 'Lácteos', 'description': 'Productos lácteos y derivados'},
            {'name': 'Panadería', 'description': 'Pan, bollería y productos de panadería'},
            {'name': 'Carnes', 'description': 'Carnes frescas y embutidos'},
            {'name': 'Verduras', 'description': 'Verduras y hortalizas frescas'},
            {'name': 'Frutas', 'description': 'Frutas frescas de temporada'},
            {'name': 'Bebidas', 'description': 'Bebidas alcohólicas y no alcohólicas'},
            {'name': 'Granos', 'description': 'Arroz, legumbres y cereales'},
            {'name': 'Aceites', 'description': 'Aceites y grasas comestibles'}
        ]
        
        for cat_data in categories_data:
            category = Category(**cat_data)
            db.session.add(category)
        
        # Crear proveedores de ejemplo
        suppliers_data = [
            {
                'name': 'Distribuidora Norte',
                'contact_person': 'Ana Martínez',
                'email': 'ana@distrinorte.com',
                'phone': '555-0101',
                'address': 'Av. Industrial 123, Ciudad Norte'
            },
            {
                'name': 'Granos del Valle',
                'contact_person': 'Pedro Sánchez',
                'email': 'pedro@granosvalle.com',
                'phone': '555-0102',
                'address': 'Calle Rural 456, Valle Verde'
            },
            {
                'name': 'Panificadora Central',
                'contact_person': 'Luis García',
                'email': 'luis@pancentral.com',
                'phone': '555-0103',
                'address': 'Plaza Central 789, Centro'
            }
        ]
        
        for sup_data in suppliers_data:
            supplier = Supplier(**sup_data)
            db.session.add(supplier)
        
        # Crear clientes de ejemplo
        customers_data = [
            {
                'first_name': 'Ana',
                'last_name': 'García',
                'email': 'ana.garcia@email.com',
                'phone': '555-0201',
                'address': 'Calle Principal 123',
                'customer_type': 'individual'
            },
            {
                'first_name': 'Carlos',
                'last_name': 'López',
                'email': 'carlos.lopez@email.com',
                'phone': '555-0202',
                'address': 'Av. Central 456',
                'customer_type': 'individual'
            }
        ]
        
        for cust_data in customers_data:
            customer = Customer(**cust_data)
            db.session.add(customer)
        
        db.session.commit()
        
        # Crear productos de ejemplo (después de commit para tener IDs)
        products_data = [
            {
                'name': 'Leche Entera 1L',
                'description': 'Leche entera pasteurizada de alta calidad',
                'barcode': '7501234567890',
                'cost_price': 2.50,
                'selling_price': 3.00,
                'stock_quantity': 45,
                'min_stock': 20,
                'max_stock': 100,
                'unit': 'unidad',
                'category_id': 1,
                'supplier_id': 1
            },
            {
                'name': 'Pan Integral',
                'description': 'Pan integral artesanal',
                'barcode': '7501234567891',
                'cost_price': 1.20,
                'selling_price': 2.00,
                'stock_quantity': 32,
                'min_stock': 25,
                'max_stock': 80,
                'unit': 'unidad',
                'category_id': 2,
                'supplier_id': 3
            }
        ]
        
        for prod_data in products_data:
            product = Product(**prod_data)
            db.session.add(product)
        
        db.session.commit()

if __name__ == '__main__':
    app = create_app()
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)