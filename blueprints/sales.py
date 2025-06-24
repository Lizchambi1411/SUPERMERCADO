from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify
from flask_login import login_required, current_user
from models import Sale, SaleItem, Product, Customer, db
from forms import SaleForm
from datetime import datetime
import json

sales_bp = Blueprint('sales', __name__)

@sales_bp.route('/')
@login_required
def index():
    page = request.args.get('page', 1, type=int)
    sales = Sale.query.order_by(Sale.sale_date.desc()).paginate(
        page=page, per_page=20, error_out=False
    )
    return render_template('sales/index.html', sales=sales)

@sales_bp.route('/new', methods=['GET', 'POST'])
@login_required
def new():
    form = SaleForm()
    if request.method == 'POST':
        # Procesar venta
        cart_data = request.form.get('cart_data')
        if not cart_data:
            flash('El carrito está vacío', 'error')
            return redirect(url_for('sales.new'))
        
        try:
            cart_items = json.loads(cart_data)
            if not cart_items:
                flash('El carrito está vacío', 'error')
                return redirect(url_for('sales.new'))
            
            # Calcular totales
            subtotal = sum(item['quantity'] * item['price'] for item in cart_items)
            discount = float(form.discount_amount.data or 0)
            total = subtotal - discount
            
            # Generar número de venta
            last_sale = Sale.query.order_by(Sale.id.desc()).first()
            sale_number = f"V{(last_sale.id + 1):06d}" if last_sale else "V000001"
            
            # Crear venta
            sale = Sale(
                sale_number=sale_number,
                subtotal=subtotal,
                discount_amount=discount,
                total_amount=total,
                payment_method=form.payment_method.data,
                customer_id=form.customer_id.data.id if form.customer_id.data else None,
                user_id=current_user.id,
                notes=form.notes.data
            )
            db.session.add(sale)
            db.session.flush()  # Para obtener el ID de la venta
            
            # Crear items de venta y actualizar stock
            for item in cart_items:
                product = Product.query.get(item['product_id'])
                if product.stock_quantity < item['quantity']:
                    flash(f'Stock insuficiente para {product.name}', 'error')
                    db.session.rollback()
                    return redirect(url_for('sales.new'))
                
                # Crear item de venta
                sale_item = SaleItem(
                    sale_id=sale.id,
                    product_id=item['product_id'],
                    quantity=item['quantity'],
                    unit_price=item['price'],
                    subtotal=item['quantity'] * item['price']
                )
                db.session.add(sale_item)
                
                # Actualizar stock
                product.stock_quantity -= item['quantity']
            
            db.session.commit()
            flash('Venta registrada exitosamente', 'success')
            return redirect(url_for('sales.view', id=sale.id))
            
        except Exception as e:
            db.session.rollback()
            flash('Error al procesar la venta', 'error')
            return redirect(url_for('sales.new'))
    
    return render_template('sales/new.html', form=form)

@sales_bp.route('/<int:id>')
@login_required
def view(id):
    sale = Sale.query.get_or_404(id)
    return render_template('sales/view.html', sale=sale)

@sales_bp.route('/<int:id>/receipt')
@login_required
def receipt(id):
    sale = Sale.query.get_or_404(id)
    return render_template('sales/receipt.html', sale=sale)

@sales_bp.route('/<int:id>/edit', methods=['GET', 'POST'])
@login_required
def edit(id):
    sale = Sale.query.get_or_404(id)
    form = SaleForm(obj=sale)
    
    if form.validate_on_submit():
        sale.payment_method = form.payment_method.data
        sale.discount_amount = form.discount_amount.data or 0
        sale.notes = form.notes.data
        sale.customer_id = form.customer_id.data.id if form.customer_id.data else None
        
        # Recalcular total
        sale.total_amount = sale.subtotal - sale.discount_amount
        
        db.session.commit()
        flash('Venta actualizada exitosamente', 'success')
        return redirect(url_for('sales.view', id=sale.id))
    
    return render_template('sales/edit.html', form=form, sale=sale)

@sales_bp.route('/<int:id>/cancel', methods=['POST'])
@login_required
def cancel(id):
    sale = Sale.query.get_or_404(id)
    
    if sale.status == 'cancelled':
        flash('La venta ya está cancelada', 'warning')
        return redirect(url_for('sales.view', id=sale.id))
    
    # Restaurar stock
    for item in sale.sale_items:
        product = item.product
        product.stock_quantity += item.quantity
    
    sale.status = 'cancelled'
    db.session.commit()
    
    flash('Venta cancelada exitosamente', 'success')
    return redirect(url_for('sales.view', id=sale.id))

@sales_bp.route('/api/products/search')
@login_required
def api_products_search():
    """API endpoint para búsqueda de productos en tiempo real"""
    query = request.args.get('q', '')
    if len(query) < 2:
        return jsonify([])
    
    products = Product.query.filter(
        Product.name.contains(query),
        Product.is_active == True,
        Product.stock_quantity > 0
    ).limit(10).all()
    
    return jsonify([{
        'id': p.id,
        'name': p.name,
        'price': float(p.selling_price),
        'stock': p.stock_quantity,
        'barcode': p.barcode,
        'unit': p.unit
    } for p in products])