from flask import Blueprint, render_template, request, redirect, url_for, flash
from flask_login import login_required, current_user
from models import Product, InventoryMovement, db
from forms import InventoryMovementForm
from decorators import admin_required

inventory_bp = Blueprint('inventory', __name__)

@inventory_bp.route('/')
@login_required
@admin_required
def index():
    # Productos con stock crítico y bajo
    critical_products = Product.query.filter(
        Product.stock_quantity <= Product.min_stock * 0.5,
        Product.is_active == True
    ).all()
    
    low_stock_products = Product.query.filter(
        Product.stock_quantity <= Product.min_stock,
        Product.stock_quantity > Product.min_stock * 0.5,
        Product.is_active == True
    ).all()
    
    return render_template('inventory/index.html', 
                         critical_products=critical_products,
                         low_stock_products=low_stock_products)

@inventory_bp.route('/movements')
@login_required
@admin_required
def movements():
    page = request.args.get('page', 1, type=int)
    movements = InventoryMovement.query.order_by(
        InventoryMovement.movement_date.desc()
    ).paginate(page=page, per_page=20, error_out=False)
    
    return render_template('inventory/movements.html', movements=movements)

@inventory_bp.route('/movements/add', methods=['GET', 'POST'])
@login_required
@admin_required
def add_movement():
    form = InventoryMovementForm()
    if form.validate_on_submit():
        product = form.product_id.data
        movement_type = form.movement_type.data
        quantity = form.quantity.data
        
        # Validar stock para salidas
        if movement_type == 'salida' and product.stock_quantity < quantity:
            flash('Stock insuficiente para realizar la salida', 'error')
            return render_template('inventory/movement_form.html', form=form)
        
        # Crear movimiento
        movement = InventoryMovement(
            product_id=product.id,
            movement_type=movement_type,
            quantity=quantity,
            reason=form.reason.data,
            notes=form.notes.data,
            user_id=current_user.id
        )
        db.session.add(movement)
        
        # Actualizar stock del producto
        if movement_type == 'entrada':
            product.stock_quantity += quantity
        elif movement_type == 'salida':
            product.stock_quantity -= quantity
        elif movement_type == 'ajuste':
            product.stock_quantity = quantity
        
        db.session.commit()
        flash('Movimiento de inventario registrado exitosamente', 'success')
        return redirect(url_for('inventory.movements'))
    
    return render_template('inventory/movement_form.html', form=form)

@inventory_bp.route('/products/<int:id>/adjust', methods=['GET', 'POST'])
@login_required
@admin_required
def adjust_product(id):
    product = Product.query.get_or_404(id)
    
    if request.method == 'POST':
        new_quantity = int(request.form.get('new_quantity', 0))
        reason = request.form.get('reason', '')
        notes = request.form.get('notes', '')
        
        if new_quantity < 0:
            flash('La cantidad no puede ser negativa', 'error')
            return render_template('inventory/adjust.html', product=product)
        
        # Crear movimiento de ajuste
        movement = InventoryMovement(
            product_id=product.id,
            movement_type='ajuste',
            quantity=new_quantity,
            reason=reason,
            notes=notes,
            user_id=current_user.id
        )
        db.session.add(movement)
        
        # Actualizar stock
        product.stock_quantity = new_quantity
        db.session.commit()
        
        flash(f'Stock de {product.name} ajustado a {new_quantity}', 'success')
        return redirect(url_for('inventory.index'))
    
    return render_template('inventory/adjust.html', product=product)

@inventory_bp.route('/report')
@login_required
@admin_required
def report():
    products = Product.query.filter_by(is_active=True).order_by(Product.name).all()
    return render_template('inventory/report.html', products=products)