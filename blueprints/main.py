from flask import Blueprint, render_template
from flask_login import login_required, current_user
from models import Product, Sale, Customer, Category, SaleItem, db
from datetime import datetime, timedelta
from sqlalchemy import func

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    """Página de inicio pública"""
    return render_template('index.html')

@main_bp.route('/dashboard')
@login_required
def dashboard():
    # Estadísticas del dashboard
    today = datetime.utcnow().date()
    yesterday = today - timedelta(days=1)
    
    # Ventas de hoy
    today_sales = db.session.query(func.sum(Sale.total_amount)).filter(
        func.date(Sale.sale_date) == today,
        Sale.status == 'completed'
    ).scalar() or 0
    
    # Ventas de ayer
    yesterday_sales = db.session.query(func.sum(Sale.total_amount)).filter(
        func.date(Sale.sale_date) == yesterday,
        Sale.status == 'completed'
    ).scalar() or 0
    
    # Calcular cambio porcentual
    sales_change = 0
    if yesterday_sales > 0:
        sales_change = ((today_sales - yesterday_sales) / yesterday_sales) * 100
    
    # Conteo de productos
    total_products = Product.query.filter_by(is_active=True).count()
    
    # Conteo de clientes
    total_customers = Customer.query.filter_by(is_active=True).count()
    
    # Ventas del día (número de transacciones)
    today_orders = Sale.query.filter(
        func.date(Sale.sale_date) == today,
        Sale.status == 'completed'
    ).count()
    
    # Productos con stock bajo
    low_stock_products = Product.query.filter(
        Product.stock_quantity <= Product.min_stock,
        Product.is_active == True
    ).order_by(Product.stock_quantity.asc()).limit(5).all()
    
    # Ventas recientes
    recent_sales = Sale.query.filter_by(status='completed').order_by(
        Sale.sale_date.desc()
    ).limit(5).all()
    
    # Top productos por ventas (último mes)
    last_month = datetime.utcnow() - timedelta(days=30)
    top_products = db.session.query(
        Product.name,
        func.sum(SaleItem.quantity).label('total_sold')
    ).join(SaleItem).join(Sale).filter(
        Sale.sale_date >= last_month,
        Sale.status == 'completed'
    ).group_by(Product.id).order_by(
        func.sum(SaleItem.quantity).desc()
    ).limit(5).all()
    
    # Datos para gráficos - ventas por día (última semana)
    week_ago = datetime.utcnow() - timedelta(days=7)
    daily_sales = db.session.query(
        func.date(Sale.sale_date).label('date'),
        func.sum(Sale.total_amount).label('total')
    ).filter(
        Sale.sale_date >= week_ago,
        Sale.status == 'completed'
    ).group_by(func.date(Sale.sale_date)).all()
    
    stats = {
        'today_sales': float(today_sales),
        'sales_change': round(sales_change, 1),
        'total_products': total_products,
        'total_customers': total_customers,
        'today_orders': today_orders,
        'low_stock_count': len(low_stock_products)
    }
    
    return render_template('main/dashboard.html', 
                         stats=stats,
                         low_stock_products=low_stock_products,
                         recent_sales=recent_sales,
                         top_products=top_products,
                         daily_sales=daily_sales)