from flask import Blueprint, render_template, request, make_response
from flask_login import login_required
from models import Sale, Product, Customer, SaleItem, db
from datetime import datetime, timedelta
from sqlalchemy import func
from decorators import admin_required
import csv
import io

reports_bp = Blueprint('reports', __name__)

@reports_bp.route('/')
@login_required
@admin_required
def index():
    return render_template('reports/index.html')

@reports_bp.route('/sales')
@login_required
@admin_required
def sales():
    # Fechas por defecto (último mes)
    end_date = datetime.utcnow().date()
    start_date = end_date - timedelta(days=30)
    
    # Obtener fechas del formulario si se proporcionan
    if request.args.get('start_date'):
        start_date = datetime.strptime(request.args.get('start_date'), '%Y-%m-%d').date()
    if request.args.get('end_date'):
        end_date = datetime.strptime(request.args.get('end_date'), '%Y-%m-%d').date()
    
    # Ventas por día
    daily_sales = db.session.query(
        func.date(Sale.sale_date).label('date'),
        func.sum(Sale.total_amount).label('total'),
        func.count(Sale.id).label('count')
    ).filter(
        func.date(Sale.sale_date).between(start_date, end_date),
        Sale.status == 'completed'
    ).group_by(func.date(Sale.sale_date)).all()
    
    # Productos más vendidos
    top_products = db.session.query(
        Product.name,
        func.sum(SaleItem.quantity).label('total_sold'),
        func.sum(SaleItem.subtotal).label('total_revenue')
    ).join(SaleItem).join(Sale).filter(
        func.date(Sale.sale_date).between(start_date, end_date),
        Sale.status == 'completed'
    ).group_by(Product.id).order_by(
        func.sum(SaleItem.quantity).desc()
    ).limit(10).all()
    
    # Totales
    total_sales = db.session.query(func.sum(Sale.total_amount)).filter(
        func.date(Sale.sale_date).between(start_date, end_date),
        Sale.status == 'completed'
    ).scalar() or 0
    
    total_orders = Sale.query.filter(
        func.date(Sale.sale_date).between(start_date, end_date),
        Sale.status == 'completed'
    ).count()
    
    return render_template('reports/sales.html',
                         daily_sales=daily_sales,
                         top_products=top_products,
                         total_sales=total_sales,
                         total_orders=total_orders,
                         start_date=start_date,
                         end_date=end_date)

@reports_bp.route('/products')
@login_required
@admin_required
def products():
    # Productos con stock bajo
    low_stock = Product.query.filter(
        Product.stock_quantity <= Product.min_stock,
        Product.is_active == True
    ).order_by(Product.stock_quantity.asc()).all()
    
    # Productos más vendidos (último mes)
    last_month = datetime.utcnow() - timedelta(days=30)
    most_sold = db.session.query(
        Product.name,
        Product.stock_quantity,
        func.sum(SaleItem.quantity).label('total_sold')
    ).join(SaleItem).join(Sale).filter(
        Sale.sale_date >= last_month,
        Sale.status == 'completed'
    ).group_by(Product.id).order_by(
        func.sum(SaleItem.quantity).desc()
    ).limit(10).all()
    
    # Productos sin ventas
    no_sales = Product.query.outerjoin(SaleItem).filter(
        SaleItem.id.is_(None),
        Product.is_active == True
    ).all()
    
    return render_template('reports/products.html',
                         low_stock=low_stock,
                         most_sold=most_sold,
                         no_sales=no_sales)

@reports_bp.route('/customers')
@login_required
@admin_required
def customers():
    # Clientes con más compras
    top_customers = db.session.query(
        Customer.first_name,
        Customer.last_name,
        Customer.email,
        func.count(Sale.id).label('total_orders'),
        func.sum(Sale.total_amount).label('total_spent')
    ).join(Sale).filter(
        Sale.status == 'completed'
    ).group_by(Customer.id).order_by(
        func.sum(Sale.total_amount).desc()
    ).limit(10).all()
    
    return render_template('reports/customers.html', top_customers=top_customers)

@reports_bp.route('/export/sales')
@login_required
@admin_required
def export_sales():
    # Obtener datos de ventas
    sales = Sale.query.filter_by(status='completed').order_by(Sale.sale_date.desc()).all()
    
    # Crear CSV
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Escribir encabezados
    writer.writerow(['Número de Venta', 'Fecha', 'Cliente', 'Subtotal', 'Descuento', 'Total', 'Método de Pago'])
    
    # Escribir datos
    for sale in sales:
        writer.writerow([
            sale.sale_number,
            sale.sale_date.strftime('%Y-%m-%d %H:%M'),
            sale.customer.full_name if sale.customer else 'Cliente General',
            sale.subtotal,
            sale.discount_amount,
            sale.total_amount,
            sale.payment_method
        ])
    
    # Crear respuesta
    response = make_response(output.getvalue())
    response.headers['Content-Type'] = 'text/csv'
    response.headers['Content-Disposition'] = 'attachment; filename=ventas.csv'
    
    return response

@reports_bp.route('/export/products')
@login_required
@admin_required
def export_products():
    # Obtener datos de productos
    products = Product.query.filter_by(is_active=True).order_by(Product.name).all()
    
    # Crear CSV
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Escribir encabezados
    writer.writerow(['Nombre', 'Categoría', 'Precio Costo', 'Precio Venta', 'Stock Actual', 'Stock Mínimo', 'Estado Stock'])
    
    # Escribir datos
    for product in products:
        stock_status = 'Crítico' if product.stock_quantity <= product.min_stock * 0.5 else \
                      'Bajo' if product.stock_quantity <= product.min_stock else 'Normal'
        
        writer.writerow([
            product.name,
            product.category.name,
            product.cost_price,
            product.selling_price,
            product.stock_quantity,
            product.min_stock,
            stock_status
        ])
    
    # Crear respuesta
    response = make_response(output.getvalue())
    response.headers['Content-Type'] = 'text/csv'
    response.headers['Content-Disposition'] = 'attachment; filename=productos.csv'
    
    return response