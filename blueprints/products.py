from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify
from flask_login import login_required, current_user
from models import Product, Category, Supplier, db
from forms import ProductForm, DeleteForm
from decorators import admin_required

products_bp = Blueprint('products', __name__)

@products_bp.route('/')
@login_required
def index():
    page = request.args.get('page', 1, type=int)
    search = request.args.get('search', '')
    category_id = request.args.get('category', type=int)
    
    query = Product.query.filter_by(is_active=True)
    
    if search:
        query = query.filter(Product.name.contains(search))
    
    if category_id:
        query = query.filter_by(category_id=category_id)
    
    products = query.order_by(Product.name).paginate(
        page=page, per_page=12, error_out=False
    )
    
    categories = Category.query.filter_by(is_active=True).all()
    
    delete_form = DeleteForm()
    return render_template('products/index.html', 
                         products=products, 
                         categories=categories,
                         search=search,
                         category_id=category_id,
                         delete_form=delete_form)

@products_bp.route('/add', methods=['GET', 'POST'])
@login_required
def add():
    form = ProductForm()
    if form.validate_on_submit():
        product = Product(
            name=form.name.data,
            description=form.description.data,
            barcode=form.barcode.data,
            cost_price=form.cost_price.data,
            selling_price=form.selling_price.data,
            stock_quantity=form.stock_quantity.data,
            min_stock=form.min_stock.data,
            max_stock=form.max_stock.data,
            unit=form.unit.data,
            category_id=form.category_id.data.id,
            supplier_id=form.supplier_id.data.id if form.supplier_id.data else None,
            is_active=form.is_active.data
        )
        db.session.add(product)
        db.session.commit()
        flash('Producto agregado exitosamente', 'success')
        return redirect(url_for('products.index'))
    
    return render_template('products/form.html', form=form, title='Agregar Producto')

@products_bp.route('/<int:id>')
@login_required
def view(id):
    product = Product.query.get_or_404(id)
    return render_template('products/view.html', product=product)

@products_bp.route('/<int:id>/edit', methods=['GET', 'POST'])
@login_required
@admin_required
def edit(id):
    product = Product.query.get_or_404(id)
    form = ProductForm(obj=product)
    
    if form.validate_on_submit():
        form.populate_obj(product)
        product.category_id = form.category_id.data.id
        product.supplier_id = form.supplier_id.data.id if form.supplier_id.data else None
        db.session.commit()
        flash('Producto actualizado exitosamente', 'success')
        return redirect(url_for('products.view', id=product.id))
    
    return render_template('products/form.html', form=form, product=product, title='Editar Producto')

@products_bp.route('/<int:id>/delete', methods=['POST'])
@login_required
@admin_required
def delete(id):
    product = Product.query.get_or_404(id)
    product.is_active = False
    db.session.commit()
    flash('Producto eliminado exitosamente', 'success')
    return redirect(url_for('products.index'))

@products_bp.route('/api/search')
@login_required
def api_search():
    """API endpoint para búsqueda de productos (para el sistema de ventas)"""
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
        'barcode': p.barcode
    } for p in products])